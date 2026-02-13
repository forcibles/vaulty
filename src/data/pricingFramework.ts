export type ToolMonetizationModel = "subscription" | "one-time";

export type ToolPricingBand = "entry" | "core" | "premium" | "hardware";

type PricingBandPolicy = {
  markupRate: number;
  supportReserveRate: number;
  processorFeeRate: number;
  minimumMargin: number;
};

type CategoryPricingOverride = {
  band: ToolPricingBand;
  monetizationModel?: ToolMonetizationModel;
};

export type ToolPricingMeta = {
  supplierStartingPrice: number;
  retailStartingPrice: number;
  pricingBand: ToolPricingBand;
  monetizationModel: ToolMonetizationModel;
  markupRate: number;
  supportReserveRate: number;
  processorFeeRate: number;
  grossMarginAmount: number;
  grossMarginRate: number;
};

export type PricingSeedInput = {
  category: string;
  startingPrice: number;
  pricingBand?: ToolPricingBand;
  monetizationModel?: ToolMonetizationModel;
};

const PRICING_BAND_POLICIES: Record<ToolPricingBand, PricingBandPolicy> = {
  entry: {
    markupRate: 0.24,
    supportReserveRate: 0.07,
    processorFeeRate: 0.05,
    minimumMargin: 2.5,
  },
  core: {
    markupRate: 0.2,
    supportReserveRate: 0.07,
    processorFeeRate: 0.05,
    minimumMargin: 4,
  },
  premium: {
    markupRate: 0.17,
    supportReserveRate: 0.06,
    processorFeeRate: 0.05,
    minimumMargin: 7.5,
  },
  hardware: {
    markupRate: 0.12,
    supportReserveRate: 0.04,
    processorFeeRate: 0.03,
    minimumMargin: 20,
  },
};

const CATEGORY_PRICING_OVERRIDES: Record<string, CategoryPricingOverride> = {
  "DMA Kits": { band: "hardware", monetizationModel: "one-time" },
  "HWID Spoofers": { band: "premium", monetizationModel: "subscription" },
};

const toPsychologicalPrice = (value: number) => {
  const bounded = Math.max(3.99, value);
  return Number((Math.ceil(bounded) - 0.01).toFixed(2));
};

const resolveDefaultBand = (category: string, supplierStartingPrice: number): ToolPricingBand => {
  if (category === "DMA Kits") {
    return "hardware";
  }
  if (supplierStartingPrice < 8) {
    return "entry";
  }
  if (supplierStartingPrice < 25) {
    return "core";
  }
  return "premium";
};

export const buildPricingMeta = ({
  category,
  startingPrice,
  pricingBand,
  monetizationModel,
}: PricingSeedInput): ToolPricingMeta => {
  const supplierStartingPrice = Number(startingPrice.toFixed(2));
  const categoryOverride = CATEGORY_PRICING_OVERRIDES[category];
  const resolvedBand = pricingBand ?? categoryOverride?.band ?? resolveDefaultBand(category, supplierStartingPrice);
  const resolvedMonetization = monetizationModel ?? categoryOverride?.monetizationModel ?? "subscription";
  const policy = PRICING_BAND_POLICIES[resolvedBand];

  const markupBase = supplierStartingPrice * (1 + policy.markupRate + policy.supportReserveRate + policy.processorFeeRate);
  const retailBeforeRounding = Math.max(markupBase, supplierStartingPrice + policy.minimumMargin);
  const retailStartingPrice = toPsychologicalPrice(retailBeforeRounding);
  const grossMarginAmount = Number((retailStartingPrice - supplierStartingPrice).toFixed(2));
  const grossMarginRate = retailStartingPrice > 0 ? Number((grossMarginAmount / retailStartingPrice).toFixed(4)) : 0;

  return {
    supplierStartingPrice,
    retailStartingPrice,
    pricingBand: resolvedBand,
    monetizationModel: resolvedMonetization,
    markupRate: policy.markupRate,
    supportReserveRate: policy.supportReserveRate,
    processorFeeRate: policy.processorFeeRate,
    grossMarginAmount,
    grossMarginRate,
  };
};
