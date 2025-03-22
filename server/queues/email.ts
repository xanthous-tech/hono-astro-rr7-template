import { Queue, QueueEvents } from 'bullmq';

import { EMAIL, EmailJobData } from '@/types/jobs/email';
import { defaultQueueEventsOptions, defaultQueueOptions } from '@/lib/bullmq';
import { logger as parentLogger } from '@/utils/logger';

const logger = parentLogger.child({ queue: EMAIL });
logger.trace(`register queue ${EMAIL}`);

export const emailQueue = new Queue<EmailJobData>(EMAIL, defaultQueueOptions);

const emailQueueEvents = new QueueEvents(EMAIL, defaultQueueEventsOptions);

emailQueue.on('error', (err) => {
  logger.error(err);
});

emailQueueEvents.on('error', (err) => {
  logger.error(err);
});

export async function email(payload: EmailJobData) {
  const job = await emailQueue.add(payload.emailType, payload);
  return job.waitUntilFinished(emailQueueEvents);
}
