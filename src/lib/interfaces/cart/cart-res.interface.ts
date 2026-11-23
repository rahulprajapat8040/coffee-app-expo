export interface ICartRes {
  id: string;
  quantity: number;
  coffeeId: string;
  variantId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  coffee: {
    id: string;
    categoryId: string;
    name: string;
    image: string | null;
    isActive: boolean;
  };
  variant: {
    id: string;
    size: string;
    price: string;
    status: "AVAILABLE" | "UN_AVAILABLE";
    coffeeId: string;
  };
}
