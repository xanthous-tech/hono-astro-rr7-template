import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

import { MAGIC_LINK } from '@/types/email';
import { API_URL } from '@/config/server';
import { generateIdFromEntropySize } from '@/utils/crypto';
import { createMagicToken } from '@/utils/magic-link';
import { authCheckMiddleware } from '@/middlewares/auth';
import { db } from '@/db/drizzle';
import { quotaTable, subscriptionTable, User } from '@/db/schema';
import { email } from '@/queues/email';

export const userRouter = new Hono()
  .post(
    '/signin',
    zValidator(
      'json',
      z.object({
        emailTo: z.string().email(),
        locale: z.string().optional(),
      }),
    ),
    async (c) => {
      const { emailTo, locale } = c.req.valid('json');

      try {
        const token = await createMagicToken(emailTo);
        await email({
          emailType: MAGIC_LINK,
          emailTo,
          emailArgs: {
            locale: locale ?? 'en',
            link: `${API_URL}/api/auth/magic-link/${token}`,
          },
        });

        return c.json({ emailTo });
      } catch (err: any) {
        throw c.json(err.message, 400);
      }
    },
  )
  .get('/info', authCheckMiddleware, async (c) => {
    const user = c.get('user') as User;

    // TODO: expose more fields if needed
    return c.json({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      roleLevel: user.roleLevel,
    });
  })
  .get('/subscription', authCheckMiddleware, async (c) => {
    const user = c.get('user') as User;

    const subscriptions = await db
      .select()
      .from(subscriptionTable)
      .where(eq(subscriptionTable.userId, user.id))
      .limit(1);

    const subscription = subscriptions?.[0];

    if (!subscription) {
      return c.json(null);
    }

    return c.json({
      status: subscription.status,
      plan: subscription.plan,
    });
  })
  .get('/quota', authCheckMiddleware, async (c) => {
    const user = c.get('user') as User;

    let quotas = await db
      .select()
      .from(quotaTable)
      .where(eq(quotaTable.userId, user.id))
      .limit(1);

    if (quotas.length === 0) {
      quotas = await db
        .insert(quotaTable)
        .values({
          id: generateIdFromEntropySize(10),
          userId: user.id,
          limit: 5,
          used: 0,
        })
        .returning();
    }

    const quota = quotas[0];

    return c.json({
      limit: quota.limit,
      used: quota.used,
    });
  });
