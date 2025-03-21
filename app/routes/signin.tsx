import { useEffect } from 'react';
import {
  data,
  useRouteError,
  isRouteErrorResponse,
  Link,
  redirect,
  useLoaderData,
} from 'react-router';
import { toast } from 'sonner';
import { Trans, useTranslation } from 'react-i18next';

import { Route } from '@react-router-route-types/signin';

import { MAGIC_LINK } from '@/types/email';
import { APP_URL } from '@/config/server';
import { createMagicToken } from '@/utils/magic-link';
import { createCallbackUrlCookie } from '@/lib/auth';
import { email } from '@/queues/email';
import i18n from '~/lib/i18next.server';

import { UserAuthForm } from '~/components/UserAuthForm';

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    { title: data.title },
    { name: 'description', content: data.description },
  ];
};

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  if (context.session) {
    throw redirect('/dashboard');
  }

  const locale = await i18n.getLocale(request);
  const t = await i18n.getFixedT(request);
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const cookie = createCallbackUrlCookie(callbackUrl);

  return data(
    {
      callbackUrl,
      locale,
      title: `${t('signin')} - ${t('title')}`,
      description: t('description'),
    },
    {
      headers: {
        'Set-Cookie': cookie.serialize(),
      },
    },
  );
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const emailTo = formData.get('email') as string | null;

  if (!emailTo) {
    return data({ error: 'email is required' }, { status: 400 });
  }

  try {
    const token = await createMagicToken(emailTo);
    await email({
      emailType: MAGIC_LINK,
      emailTo,
      emailArgs: {
        link: `${APP_URL}/api/auth/magic-link/${token}`,
      },
    });

    return { emailTo };
  } catch (err: any) {
    throw data(err.message, { status: 500 });
  }
};

export function SignInPageContent() {
  const { locale, callbackUrl } = useLoaderData<typeof loader>();
  const { t } = useTranslation('translation', { lng: locale });

  return (
    <div className="min-h-screen">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('greeting')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('signin_prompt')}
            </p>
          </div>
          <UserAuthForm locale={locale} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Trans
              t={t}
              i18nKey="signin_agreement"
              components={{
                terms: (
                  <Link
                    reloadDocument
                    to="/terms"
                    className="hover:text-brand underline underline-offset-4"
                  >
                    {t('terms')}
                  </Link>
                ),
                privacy: (
                  <Link
                    reloadDocument
                    to="/privacy"
                    className="hover:text-brand underline underline-offset-4"
                  >
                    {t('privacy')}
                  </Link>
                ),
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const { locale } = useLoaderData<typeof loader>();
  const { t } = useTranslation('translation', { lng: locale });
  const error = useRouteError();

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      toast(error.data);
    }

    if (error instanceof Error) {
      toast(t('error_occurred'));
    }
  }, [error]);

  return <SignInPageContent />;
}

export default function SignInPage() {
  return <SignInPageContent />;
}
