import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { apiUrl } from '~/lib/api';
import { useUserInfo } from '~/hooks/api';

import { SmallLoadingState } from '~/components/LoadingStates';

export function CheckoutPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: user, isLoading } = useUserInfo();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      navigate(`/signin?callbackUrl=${pathname}`);
      return;
    }

    // external redirect
    document.location.href = `${apiUrl}/api/payment${pathname}`;
  }, [isLoading, user]);

  return <SmallLoadingState />;
}
