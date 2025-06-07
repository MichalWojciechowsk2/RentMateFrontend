import api from "./axiosInstance";
import type { Property } from "../types/Property";

export const getAllProperties = async (): Promise<Property[]> => {
  const response = await api.get<Property[]>("/Property");
  return response.data;
};

export const searchProperties = async (filters: any): Promise<Property[]> => {
  const response = await api.get<Property[]>("/Property/search", {
    params: filters,
  });
  return response.data;
};

export const getCities = async (): Promise<{ id: number; name: string }[]> => {
  const response = await api.get<{ id: number; name: string }[]>(
    "/Property/cities"
  );
  return response.data;
};

export const getDistricts = async (
  cityId: string
): Promise<{ id: number; name: string }[]> => {
  const response = await api.get<{ id: number; name: string }[]>(
    `/Property/districts/${cityId}`
  );
  return response.data;
};
