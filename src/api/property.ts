import api from "./axiosInstance";
import type {
  Property,
  CreateProperty,
  PropertyEntity,
  PropertyImage,
} from "../types/Property";

import type { PagedResult } from "../pages/PropertiesPage";
import { data, Form } from "react-router-dom";

// export const getAllActiveProperties = async (): Promise<Property[]> => {
//   const response = await api.get<Property[]>("/Property");
//   return response.data;
// };

export const getPagedProperties = async (
  pageNumber: number,
  pageSize: number
): Promise<PagedResult<Property>> => {
  const response = await api.get<PagedResult<Property>>(
    `/Property?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data;
};

export const GetPropertyById = async (id: number): Promise<Property> => {
  const response = await api.get<Property>(`Property/getPropertyById?Id=${id}`);
  return response.data;
};
export const GetPropertyEntityById = async (
  id: number
): Promise<PropertyEntity> => {
  const response = await api.get<PropertyEntity>(
    `Property/getPropertyEntityById?id=${id}`
  );
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

export const UpdateProperty = async (
  propertyId: number,
  propertyEntity: CreateProperty
): Promise<CreateProperty> => {
  const response = await api.patch<CreateProperty>(
    `Property/${propertyId}/updateProperty`,
    propertyEntity
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
): Promise<Property> => {
  const response = await api.post("/Property", property);
  return response.data;
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

export const uploadPropertyImages = async (
  propertyId: number,
  images: File[]
): Promise<any> => {
  const formData = new FormData();
  images.forEach((file) => {
    formData.append("images", file);
  });
  const response = await api.post(`/Property/${propertyId}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const getMainImageByPropertyId = async (
  propertyId: number
): Promise<PropertyImage> => {
  const response = await api.get<PropertyImage>(
    `/Property/mainImageForProperty?propertyId=${propertyId}`
  );
  return response.data;
};

export const getImagesForPropertyUrl = async (
  propertyId: number
): Promise<PropertyImage[]> => {
  const response = await api.get<PropertyImage[]>(
    `/Property/allImagesForProperty?propertyId=${propertyId}`
  );
  return response.data;
};
