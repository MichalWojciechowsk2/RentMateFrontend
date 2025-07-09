export type Payment = {
  id: number;
  offerId: number;
  amount: number;
  description: string;
  status: PaymentStatus;
  dueDate: string;
  paidAt: string;
  paymentMethod: string;
};

export type CreatePayment = {
  propertyId: number;
  offerId: number;
  amount: number;
  description: string;
  dueDate: string;
  paymentMethod: string;
};

export const PaymentStatus = {
  Pending: 0,
  Completed: 1,
  Failed: 2,
  Cancelled: 3,
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
