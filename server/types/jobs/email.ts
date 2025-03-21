import { z } from 'zod';

import { MAGIC_LINK, SUBSCRIBE_SUCCESS } from '@/types/email';

export const EMAIL = 'email';

export const EMAIL_FROM = process.env.EMAIL_FROM ?? 'support@example.com';

export const emailJobDataSchema = z.object({
  emailType: z.enum([SUBSCRIBE_SUCCESS, MAGIC_LINK]),
  emailTo: z.string(),
  emailFrom: z.string().default(EMAIL_FROM).optional(),
  emailArgs: z.any(),
});

export type EmailJobData = z.infer<typeof emailJobDataSchema>;
