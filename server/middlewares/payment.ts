import { Hono } from 'hono';

import { stripe } from '@/lib/stripe';
import { logger as parentLogger } from '@/utils/logger';
import { stripeWebhook } from '@/queues/stripe-webhook';

const logger = parentLogger.child({ module: 'payment' });
export const paymentRouter = new Hono();

paymentRouter.post('/webhook', async (c) => {
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
