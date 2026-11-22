import { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";
import { API_ENDPOINT } from "@/lib/constants/routes.constant";
import { ICartRes } from "@/lib/interfaces/cart/cart-res.interface";
import { IAddToCart } from "@/lib/interfaces/order/order-form.interface";
import { IOrderRes } from "@/lib/interfaces/order/order-res.interface";

export const orderApi = {
  async addToCart(data: IAddToCart) {
    return request({ url: `${API_ENDPOINT.CART}`, method: "POST", data });
  },

  async getMyCart() {
    return request<IApiResponse<ICartRes[]>>({
      url: `${API_ENDPOINT.CART}/my`,
      method: "GET",
    });
  },

  updateQuantity(data: {
    cartItemId: string;
    quantity: number;
    type: "asc" | "desc";
  }) {
    const { cartItemId, quantity, type } = data;
    return request({
      url: `${API_ENDPOINT.CART}/${cartItemId}/quantity`,
      data: { quantity, type },
      method: "PATCH",
    });
  },

  removeFromCart(cartItemId: string) {
    return request({
      url: `${API_ENDPOINT.CART}/${cartItemId}`,
      method: "DELETE",
    });
  },

  createOrder(data: { addressId: string; note?: string }) {
    return request<IApiResponse<IOrderRes>>({
      url: API_ENDPOINT.ORDERS,
      method: "POST",
      data,
    });
  },

  getMyOrders() {
    return request<IApiResponse<IOrderRes[]>>({
      url: `${API_ENDPOINT.ORDERS}/my`,
      method: "GET",
    });
  },

  getWishlist() {
    return request<IApiResponse<IWishlistItem[]>>({
      url: API_ENDPOINT.WISHLIST,
      method: "GET",
    });
  },

  addToWishlist(coffeeId: string) {
    return request<IApiResponse<{ id: string; coffeeId: string }>>({
      url: `${API_ENDPOINT.WISHLIST}/${coffeeId}`,
      method: "POST",
    });
  },

  removeFromWishlist(coffeeId: string) {
    return request({
      url: `${API_ENDPOINT.WISHLIST}/${coffeeId}`,
      method: "DELETE",
    });
  },
};

export interface IWishlistItem {
  id: string;
  coffeeId: string;
  coffee: {
    id: string;
    name: string;
    description: string;
    image: string | null;
    isActive: boolean;
    variants: {
      id: string;
      size: string;
      price: string;
      status: "AVAILABLE" | "UN_AVAILABLE";
    }[];
  };
}
