import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trimTrailingSlash } from 'hono/trailing-slash';

import { API_URL, APP_URL, IS_PROD } from './config/server';
import { httpLogger, logger as parentLogger } from './utils/logger';
import { deleteExpiredSessions } from './lib/auth';
import {
  authMiddleware,
  authRouter,
  bullBoardAuthMiddleware,
} from './middlewares/auth';
import { paymentRouter } from './middlewares/payment';
import { apiRouter } from './api';
import { bullboardServerAdapter } from './queues';
import { workers } from './workers/register';

const logger = parentLogger.child({ component: 'main' });

logger.info(`imported workers: ${workers.map((w) => w.name).join(', ')}`);

const app = new Hono();

app.use(trimTrailingSlash());

// TODO: https://github.com/honojs/node-server/issues/39#issuecomment-1521589561
// app.use(compress());

if (IS_PROD) {
  app.use(httpLogger);
}

// auth middleware (injects user and session into req)
app.use(authMiddleware);

// cors middleware (only set it for /api/* routes)
app.use(
  '/api/*',
  cors({
    origin: [API_URL, APP_URL],
    credentials: true,
  }),
);

// handle server-side auth redirects
app.route('/api/auth', authRouter);

// handle stripe webhook
app.route('/api/payment', paymentRouter);

// api routes
app.route('/api', apiRouter);

// handle bull-board requests
app.use('/ctrls', bullBoardAuthMiddleware);
app.route('/ctrls', bullboardServerAdapter.registerPlugin());

// health check
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

const port = Number(process.env.PORT ?? 3000);

serve(
  {
    ...app,
    port,
  },
  async () => {
    await deleteExpiredSessions();
    logger.info(`Hono server listening at port ${port}`);
  },
);

export default app;
