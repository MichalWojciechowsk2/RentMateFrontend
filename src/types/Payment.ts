export type CreatePayment = {
  offerId: number;
  amount: number;
  description: string;
  dueDate: string;
  paymentMethod: string;
};
