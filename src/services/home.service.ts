import { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";
import { API_ENDPOINT } from "@/lib/constants/routes.constant";
import { GetFilterUrl } from "@/lib/helper/function.helper";
import { IAddressForm } from "@/lib/interfaces/address/address-form.interface";
import { IAddressRes } from "@/lib/interfaces/address/address-res.interface";
import { ICoffessRes } from "@/lib/interfaces/coffes.interface";
import { ICategoryRes } from "@/lib/interfaces/home/categories.interface";

export const homeApi = {
  getCategories() {
    return request<IApiResponse<ICategoryRes>>({
      url: `${API_ENDPOINT.PRODUCT}/category?limit=100`,
      method: "GET",
    });
  },

  getCoffees(qeuryData: { categoryId: string | null; page: number }) {
    const query = GetFilterUrl(qeuryData);
    return request<IApiResponse<ICoffessRes>>({
      url: `${API_ENDPOINT.PRODUCT}/coffee?${query ? query : ""}`,
      method: "GET",
    });
  },

  getAddress(qeuryData: { page: number }) {
    const query = GetFilterUrl(qeuryData);
    return request<IApiResponse<IAddressRes>>({
      url: `${API_ENDPOINT.USER}/address?${query ? query : ""}`,
      method: "GET",
    });
  },

  addAddress(data: IAddressForm) {
    return request({
      url: `${API_ENDPOINT.USER}/address`,
      method: "POST",
      data,
    });
  },

  updateAddress(payload: IAddressForm & { id: string }) {
    const { id, ...data } = payload;
    return request({
      url: `${API_ENDPOINT.USER}/address/${id}`,
      method: "PUT",
      data,
    });
  },

  setAddressDefault(id: string) {
    return request({
      url: `${API_ENDPOINT.USER}/address/${id}`,
      method: "PATCH",
    });
  },
};
