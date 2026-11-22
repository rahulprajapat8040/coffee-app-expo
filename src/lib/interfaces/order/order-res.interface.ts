export interface IOrderItem {
  coffeeId: string;
  variantId: string;
  name: string;
  size: string;
  image: string | null;
  price: string;
  quantity: number;
}

export interface IOrderRes {
  id: string;
  deliveryAddress: string;
  note: string | null;
  items: IOrderItem[];
  subtotal: string;
  deliveryFee: string;
  serviceFee: string;
  total: string;
  paymentMethod: "CASH_ON_DELIVERY";
  status: "PREPARING" | "ON_THE_WAY" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}
