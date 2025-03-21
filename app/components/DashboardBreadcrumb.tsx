import { useLocation } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

const breadcrumbItems: {
  [key: string]: {
    title: string;
    url: string;
  };
} = {
  dashboard: {
    title: 'Dashboard',
    url: '/dashboard',
  },
  pricing: {
    title: 'Pricing',
    url: '/dashboard/pricing',
  },
  usage: {
    title: 'Usage',
    url: '/dashboard/usage',
  },
};

export function DashboardBreadcrumb() {
  const { pathname } = useLocation();

  const pathnameParts = pathname.split('/').slice(1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathnameParts.map((part, index) =>
          index < pathnameParts.length - 1 ? (
            <>
              <BreadcrumbItem key={part} className="hidden md:block">
                <BreadcrumbLink href={breadcrumbItems[part].url}>
                  {breadcrumbItems[part].title}
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
