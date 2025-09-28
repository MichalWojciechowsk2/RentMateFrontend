import api from "./axiosInstance";
import type {
  LoginUser,
  RegisterUser,
  AuthResponse,
  User,
} from "../types/User";
import type { AxiosResponse } from "axios";

export const login = async (
  login: LoginUser
): Promise<AxiosResponse<AuthResponse>> => await api.post("/Auth/login", login);

export const register = async (register: RegisterUser): Promise<void> =>
  await api.post("/Auth/register", register);

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("Auth/me");
  return response.data;
};
