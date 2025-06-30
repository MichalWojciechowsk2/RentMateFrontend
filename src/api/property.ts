import api from "./axiosInstance";
import type { Property, CreateProperty } from "../types/Property";

export const getAllActiveProperties = async (): Promise<Property[]> => {
  const response = await api.get<Property[]>("/Property");
  return response.data;
};
export const GetPropertyById = async (id: number): Promise<Property> => {
  const response = await api.get<Property>(`Property/getPropertyById?id=${id}`);
  return response.data;
};

export const UpdateIsActive = async (
  propertyId: number,
  newIsActive: boolean
): Promise<Property> => {
  const response = await api.patch<Property>(
    `Property/${propertyId}/isActive`,
    newIsActive
  );
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
  await api.post("/Property", property);
};

export const filter = async (filters: any): Promise<Property[]> => {
  const response = await api.get<Property[]>("/Property/filter", {
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
): Promise<{ id: number; name: string; enumName: string }[]> => {
  const response = await api.get<
    { id: number; name: string; enumName: string }[]
  >(`/Property/districts/${cityId}`);
  return response.data;
};
