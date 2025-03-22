import Cookies from 'js-cookie';

const cookieDomain = import.meta.env.PUBLIC_COOKIE_DOMAIN;

export function createCallbackUrlCookie(callbackUrl: string) {
  Cookies.set('auth_callback_url', callbackUrl, {
    domain: cookieDomain,
    httpOnly: false,
    path: '/',
    sameSite: 'lax',
    expires: new Date(Date.now() + 1000 * 60 * 10),
  });
}

export function getCallbackUrlFromCookie() {
  return Cookies.get('auth_callback_url');
}
