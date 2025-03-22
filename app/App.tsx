import { useState } from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';

import './lib/i18next';
import { Toaster } from './components/ui/sonner';

import { IndexPage } from './routes/IndexPage';
import { DashboardLayout } from './routes/dashboard/DashboardLayout';
import { DashboardIndexPage } from './routes/dashboard/DashboardIndexPage';
import { DashboardPricingPage } from './routes/dashboard/DashboardPricingPage';
import { CheckoutSuccessPage } from './routes/checkout/CheckoutSuccessPage';
import { CheckoutCancelPage } from './routes/checkout/CheckoutCancelPage';
import { CheckoutPage } from './routes/checkout/CheckoutPage';
import { SignInPage } from './routes/SignInPage';
import { ErrorPage } from './routes/ErrorPage';
import { NotFoundPage } from './routes/NotFoundPage';

export function App() {
  const [queryClient] = useState(() => new QueryClient());

  const routes = createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route index element={<IndexPage />} />
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardIndexPage />} />
        <Route path="pricing" element={<DashboardPricingPage />} />
      </Route>
      <Route
        path="checkout/canceled/:checkoutId"
        element={<CheckoutCancelPage />}
      />
      <Route path="checkout/success" element={<CheckoutSuccessPage />} />
      <Route path="checkout/*" element={<CheckoutPage />} />
      <Route path="signin" element={<SignInPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  );

  const router = createBrowserRouter(routes, {
    basename: '/app',
  });

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" duration={10000} />
      </QueryClientProvider>
    </JotaiProvider>
  );
}
