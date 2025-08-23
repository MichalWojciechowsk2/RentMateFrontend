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

// export type PropertyImage = {
//   PropertyId: number;
//   images: List<>;
// };
