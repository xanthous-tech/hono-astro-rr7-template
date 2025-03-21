import { redirect } from 'react-router';

import { Route } from '@react-router-root-types/root';

import { invalidateSession, readSessionCookie } from '@/lib/auth';
import { Session, User } from '@/db/schema';

// throws if there is no session
export async function validateSession({
  request,
  context,
}: Route.LoaderArgs): Promise<{
  user: User;
  session: Session;
}> {
  const { pathname } = new URL(request.url);

  if (!context.session || !context.user) {
    throw redirect(`/signin?callbackUrl=${pathname}`);
  }

  return {
    user: context.user,
    session: context.session,
  };
}

export async function signout({ request }: Route.LoaderArgs): Promise<void> {
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionId = readSessionCookie(cookieHeader);

  if (sessionId) {
    await invalidateSession(sessionId);
  }
}
