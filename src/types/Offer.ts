export type Offer = {
  id: number;
  propertyId: number;
  rentAmount: number;
  depositAmount: number;
  rentalPeriodStart: Date;
  rentalPeriodEnd: Date;
  status: "Active" | "Accepted" | "Completed" | "Cancelled";
  tenantId: number;
  createdAt: Date;
  acceptedAt: Date;
};

export type CreateOffer = {
  propertyId: number;
  rentAmount: number;
  depositAmount: number;
  rentalPeriodStart: Date;
  rentalPeriodEnd: Date;
  tenantId: number;
};
