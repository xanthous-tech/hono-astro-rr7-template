import { atom, useAtom, useAtomValue } from 'jotai';
import { createSearchParams, useLocation, useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { useCallback, useEffect } from 'react';
import { useAtomCallback } from 'jotai/utils';

// initialize with a fake session cookie, so on mount it doesn't jump
export const sessionCookieAtom = atom<string | undefined>('fake_session');
export const checkingSessionAtom = atom(true);

sessionCookieAtom.onMount = (setSessionCookie) => {
  const authSessionCookie = Cookies.get('auth_session');
  setSessionCookie(authSessionCookie);
};

export const loggedInAtom = atom((get) => {
  const sessionCookie = get(sessionCookieAtom);
  return sessionCookie !== 'fake_session' && !!sessionCookie;
});

export function useSession() {
  const [checkingSession, setCheckingSession] = useAtom(checkingSessionAtom);
  const sessionCookie = useAtomValue(sessionCookieAtom);
  const loggedIn = useAtomValue(loggedInAtom);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const signOut = useAtomCallback(
    useCallback((_get, set) => {
      Cookies.remove('auth_session');
      set(sessionCookieAtom, undefined);
      navigate('/signin');
    }, []),
  );

  useEffect(() => {
    if (sessionCookie !== 'fake_session') {
      setCheckingSession(false);
    }

    if (!sessionCookie && pathname !== '/signin') {
      navigate({
        pathname: '/signin',
        search: createSearchParams({
          callbackUrl: pathname === '/' ? '/dashboard' : pathname,
        }).toString(),
      });
    }
  }, [pathname, sessionCookie]);

  return {
    sessionId: sessionCookie,
    loading: checkingSession,
    loggedIn,
    signOut,
  };
}
