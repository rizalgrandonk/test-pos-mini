export const DiscountTypeEnum = {
  Percentage: 'PERCENTAGE',
  Amount: 'AMOUNT',
} as const;

export type DiscountType = (typeof DiscountTypeEnum)[keyof typeof DiscountTypeEnum];