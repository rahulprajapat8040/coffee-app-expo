import { IApiResponse } from "@/api/axios/base-res.interface";
import { request } from "@/api/axios/request";
import { API_ENDPOINT } from "@/lib/constants/routes.constant";
import {
  ILoginForm,
  ISignupForm,
} from "@/lib/interfaces/auth/auth-form.interface";
import {
  IAuthResponse,
  IAuthUser,
} from "@/lib/interfaces/auth/auth-response.interface";

export const authApi = {
  sendOTP(data: { email: string }) {
    return request({
      url: `${API_ENDPOINT.AUTH}/send-otp`,
      method: "POST",
      data,
    });
  },

  login(data: ILoginForm) {
    return request<IApiResponse<IAuthResponse>>({
      url: `${API_ENDPOINT.AUTH}/login`,
      method: "POST",
      data,
    });
  },

  signup(data: ISignupForm) {
    return request<IApiResponse<IAuthResponse>>({
      url: `${API_ENDPOINT.AUTH}/signup`,
      method: "POST",
      data,
    });
  },

  me() {
    return request<IApiResponse<IAuthUser>>({
      url: `${API_ENDPOINT.AUTH}/me`,
      method: "GET",
    });
  },
};
