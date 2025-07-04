import api from "./axiosInstance";
import type { CreatePayment } from "../types/Payment";

export const createPayment = async (payment: CreatePayment): Promise<void> => {
  await api.post("/Payment", payment);
};
