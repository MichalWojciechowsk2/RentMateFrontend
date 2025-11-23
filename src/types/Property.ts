export type Property = {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  address: string;
  area: number;
  district: string;
  roomCount: number;
  city: string;
  postalCode: string;
  basePrice: number;
  baseDeposit: number;
  isActive: boolean;
  chatGroupId: number;
};
export type PropertyEntity = {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  address: string;
  area: number;
  district: string;
  roomCount: number;
  city: string;
  postalCode: string;
  basePrice: number;
  baseDeposit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  chatGroupId: number;
};

export type CreateProperty = {
  title: string;
  description: string;
  address: string;
  area: number;
  district: string;
  roomCount: number;
  city: string;
  postalCode: string;
  basePrice: number;
  baseDeposit: number;
};

export type PropertyImage = {
  propertyId: number;
  imageUrl: string;
  isMainImage: boolean;
};

export interface Filters {
  City?: string;
  District?: string;
  PriceFrom?: number;
  PriceTo?: number;
  Rooms?: number;
}
