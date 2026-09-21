/** Replace each placeholder with the LemonSqueezy checkout variant ID before launch. */
export const lemonSqueezyProducts = {
  etsyOps: "XXXX_ETSYOPS",
  shopSync: "XXXX_SHOPSYNC",
  listRank: "XXXX_LISTRANK",
  reviewBoost: "XXXX_REVIEWBOOST",
  starterCare: "XXXX_STARTER_CARE",
  growthRevamp: "XXXX_GROWTH_REVAMP",
  customSaas: "XXXX_CUSTOM_SAAS",
};

export const lemonSqueezyCheckoutUrl = (productId) =>
  `https://logicgridlab.lemonsqueezy.com/checkout/buy/${productId}?checkout[redirect_url]=https://logicgridlab.com/thank-you`;
