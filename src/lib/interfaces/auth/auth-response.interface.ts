export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  phoneNo: string;
  profilePic: string;
  role: string;
}
