export type Property = {
  id: number;
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
