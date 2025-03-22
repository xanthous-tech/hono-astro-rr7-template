import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';
import {
  BadgeDollarSign,
  Book,
  CreditCard,
  Gauge,
  Home,
  Plus,
} from 'lucide-react';

import { useQuota, useSubscription } from '~/hooks/api';
import { apiUrl } from '~/lib/api';
import { localeAtom } from '~/lib/i18next';
import { cn } from '~/lib/utils';

import { Progress } from '~/components/ui/progress';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '~/components/ui/sidebar';

import { NavUser } from './NavUser';
import { LanguageSwitcher } from './LanguageSwitcher';

export function QuotaSection() {
  const { t } = useTranslation();
  const { data: quota } = useQuota();
  const sidebar = useSidebar();

  const used = quota?.used ?? 0;
  const limit = quota?.limit ?? 5;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('app.dashboard.sidebar.usage')}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              onClick={() => {
                if (sidebar.openMobile) {
                  sidebar.setOpenMobile(false);
                }
              }}
            >
              <Link to="/dashboard/pricing">
                <Gauge />
                <Progress
                  className="w-[120px]"
                  value={((limit - used) / limit) * 100}
                />
                <span
                  className={cn('text-xs', {
                    'text-destructive': limit - used <= 0,
                  })}
                >
                  {t('app.dashboard.sidebar.usage_text', {
                    remaining: limit - used,
                    limit,
                  })}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { t, i18n } = useTranslation();
  const locale = useAtomValue(localeAtom);
  const sidebar = useSidebar();

  const { data: subscription } = useSubscription();

  // Menu items.
  const mainItems = [
    {
      title: t('app.dashboard.sidebar.home'),
      url: '/dashboard',
      icon: Home,
    },
    subscription
      ? {
          title: t('app.dashboard.sidebar.billing'),
          url: `${apiUrl}/api/payment/billing`,
          icon: CreditCard,
        }
      : {
          title: t('app.dashboard.sidebar.pricing'),
          url: '/dashboard/pricing',
          icon: BadgeDollarSign,
        },
  ];

  const resourceItems = [
    {
      title: t('app.dashboard.sidebar.documentation'),
      url: `/${locale}/docs`,
      icon: Book,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <NavUser />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>{t('app.dashboard.title')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    variant="default"
                    // variant={
                    //   (item.variant as 'default' | 'outline' | undefined) ??
                    //   'default'
                    // }
                    // isActive={item.isActive}
                    onClick={() => {
                      if (sidebar.openMobile && item.url.startsWith('/')) {
                        sidebar.setOpenMobile(false);
                      }
                    }}
                    asChild
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {!subscription && <QuotaSection />}
        <SidebarGroup>
          <SidebarGroupLabel>
            {t('app.dashboard.sidebar.resources')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LanguageSwitcher />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
