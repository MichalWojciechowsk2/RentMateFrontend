import api from "./axiosInstance";
import type { Property, CreateProperty } from "../types/Property";

export const getAllProperties = async (): Promise<Property[]> => {
  const response = await api.get<Property[]>("/Property");
  return response.data;
};
export const GetPropertyById = async (id: number): Promise<Property> => {
  const response = await api.get<Property>(`Property/getPropertyById?id=${id}`);
  return response.data;
};

export const GetPropertiesByOwnerId = async (
  ownerId: number
): Promise<Property[]> => {
  const response = await api.get<Property[]>(
    `Property/getPropertiesByOwnerId?ownerId=${ownerId}`
  );
  return response.data;
};

export const createProperty = async (
  property: CreateProperty
): Promise<void> => {
  const token = localStorage.getItem("token");
  console.log(`Property ${JSON.stringify(property, null, 2)}`);
  console.log(`Token: ${token}`);
  await api.post("/Property", property, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const filter = async (filters: any): Promise<Property[]> => {
  const response = await api.get<Property[]>("/Property/filter", {
    params: filters,
  });
  console.log(filters);
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
): Promise<{ id: number; name: string; enumName: string }[]> => {
  const response = await api.get<
    { id: number; name: string; enumName: string }[]
  >(`/Property/districts/${cityId}`);
  return response.data;
};
