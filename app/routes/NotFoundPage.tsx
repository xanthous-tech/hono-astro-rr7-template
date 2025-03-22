import { Link, useLocation } from 'react-router';

export function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="container m-8 flex flex-col gap-2">
      <title>Not Found - The Product</title>
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p>Seems like we hit a dead end.</p>
      <Link to="/dashboard" className="underline">
        Return to Dashboard
      </Link>
    </div>
  );
}
