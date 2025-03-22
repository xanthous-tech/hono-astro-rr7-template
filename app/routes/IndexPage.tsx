import { useNavigate } from 'react-router';

import { useSession } from '~/hooks/session';
import { useEffect } from 'react';

export function IndexPage() {
  const navigate = useNavigate();
  const { loading, loggedIn } = useSession();

  useEffect(() => {
    if (!loading && loggedIn) {
      navigate('/dashboard');
    }
  }, [loading, loggedIn]);

  return <div className="container m-8">Loading</div>;
}
