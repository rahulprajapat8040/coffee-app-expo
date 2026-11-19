import { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";
import { API_ENDPOINT } from "@/lib/constants/routes.constant";
import { ICartRes } from "@/lib/interfaces/cart/cart-res.interface";
import { IAddToCart } from "@/lib/interfaces/order/order-form.interface";

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
    productId: string;
    quantity: number;
    type: "increase" | "decrease";
  }) {
    const { productId, quantity } = data;
    return request({
      url: `/cart/items/${productId}`,
      data: { quantity },
      method: "PATCH",
    });
  },

  removeFromCart(productId: string) {
    return request({ url: `/cart/items/${productId}`, method: "DELETE" });
  },

  clearCart() {
    return request({ url: "/cart", method: "DELETE" });
  },
};
