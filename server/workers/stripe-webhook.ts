import { Job, Worker } from 'bullmq';
import { eq } from 'drizzle-orm';
import type { Stripe } from 'stripe';

import { STRIPE_WEBHOOK } from '@/types/jobs/stripe-webhook';
import { logger as parentLogger } from '@/utils/logger';
import { defaultWorkerOptions } from '@/lib/bullmq';
import { subscriptionTable, userTable } from '@/db/schema';
import { db } from '@/db/drizzle';
import { stripe } from '@/lib/stripe';

const logger = parentLogger.child({ worker: STRIPE_WEBHOOK });
logger.trace(`register worker for queue ${STRIPE_WEBHOOK}`);

async function stripeWebhookWorkerProcess(job: Job<Stripe.Event>) {
  const event = job.data;

  switch (event.type) {
    case 'checkout.session.completed': {
      // this event has the `client_reference_id` which is the user id.
      // update user name and email here, so it is easier to find the user by email in later events.

      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      const userId = checkoutSession.client_reference_id;

      if (!userId) {
        throw new Error(
          'client_reference_id is missing in the event, cannot continue.',
        );
      }

      // find user by id and update name and email.
      const users = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);

      if (users.length === 0) {
        throw new Error('user not found in the database.');
      }

      const user = users[0];

      // update user name and email.
      const updatedUser = await db
        .update(userTable)
        .set({
          name: checkoutSession.customer_details?.name,
          email: checkoutSession.customer_details?.email,
          customerId: checkoutSession.customer as string,
        })
        .where(eq(userTable.id, user.id))
        .returning();

      // update stripe customer with the internal user id into metadata.
      const stripeCustomer = await stripe.customers.update(
        checkoutSession.customer as string,
        {
          metadata: {
            userId: user.id,
          },
        },
      );

      return {
        user: updatedUser,
        stripeCustomer,
      };
    }
    case 'invoice.payment_succeeded': {
      // this event can be used to replenish recurring quotas for the user.
      break;
    }
    case 'invoice.payment_failed': {
      // this event can be used to notify failed payments, and alert us to take action.
      break;
    }
    case 'customer.subscription.created': {
      // create the user subscription in the subscription table, and link the user with customer id here.
      const subscriptionObject = event.data.object as Stripe.Subscription;

      // the metered subscription item is the last item in the subscription items array.
      const meteredSubscriptionItem =
        subscriptionObject.items.data.slice(-1)[0];

      const stripeCustomer = (await stripe.customers.retrieve(
        subscriptionObject.customer as string,
      )) as Stripe.Customer;

      const userId = stripeCustomer.metadata.userId;

      if (!userId) {
        throw new Error(
          'userId is missing in the stripe customer metadata, cannot continue.',
        );
      }

      const users = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);

      if (users.length === 0) {
        throw new Error('user not found in the database.');
      }

      const user = users[0];

      // create subscription record in the subscription table.

      const subscription = await db
        .insert(subscriptionTable)
        .values({
          id: subscriptionObject.id,
          userId: user.id,
          customerId: stripeCustomer.id,
          status: subscriptionObject.status,
        })
        .onConflictDoUpdate({
          target: [subscriptionTable.id],
          set: {
            userId: user.id,
            customerId: stripeCustomer.id,
            status: subscriptionObject.status,
          },
        });

      return subscription;
    }
    case 'customer.subscription.updated': {
      // update plan status in the subscription table.

      const subscriptionObject = event.data.object as Stripe.Subscription;

      const subscriptions = await db
        .select()
        .from(subscriptionTable)
        .where(eq(subscriptionTable.id, subscriptionObject.id))
        .limit(1);

      if (subscriptions.length === 0) {
        // FIXME: we can create a new subscription here, but this should not happen.
        throw new Error(
          'subscription not found in the database, this should not happen.',
        );
      }

      const { status } = subscriptionObject;
      const subscription = subscriptions[0];

      await db
        .update(subscriptionTable)
        .set({
          status,
        })
        .where(eq(subscriptionTable.id, subscription.id));

      switch (status) {
        case 'trialing': {
          // free trial
          break;
        }
        case 'active': {
          // subscription is active.
          break;
        }
        case 'past_due': {
          // last payment was not successful.
          break;
        }
        case 'unpaid': {
          // all retries failed.
          break;
        }
        case 'canceled': {
          // sub is cancelled.
          break;
        }
        case 'paused': {
          // trial ended but no default payment method.
          break;
        }
        default: {
          // unhandled status
        }
      }

      break;
    }
    case 'customer.subscription.deleted': {
      // we can clean up the user subscription in this event.
      break;
    }
    default: {
      // unhandled event
    }
  }
}

const stripeWebhookWorker = new Worker(
  STRIPE_WEBHOOK,
  stripeWebhookWorkerProcess,
  {
    ...defaultWorkerOptions,
    concurrency: 1,
  },
);

export default stripeWebhookWorker;
