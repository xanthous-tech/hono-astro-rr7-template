import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

import { PricingCard, PricingCardProps } from './PricingCard';

interface PricingProps {
  locale?: string;
  pricing: {
    yearlyPlans: PricingCardProps[];
    monthlyPlans: PricingCardProps[];
  };
}

export function Pricing({ locale = 'en', pricing }: PricingProps) {
  const { yearlyPlans, monthlyPlans } = pricing;

  return (
    <Tabs defaultValue="yearly" className="flex flex-col items-center w-full">
      <TabsList>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>
      <TabsContent value="yearly">
        <div className="flex flex-col gap-6 md:flex-row">
          {yearlyPlans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="monthly">
        <div className="flex flex-col gap-6 md:flex-row">
          {monthlyPlans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
