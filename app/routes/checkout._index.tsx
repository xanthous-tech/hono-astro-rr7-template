import { data, redirect } from 'react-router';

import { Route } from '@react-router-route-types/checkout._index';

import { stripe } from '@/lib/stripe';
import { validateSession } from '~/lib/session.server';
import { STRIPE_PRICE_IDS } from '@/config/plans';
import { APP_STAGE, APP_URL } from '@/config/server';

export const loader = async (args: Route.LoaderArgs) => {
  const { user } = await validateSession(args);

  const checkoutSession = await stripe.checkout.sessions.create({
    client_reference_id: user.id,
    mode: 'subscription',
    allow_promotion_codes: false,
    payment_method_types: ['card'],
    line_items: [
      // { price: STRIPE_PRICE_IDS[APP_STAGE].recurring, quantity: 1 },
      // {
      //   price: STRIPE_PRICE_IDS[APP_STAGE].metered,
      // },
    ],
    success_url: `${APP_URL}/checkout/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/checkout/canceled/{CHECKOUT_SESSION_ID}`,
    tax_id_collection: { enabled: true },
  });

  if (!checkoutSession.url) {
    throw data('Error during checkout, please retry.', { status: 500 });
  }

  return redirect(checkoutSession.url);
};
