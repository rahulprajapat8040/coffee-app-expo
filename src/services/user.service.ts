import { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";
import { API_ENDPOINT } from "@/lib/constants/routes.constant";
import { IAuthUser } from "@/lib/interfaces/auth/auth-response.interface";

export type IProfileUpdate = Pick<
  IAuthUser,
  "name" | "countryCode" | "phoneNo"
>;

export const userApi = {
  getMyProfile() {
    return request<IApiResponse<IAuthUser>>({
      url: `${API_ENDPOINT.USER}/me`,
      method: "GET",
    });
  },

  updateMyProfile(data: Partial<IProfileUpdate>) {
    return request<IApiResponse<IAuthUser>>({
      url: `${API_ENDPOINT.USER}/me`,
      method: "PATCH",
      data,
    });
  },
};
