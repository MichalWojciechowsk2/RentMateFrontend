import api from "./axiosInstance";
import type { CreatePayment, Payment } from "../types/Payment";

export const createPayment = async (payment: CreatePayment): Promise<void> => {
  await api.post("/Payment", payment);
};

export const getPaymentsByActiveUserOffers = async (): Promise<Payment[]> => {
  const response = await api.get<Payment[]>(
    "/Payment/getPaymentsByActiveUserOffers"
  );
  return response.data;
};
