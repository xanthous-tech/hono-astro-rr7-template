import { Link, useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

import { Button } from '~/components/ui/button';

export function CheckoutSuccessPage() {
  const navigate = useNavigate();

  // TODO: translate this page

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
            Thank you for choosing Captioner. Your subscription is now active.
          </p>
        </div>
        <DialogFooter>
          <Button asChild>
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
