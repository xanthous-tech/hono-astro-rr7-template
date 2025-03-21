export const STRIPE_PRICE_IDS: Record<
  string,
  Record<string, Record<string, string>>
> = {
  development: {
    express: {
      monthly: 'price_',
      yearly: 'price_',
    },
    standard: {
      monthly: 'price_',
      yearly: 'price_',
    },
  },
  production: {
    express: {
      monthly: 'price_',
      yearly: 'price_',
    },
    standard: {
      monthly: 'price_',
      yearly: 'price_',
    },
  },
};

export const STRIPE_PRICE_PLAN_MAPPING: Record<
  string,
  Record<string, string>
> = {
  development: Object.keys(STRIPE_PRICE_IDS.development).reduce(
    (acc, plan) => {
      const prices = Object.values(STRIPE_PRICE_IDS.development[plan]);

      for (const price of prices) {
        acc[price] = plan;
      }

      return acc;
    },
    {} as Record<string, string>,
  ),
  production: Object.keys(STRIPE_PRICE_IDS.production).reduce(
    (acc, plan) => {
      const prices = Object.values(STRIPE_PRICE_IDS.production[plan]);

      for (const price of prices) {
        acc[price] = plan;
      }

      return acc;
    },
    {} as Record<string, string>,
  ),
};
