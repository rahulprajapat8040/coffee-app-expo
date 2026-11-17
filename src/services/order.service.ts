import { request } from "@/api/axios/request";
import { API_ENDPOINT } from "@/lib/constants/routes.constant";
import { IAddToCart } from "@/lib/interfaces/order/order-form.interface";

export const orderApi = {
  async addToCart(data: IAddToCart) {
    return request({ url: `${API_ENDPOINT.CART}`, method: "POST", data });
  },
};
