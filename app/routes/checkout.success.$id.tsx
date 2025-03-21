import { data, useLoaderData, useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

import { Route } from '@react-router-route-types/checkout.success.$id';

import { SUBSCRIBE_SUCCESS } from '@/types/email';
import { stripe } from '@/lib/stripe';
import { email } from '@/queues/email';

import { Button } from '~/components/ui/button';

export async function loader(args: Route.LoaderArgs) {
  const { params } = args;
  const checkoutId = params.id;

  const session = await stripe.checkout.sessions.retrieve(checkoutId);

  if (session.customer_email) {
    // send success email
    await email({
      emailType: SUBSCRIBE_SUCCESS,
      emailTo: session.customer_email,
    });
  }

  return data({
    id: params.id,
  });
}

export default function SubscribeSuccessPage() {
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
            <CheckCircle className="h-8 w-8 mr-2 fill-green-500 stroke-white inline-block" />
            Subscription Successful
          </DialogTitle>
          <DialogDescription>Thank you!</DialogDescription>
        </DialogHeader>
        <div>
          <p>
            Thank you for choosing What-Lang. Your subscription is now active.
          </p>
        </div>
        <DialogFooter>
          <Button asChild>
            <a href="/dashboard">Go to dashboard</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
