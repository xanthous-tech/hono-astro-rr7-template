import { redirect } from 'react-router';

import { Route } from '@react-router-route-types/dashboard.billing';

import { APP_URL } from '@/config/server';
import { redirectToStripeBillingPortal } from '@/lib/stripe';
import { validateSession } from '~/lib/session.server';

export const loader = async (args: Route.LoaderArgs) => {
  const { user } = await validateSession(args);

  if (!user.customerId) {
    throw redirect('/dashboard');
  }

  const billingPortal = await redirectToStripeBillingPortal(
    user.customerId,
    `${APP_URL}/dashboard`,
  );

  return redirect(billingPortal.url);
};
