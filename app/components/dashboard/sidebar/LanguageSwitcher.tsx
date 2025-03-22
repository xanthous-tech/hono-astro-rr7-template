import { ChevronsUpDown, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { locales, localeNames } from '~/locales.config';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const sidebar = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <Languages /> {t('app.dashboard.sidebar.languages')}
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            {locales.map((locale, i) => (
              <DropdownMenuItem
                key={locale}
                onClick={() => {
                  i18n.changeLanguage(locale);

                  if (sidebar.openMobile) {
                    sidebar.setOpenMobile(false);
                  }
                }}
              >
                <span>{localeNames[i]}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
