import { PinoLogger } from 'hono-pino';

import { User, Session } from '@/db/schema';

declare module 'hono' {
  interface ContextVariableMap {
    user: User | null;
    session: Session | null;
    logger: PinoLogger;
  }
}
