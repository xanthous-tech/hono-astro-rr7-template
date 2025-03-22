import { Stripe } from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SK || 'invalidStripeSK', {
  apiVersion: '2025-02-24.acacia',
});

export async function redirectToStripeBillingPortal(
  customerId: string,
  returnUrl: string,
) {
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return portal;
}

export async function createStripeCustomer(
  userId: string,
  userName?: string,
  userEmail?: string,
) {
  const params: Stripe.CustomerCreateParams = {
    name: userName,
    email: userEmail,
    metadata: { userId: userId },
  };

  const options: Stripe.RequestOptions = {
    idempotencyKey: userId,
  };

  return await stripe.customers.create(params, options);
}
