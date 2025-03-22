import { useEffect } from 'react';
import { Languages } from 'lucide-react';
import Cookies from 'js-cookie';

import {
  defaultLocale,
  localeNames,
  locales,
  localeRegex,
  localeCookieName,
} from '~/locales.config';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

function getLocaleFromCookie() {
  const locale = Cookies.get(localeCookieName);
  return locale ?? defaultLocale;
}

function getLocaleFromPathname(pathname: string) {
  return pathname.match(localeRegex)?.[1];
}

function setLocaleCookie(locale: string) {
  Cookies.set(localeCookieName, locale, {
    sameSite: 'lax',
    path: '/',
  });
}

function isPathnameContainsLocale(pathname: string, locale: string) {
  return pathname.startsWith(`/${locale}`);
}

export function LanguageSwitcher() {
  useEffect(() => {
    const locale = getLocaleFromCookie();
    const localeFromPathname = getLocaleFromPathname(window.location.pathname);
    if (localeFromPathname) {
      setLocaleCookie(localeFromPathname);
    } else {
      if (locale !== defaultLocale && locales.includes(locale)) {
        window.location.href = `/${locale}${window.location.pathname.replace(localeRegex, '')}`;
      }
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-9 px-0">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale, index) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => {
              setLocaleCookie(locale);
              if (isPathnameContainsLocale(window.location.pathname, locale)) {
                window.location.reload();
              } else {
                window.location.href = `/${locale}${window.location.pathname.replace(localeRegex, '')}`;
              }
            }}
          >
            {localeNames[index]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
