import api from "./axiosInstance";
import type { LoginUser, RegisterUser, AuthResponse } from "../types/User";
import type { AxiosResponse } from "axios";

export const login = async (
  login: LoginUser
): Promise<AxiosResponse<AuthResponse>> => await api.post("/Auth/login", login);
// it should return barer

export const register = async (register: RegisterUser): Promise<void> =>
  await api.post("/Auth/register", register);
