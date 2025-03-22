import { useLayoutEffect } from 'react';
import { Outlet } from 'react-router';

import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { Separator } from '~/components/ui/separator';
import { AppSidebar } from '~/components/dashboard/sidebar/AppSidebar';
import { DashboardBreadcrumb } from '~/components/dashboard/Breadcrumb';

export function DashboardLayout() {
  // this is needed because I forced a no-scroll in body on EditorPage
  useLayoutEffect(() => {
    document.body.style = '';
  });

  return (
    <>
      <title>Dashboard - The Product</title>
      <meta name="description" content="The Product Dashboard" />
      <link rel="canonical" href={document.location.href} />
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DashboardBreadcrumb />
            </div>
          </header>
          <Outlet />
          <footer className="h-[100px]" />
        </main>
      </SidebarProvider>
    </>
  );
}
