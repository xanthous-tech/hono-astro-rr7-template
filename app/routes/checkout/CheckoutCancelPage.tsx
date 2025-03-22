import { data, useNavigate, useParams } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { XCircle } from 'lucide-react';

import { useCheckoutSession } from '~/hooks/api';
import { Button } from '~/components/ui/button';

export function CheckoutCancelPage() {
  const { checkoutId } = useParams();
  const { data: checkoutSession } = useCheckoutSession(checkoutId);
  const navigate = useNavigate();

  // TODO: translate this page

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        navigate('/dashboard/pricing');
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="align-baseline">
            <XCircle className="h-8 w-8 mr-2 fill-red-500 stroke-white inline-block" />
            Subscription Canceled
          </DialogTitle>
        </DialogHeader>
        <div>
          <p>
            You will not be charged at this time. If you have any questions
            before making a decision, please contact us at{' '}
            <a href="mailto:support@example.com" className="underline">
              support@example.com
            </a>
            , and we'll be more than happy to help.
          </p>
        </div>
        <DialogFooter>
          <Button asChild disabled={!checkoutSession?.url}>
            <a href={checkoutSession?.url ?? '#'}>Try again</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
