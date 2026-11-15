import { DeviceType } from "@/lib/enum";

export interface IDeviceInfo {
  deviceId?: string;
  deviceToken?: string;
  deviceType: DeviceType;
}

export interface IOTPInput extends IDeviceInfo {
  otp?: string;
}

export interface ILoginForm extends IOTPInput {
  email: string;
}

export interface ISignupForm extends IOTPInput {
  email: string;
  name: string;
}
