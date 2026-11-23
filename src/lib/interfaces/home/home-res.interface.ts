import type { ICategory } from "./categories.interface";

export interface IHomeRes {
  categories: ICategory[];
  offers: IOffer[];
}

export interface IOffer {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  targetType: "ALL_PRODUCTS" | "SELECTED_COFFEES" | "SELECTED_CATEGORIES";
  coffeeIds: string[];
  categoryIds: string[];
  discountPercentage: string;
  startDate: string;
  endDate: string | null;
}
