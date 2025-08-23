import { lazy, Suspense } from 'react';

import { FullPageLoadingState } from './components/LoadingStates';

// Dynamically import the App component using React.lazy
const App = lazy(() =>
  import('./App').then((module) => ({ default: module.App })),
);

export function Root() {
  return (
    <Suspense fallback={<FullPageLoadingState />}>
      <App />
    </Suspense>
  );
}
