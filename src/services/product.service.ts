import { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";
import { API_ENDPOINT } from "@/lib/constants/routes.constant";
import { ICoffeeData } from "@/lib/interfaces/product/coffee-detail.interface";

export const productApi = {
  getCoffeeDetail(id: string) {
    return request<IApiResponse<ICoffeeData>>({
      url: `${API_ENDPOINT.PRODUCT}/coffee/info/${id}`,
      method: "GET",
    });
  },
};
