import { IPageInfo } from "@/api/axios/base-res.interface";

export interface IAddressRes {
  data: IAddress[];
  pageInfo: IPageInfo;
}

export interface IAddress {
  id: string;
  nickName: any;
  address: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt: string;
}
