import { pinoLogger } from 'hono-pino';
import pino from 'pino';

const transport = pino.transport(
  process.env.NODE_ENV === 'development'
    ? {
        targets: [
          {
            target: 'pino-pretty',
            options: { destination: 1 },
            level: 'trace',
          },
        ],
      }
    : {
        targets: [
          {
            target: 'pino/file',
            options: { destination: 1 },
            level: process.env.LOG_LEVEL ?? 'info',
          },
        ],
      },
);

export const logger = pino(
  { level: process.env.LOG_LEVEL ?? 'trace' },
  transport,
);

export const httpLogger = pinoLogger({
  pino: logger.child({ component: 'http' }),
});
