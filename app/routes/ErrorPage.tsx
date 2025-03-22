import { Link, useLocation, useRouteError } from 'react-router';

export function ErrorPage() {
  const error = useRouteError();
  const location = useLocation();

  console.log('Error Occurred in', location);
  console.log(error);

  return (
    <div className="container m-8 flex flex-col gap-2">
      <title>Error - The Product</title>
      <h1 className="text-3xl font-bold mb-4">Error Occurred</h1>
      <p>Sorry, we seem to hit a snag. Please refresh.</p>
      <p>
        If issue persists, please contact support by using the live chat bubble
        in the bottom right corner.
      </p>
      <Link to="/dashboard" className="underline">
        Return to Dashboard
      </Link>
    </div>
  );
}
