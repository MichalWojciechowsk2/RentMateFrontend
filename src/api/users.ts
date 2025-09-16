import api from "./axiosInstance";
import type { User } from "../types/User";

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`User/getUserById?id=${id}`);
  return response.data;
};

export const uploadUserPhoto = async (photo: File): Promise<any> => {
  const formData = new FormData();
  formData.append("photo", photo);
  const response = await api.post("User/uploadUserPhoto", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getUserPhoto = async (): Promise<string> => {
  const response = await api.get<string>("User/userPhoto");
  console.log(`mam zdjęcie: ${response.data} `);
  return response.data;
};
