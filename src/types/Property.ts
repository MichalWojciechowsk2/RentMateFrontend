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
};

export type CreateProperty = {
  // ownerId: string;
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
  // ownerUsername: string;
};
