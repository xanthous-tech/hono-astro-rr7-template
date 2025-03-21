import { data, useLoaderData, useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { XCircle } from 'lucide-react';

import { Route } from '@react-router-route-types/checkout.canceled.$id';

import { stripe } from '@/lib/stripe';
import { email } from '@/queues/email';
import { Button } from '~/components/ui/button';

export async function loader({ params }: Route.LoaderArgs) {
  const checkoutId = params.id;

  // biome-ignore lint/style/noNonNullAssertion: legacy code
  const session = await stripe.checkout.sessions.retrieve(checkoutId!);

  return data({
    id: params.id,
    url: session.url,
  });
}

export default function SubscribeCancelPage() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        navigate('/dashboard');
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="align-baseline">
            <XCircle className="h-8 w-8 mr-2 fill-red-500 stroke-white inline-block" />
            Subscription Cancelled
          </DialogTitle>
        </DialogHeader>
        <div>
          <p>
            You will not be charged at this time. If you have any questions
            before making a decision, please contact us at{' '}
            <a href="mailto:support@what-lang.com" className="underline">
              support@what-lang.com
            </a>
            , and we'll be more than happy to help.
          </p>
        </div>
        <DialogFooter>
          <Button asChild>
            <a href={data.url ?? '#'}>Try again</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
