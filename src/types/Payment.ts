export type CreatePayment = {
  propertyId: number;
  offerId: number;
  amount: number;
  description: string;
  dueDate: string;
  paymentMethod: string;
};
