import { Check } from 'lucide-react';

import { cn } from '~/lib/utils';
import { buttonVariants } from '~/components/ui/button';

export interface PricingCardProps {
  name: string;
  originalPerMonth?: string;
  perMonth: string;
  perMonthLabel?: string;
  billed?: string;
  saved?: string;
  cta: string;
  ctaVariant?: string;
  url: string;
  features: string[];
}

export function PricingCard({
  name,
  originalPerMonth,
  perMonth,
  perMonthLabel,
  billed,
  saved,
  cta,
  ctaVariant = 'outline',
  url,
  features,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        {
          'order-first md:order-none': ctaVariant === 'default',
        },
        {
          'order-last md:order-none': name === 'Free',
        },
        'flex flex-col items-center gap-4 rounded-3xl border p-8 bg-background',
      )}
    >
      <h3 className="text-lg">{name}</h3>
      <div className="flex flex-col items-center gap-2">
        <p className="flex gap-2 items-baseline">
          {originalPerMonth && (
            <span className="text-md line-through text-muted-foreground">
              {originalPerMonth}
            </span>
          )}
          <span className="text-3xl md:text-5xl font-bold">{perMonth}</span>
          {perMonthLabel && (
            <span className="text-sm font-normal">{perMonthLabel}</span>
          )}
        </p>
        {billed && (
          <p className="text-sm font-medium text-muted-foreground">{billed}</p>
        )}
        {saved && (
          <p className="text-md font-semibold text-background bg-primary rounded-full px-2">
            {saved}
          </p>
        )}
      </div>
      <a
        href={url ?? '#'}
        className={cn(
          buttonVariants({ size: 'lg', variant: ctaVariant as any }),
        )}
      >
        <span className="text-md md:text-lg">{cta}</span>
      </a>
      <ul className="flex flex-col gap-2 items-start w-full">
        {features.map((feature, index) => (
          <li key={`${name}-${index}`} className="flex gap-2 items-baseline">
            <Check className="inline-block w-4 h-4" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
