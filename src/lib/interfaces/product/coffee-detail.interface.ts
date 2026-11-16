import { VariantStatus } from "@/lib/enum";

export interface ICoffeeData {
  id: string;
  image: string;
  name: string;
  description: string;
  variants: Variant[];
}

export interface Variant {
  id: string;
  size: string;
  price: string;
  status: VariantStatus;
}
