import { useLoaderData } from 'react-router';

import { Route } from '@react-router-route-types/dashboard';

export default function DashboardIndex() {
  return (
    <div className="m-4">
      <h2 className="text-xl font-bold my-2">Remix Express Template</h2>
      <p>You are logged in</p>
      <p>
        <a href="/signout" className="underline">
          Sign out here
        </a>
      </p>
    </div>
  );
}
