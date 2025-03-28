import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';

import { UserAuthForm } from '~/components/UserAuthForm';
import { useSession } from '~/hooks/session';
import {
  createCallbackUrlCookie,
  getCallbackUrlFromCookie,
} from '~/lib/cookies';

export function SignInPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, loggedIn } = useSession();

  useEffect(() => {
    if (searchParams.has('callbackUrl')) {
      createCallbackUrlCookie(searchParams.get('callbackUrl') as string);
    }
    if (!loading && loggedIn) {
      navigate(getCallbackUrlFromCookie() ?? '/dashboard');
    }
  }, [loading, loggedIn, searchParams]);

  return (
    <div className="min-h-screen">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('app.signin.greeting')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('app.signin.signin_prompt')}
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Trans
              t={t}
              i18nKey="app.signin.signin_agreement"
              components={{
                terms: (
                  <a
                    href={`/${i18n.language}/terms`}
                    className="hover:text-brand underline underline-offset-4"
                  >
                    {t('terms')}
                  </a>
                ),
                privacy: (
                  <a
                    href={`/${i18n.language}/privacy`}
                    className="hover:text-brand underline underline-offset-4"
                  >
                    {t('privacy')}
                  </a>
                ),
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}
