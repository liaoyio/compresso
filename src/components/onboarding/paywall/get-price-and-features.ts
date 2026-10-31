
type PriceAndFeatures = {
  tiers: {
    pro: {
      features: string[];
      price: string;
    };
    free: {
      features: string[];
      price: string;
    };
  };
};
export const getPriceAndFeatures = async (): Promise<PriceAndFeatures> => {
  const res = await fetch(
    `${import.meta.env.VITE_SITE_ROOT}/compress/desktop/api/pricing`
  );
  return (await res.json()) as PriceAndFeatures;
};
