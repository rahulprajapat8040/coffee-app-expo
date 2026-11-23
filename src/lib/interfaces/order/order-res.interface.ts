export interface IOrderItem {
  coffeeId: string;
  variantId: string;
  name: string;
  size: string;
  image: string | null;
  price: string;
  originalPrice?: string;
  discountAmount?: string;
  offerTitle?: string | null;
  quantity: number;
}

export interface IOrderStatusHistory {
  id: string;
  status: "PREPARING" | "ON_THE_WAY" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface IOrderRes {
  id: string;
  deliveryAddress: string;
  deliveryAddressLabel?: string | null;
  deliveryLatitude?: number | null;
  deliveryLongitude?: number | null;
  note: string | null;
  items: IOrderItem[];
  subtotal: string;
  discountTotal?: string;
  deliveryFee: string;
  serviceFee: string;
  total: string;
  paymentMethod: "CASH_ON_DELIVERY";
  status: "PREPARING" | "ON_THE_WAY" | "COMPLETED" | "CANCELLED";
  statusHistory?: IOrderStatusHistory[];
  createdAt: string;
}
