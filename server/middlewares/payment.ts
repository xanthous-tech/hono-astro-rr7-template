import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { SUBSCRIBE_SUCCESS } from '@/types/email';
import { STRIPE_PRICE_IDS } from '@/config/plans';
import { API_URL, APP_STAGE, APP_URL } from '@/config/server';
import { User } from '@/db/schema';
import { redirectToStripeBillingPortal, stripe } from '@/lib/stripe';
import { stripeWebhook } from '@/queues/stripe-webhook';
import { email } from '@/queues/email';

import { authCheckMiddleware } from './auth';

export const paymentRouter = new Hono();

paymentRouter.get(
  '/checkout/:checkoutId',
  authCheckMiddleware,
  zValidator(
    'param',
    z.object({
      checkoutId: z.string(),
    }),
  ),
  async (c) => {
    const { checkoutId } = c.req.valid('param');

    const session = await stripe.checkout.sessions.retrieve(checkoutId);

    // TODO: add dropped cart email here (with a delay)

    return c.json({
      id: checkoutId,
      url: session.url,
    });
  },
);

paymentRouter.get(
  '/checkout/success/:checkoutId',
  zValidator(
    'param',
    z.object({
      checkoutId: z.string(),
    }),
  ),
  async (c) => {
    const { checkoutId } = c.req.valid('param');

    const session = await stripe.checkout.sessions.retrieve(checkoutId);

    if (session.customer_email) {
      // send success email
      await email({
        emailType: SUBSCRIBE_SUCCESS,
        emailTo: session.customer_email,
        emailArgs: {},
      });
    }

    return c.redirect(`${APP_URL}/app/checkout/success`);
  },
);

// TODO: see if it makes sense to move the HKD pricing back in, if so add locale param
paymentRouter.get(
  '/checkout/:plan/:duration',
  authCheckMiddleware,
  zValidator(
    'param',
    z.object({
      plan: z.string(),
      duration: z.string(),
    }),
  ),
  async (c) => {
    const user = c.get('user') as User;

    const { plan, duration } = c.req.valid('param');

    const checkoutSession = await stripe.checkout.sessions.create({
      currency: 'usd',
      customer: user.customerId ?? undefined,
      client_reference_id: user.id,
      mode: 'subscription',
      allow_promotion_codes: false,
      payment_method_types: ['card'],
      line_items: [
        { price: STRIPE_PRICE_IDS[APP_STAGE][plan][duration], quantity: 1 },
      ],
      success_url: `${API_URL}/api/payment/checkout/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/app/checkout/canceled/{CHECKOUT_SESSION_ID}`,
      tax_id_collection: { enabled: true },
      customer_update: {
        name: 'auto',
        address: 'auto',
        shipping: 'auto',
      },
    });

    if (!checkoutSession.url) {
      return c.text('Error during checkout, please retry.', 500);
    }

    return c.redirect(checkoutSession.url);
  },
);

paymentRouter.get('/billing', authCheckMiddleware, async (c) => {
  const user = c.get('user') as User;

  if (!user.customerId) {
    return c.redirect(`${APP_URL}/app/dashboard`);
  }

  const billingPortal = await redirectToStripeBillingPortal(
    user.customerId,
    `${APP_URL}/app/dashboard`,
  );

  return c.redirect(billingPortal.url);
});

paymentRouter.post('/webhook', async (c) => {
  const { logger } = c.var;

  const STRIPE_SIGNING_SECRET =
    process.env.STRIPE_SIGNING_SECRET ?? 'invalidWebhookSecret';

  const signature = c.req.header('stripe-signature');

  if (!signature) {
    return c.text('No signature', 400);
  }

  try {
    const body = await c.req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_SIGNING_SECRET,
    );
    await stripeWebhook(event);
  } catch (err) {
    logger.error(err);
    return c.text('Invalid webhook', 400);
  }

  return c.text('OK', 200);
});
