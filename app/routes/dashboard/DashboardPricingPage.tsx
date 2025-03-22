import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import { localeAtom } from '~/lib/i18next';

import { Pricing } from '~/components/dashboard/Pricing';

import pricingJson from '@site/config/pricing.json';
import { useEffect, useState } from 'react';

export function DashboardPricingPage() {
  const { t, i18n } = useTranslation();
  const [pricing, setPricing] = useState<any>(
    pricingJson.filter((price) => price.id === i18n.language)[0],
  );
  const locale = useAtomValue(localeAtom);

  useEffect(() => {
    setPricing(pricingJson.filter((price) => price.id === locale)[0]);
  }, [locale]);

  return (
    <div className="m-4 flex flex-col space-y-2">
      <section className="container flex flex-col gap-6 py-8 md:max-w-[64rem]">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4">
          <h2
            className="font-heading text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-center"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: t('landing.pricing.tagline') }}
          />
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 text-center">
            {t('landing.pricing.subtitle')}
          </p>
          <Pricing
            pricing={{
              yearlyPlans: (pricing as any).yearlyPlans.filter(
                (plan: any) => plan.name !== 'Free',
              ),
              monthlyPlans: (pricing as any).monthlyPlans.filter(
                (plan: any) => plan.name !== 'Free',
              ),
            }}
          />
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p
            className="leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html: t('app.dashboard.pricing.subtitle'),
            }}
          />
        </div>
      </section>
    </div>
  );
}
