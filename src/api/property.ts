import api from "./axiosInstance";
import type {
  Property,
  CreateProperty,
  PropertyEntity,
  PropertyImage,
} from "../types/Property";

import type { PagedResult } from "../pages/PropertiesPage";
import type { Filters } from "../types/Property";

// export const getAllActiveProperties = async (): Promise<Property[]> => {
//   const response = await api.get<Property[]>("/Property");
//   return response.data;
// };

export const getAllPagedActiveProperties = async (
  pageNumber: number,
  pageSize: number,
  filters?: Filters
): Promise<PagedResult<Property>> => {
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
    ...(filters?.City && { city: filters.City }),
    ...(filters?.District && { district: filters.District }),
    ...(filters?.PriceFrom !== undefined && {
      priceFrom: String(filters.PriceFrom),
    }),
    ...(filters?.PriceTo !== undefined && { priceTo: String(filters.PriceTo) }),
    ...(filters?.Rooms !== undefined && { rooms: String(filters.Rooms) }),
  });

  const response = await api.get<PagedResult<Property>>(
    `/Property?${params.toString()}`
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
  city: string
): Promise<{ name: string }[]> => {
  const response = await api.get<{ id: number; name: string }[]>(
    `/Property/districts?city=${city}`
  );
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
