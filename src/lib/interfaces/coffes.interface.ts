import { IPageInfo } from "@/api/axios/base-res.interface";

export interface ICoffessRes {
  data: ICoffee[];
  pageInfo: IPageInfo;
}

export interface ICoffee {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  category: Category;
  variants: ICoffeeVariant[];
}

export interface ICoffeeVariant {
  id: string;
  size: string;
  price: string;
  status: "AVAILABLE" | "UN_AVAILABLE";
}

export interface Category {
  name: string;
}
