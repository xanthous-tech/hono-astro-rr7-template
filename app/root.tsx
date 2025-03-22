import { lazy, Suspense } from 'react';

// Dynamically import the App component using React.lazy
const App = lazy(() =>
  import('./App').then((module) => ({ default: module.App })),
);

export function Root() {
  return (
    <Suspense
      fallback={
        <div className="container m-8 flex flex-col gap-2">
          <p>Loading...</p>
        </div>
      }
    >
      <App />
    </Suspense>
  );
}
