import { Loader2 } from 'lucide-react';

export function SmallLoadingState() {
  return (
    <div className="p-2 mx-auto">
      <Loader2 className="h-4 w-4 animate-spin" />
    </div>
  );
}

export function FullPageLoadingState() {
  return (
    <div className="h-dvh w-dvw flex flex-col gap-2 justify-center items-center">
      <Loader2 className="h-12 w-12 animate-spin" />
      Loading...
    </div>
  );
}
