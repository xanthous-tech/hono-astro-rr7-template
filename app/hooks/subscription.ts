import { useSubscription } from './api';

export function useSubscriptionStatus() {
  const { data: subscription } = useSubscription();

  return {
    plan: subscription?.plan,
    isSubscribed: subscription?.status === 'active',
  };
}
