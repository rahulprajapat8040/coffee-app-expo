import { API_BASE_URL } from "@/lib/constants/routes.constant";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
