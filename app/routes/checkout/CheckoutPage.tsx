import { useLocation } from 'react-router';

import { useSession } from '~/hooks/session';
import { useEffect } from 'react';
import { apiUrl } from '~/lib/api';

export function CheckoutPage() {
  const { pathname } = useLocation();
  const { loading, loggedIn } = useSession();

  useEffect(() => {
    if (!loading && loggedIn) {
      // external redirect
      document.location.href = `${apiUrl}/api/payment${pathname}`;
    }
  }, [loading, loggedIn]);

  return <div className="container m-8">Redirecting you to Stripe...</div>;
}
