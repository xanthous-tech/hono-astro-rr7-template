import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ChevronsUpDown, LogOut } from 'lucide-react';

import { useSignOut, useUserInfo } from '~/hooks/api';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar';

export function NavUser() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const queryClient = useQueryClient();
  const { data: user } = useUserInfo();
  const signOut = useSignOut();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={
                    user?.image ??
                    `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${user?.id}`
                  }
                  alt={user?.name ?? 'user avatar'}
                />
                <AvatarFallback className="rounded-lg uppercase">
                  {user?.name && user.name.length > 0 ? user.name[0] : ''}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.name ?? user?.email ?? 'User'}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      user?.image ??
                      `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${user?.id}`
                    }
                    alt={user?.name ?? 'user avatar'}
                  />
                  <AvatarFallback className="rounded-lg uppercase">
                    {user?.name && user.name.length > 0 ? user.name[0] : ''}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name ?? user?.email ?? 'User'}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await signOut.mutateAsync();
                await queryClient.invalidateQueries({
                  queryKey: ['user'],
                });
                navigate('/signin');
              }}
            >
              <LogOut />
              {t('app.dashboard.sidebar.sign_out')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
