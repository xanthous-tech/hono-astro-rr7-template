import { createBullBoard } from '@bull-board/api';
import { HonoAdapter } from '@bull-board/hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

import { emailQueue } from './email';
import { stripeWebhookQueue } from './stripe-webhook';

export const bullboardServerAdapter = new HonoAdapter(serveStatic);
bullboardServerAdapter.setBasePath('/ctrls');

const queues = [emailQueue, stripeWebhookQueue].map(
  (queue) => new BullMQAdapter(queue),
);

createBullBoard({
  serverAdapter: bullboardServerAdapter,
  queues,
});
