import api from "./axiosInstance";
import type { User } from "../types/User";

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`User/getUserById?id=${id}`);
  return response.data;
};
