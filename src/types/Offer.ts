import type { User } from "./User";
import type { Property } from "./Property";

export type Offer = {
  id: number;
  propertyId: number;
  rentAmount: number;
  depositAmount: number;
  rentalPeriodStart: Date;
  rentalPeriodEnd: Date;
  status: OfferStatus;
  tenantId: number;
  createdAt: Date;
  acceptedAt: Date;
  offerContract: string;
  tenant: User;
  property: Property;
};

export type CreateOffer = {
  propertyId: number;
  rentAmount: number;
  depositAmount: number;
  rentalPeriodStart: Date;
  rentalPeriodEnd: Date;
  tenantId: number;
};

export const OfferStatus = {
  Active: 0,
  Accepted: 1,
  Completed: 2,
  Cancelled: 3,
} as const;

export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus];
