import type { IOffer } from "@/lib/interfaces/home/home-res.interface";

export const getBestOfferForProduct = (
  coffeeId: string,
  categoryId: string,
  offers: IOffer[],
) =>
  offers.reduce<IOffer | null>((best, offer) => {
    const applies =
      offer.targetType === "ALL_PRODUCTS" ||
      (offer.targetType === "SELECTED_COFFEES" &&
        offer.coffeeIds.includes(coffeeId)) ||
      (offer.targetType === "SELECTED_CATEGORIES" &&
        offer.categoryIds.includes(categoryId));
    if (
      !applies ||
      (best &&
        Number(best.discountPercentage) >= Number(offer.discountPercentage))
    ) {
      return best;
    }
    return offer;
  }, null);

export const getOfferDiscountCents = (
  priceCents: number,
  discountPercentage?: number | string,
) => {
  if (discountPercentage === undefined) return 0;
  const percentage = Math.min(100, Math.max(0, Number(discountPercentage)));
  return Math.min(priceCents, Math.round((priceCents * percentage) / 100));
};
