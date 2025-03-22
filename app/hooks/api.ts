import { useQuery, useMutation } from '@tanstack/react-query';

import type { User, Subscription, Quota } from '@/db/schema';
import { apiClient, apiUrl } from '~/lib/api';

export function useUserInfo() {
  return useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await apiClient.user.info.$get();
      if (response.status === 401) {
        return null;
      }
      const result = (await response.json()) as unknown as User;
      return result;
    },
    staleTime: 300 * 10000,
    refetchInterval: 300 * 10000,
    refetchOnWindowFocus: true,
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: async (payload: { emailTo: string; locale?: string }) => {
      const response = await apiClient.user.signin.$post({
        json: payload,
      });
      return response.json();
    },
  });
}

export function useSubscription() {
  return useQuery<Subscription | null>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await apiClient.user.subscription.$get();
      if (response.status === 401) {
        return null;
      }
      const result = (await response.json()) as unknown as Subscription;
      return result;
    },
    staleTime: 300 * 10000,
    refetchInterval: 300 * 10000,
    refetchOnWindowFocus: true,
  });
}

export function useQuota() {
  return useQuery<Quota | null>({
    queryKey: ['quota'],
    queryFn: async () => {
      const response = await apiClient.user.quota.$get();
      if (response.status === 401) {
        return null;
      }
      const result = (await response.json()) as unknown as Quota;
      return result;
    },
    staleTime: 300 * 10000,
    refetchInterval: 300 * 10000,
    refetchOnWindowFocus: true,
  });
}

export function useCheckoutSession(checkoutId?: string) {
  return useQuery<{ id: string; url: string } | null>({
    queryKey: ['checkout', checkoutId],
    queryFn: async () => {
      if (!checkoutId) {
        return null;
      }

      const response = await fetch(
        `${apiUrl}/api/payment/checkout/${checkoutId}`,
        {
          credentials: 'include',
        },
      );

      if (response.status === 401) {
        return null;
      }

      const result = await response.json();
      return result;
    },
  });
}
