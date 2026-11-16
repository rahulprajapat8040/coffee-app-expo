import { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";
import { API_ENDPOINT } from "@/lib/constants/routes.constant";
import { GetFilterUrl } from "@/lib/helper/function.helper";
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
};
