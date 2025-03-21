import { Queue } from 'bullmq';
import type { Stripe } from 'stripe';

import { STRIPE_WEBHOOK } from '@/types/jobs/stripe-webhook';
import { defaultQueueOptions } from '@/lib/bullmq';
import { logger as parentLogger } from '@/utils/logger';

const logger = parentLogger.child({ queue: STRIPE_WEBHOOK });
logger.trace(`register queue ${STRIPE_WEBHOOK}`);

export const stripeWebhookQueue = new Queue<Stripe.Event>(
  STRIPE_WEBHOOK,
  defaultQueueOptions,
);

stripeWebhookQueue.on('error', (err) => {
  logger.error(err);
  // Sentry.captureException(err);
});

export async function stripeWebhook(event: Stripe.Event) {
  return stripeWebhookQueue.add(event.type, event, {
    jobId: event.id,
  });
}
