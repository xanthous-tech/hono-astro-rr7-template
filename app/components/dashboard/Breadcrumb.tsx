import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

export function DashboardBreadcrumb() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [pathnameParts, setPathnameParts] = useState<string[]>(
    pathname.split('/').slice(1),
  );

  useEffect(() => {
    setPathnameParts(pathname.split('/').slice(1));
  }, [pathname]);

  const breadcrumbItems: {
    [key: string]: {
      title: string;
      url: string;
    };
  } = {
    dashboard: {
      title: t('app.dashboard.title'),
      url: '/dashboard',
    },
    new: {
      title: t('app.dashboard.sidebar.create_project'),
      url: '/dashboard/new',
    },
    pricing: {
      title: t('app.dashboard.sidebar.pricing'),
      url: '/dashboard/pricing',
    },
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathnameParts.map((part, index) =>
          index < pathnameParts.length - 1 ? (
            <>
              <BreadcrumbItem key={part} className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to={breadcrumbItems[part].url}>
                    {breadcrumbItems[part].title}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator
                key={`separator-${part}`}
                className="hidden md:block"
              />
            </>
          ) : (
            <BreadcrumbItem key={part}>
              <BreadcrumbPage>{breadcrumbItems[part].title}</BreadcrumbPage>
            </BreadcrumbItem>
          ),
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
