import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useUserInfo } from '~/hooks/api';

import { SmallLoadingState } from '~/components/LoadingStates';

export function IndexPage() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUserInfo();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      navigate('/signin?callbackUrl=/dashboard');
      return;
    }

    navigate('/dashboard');
  }, [isLoading, user]);

  return <SmallLoadingState />;
}
