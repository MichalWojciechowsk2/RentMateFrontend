import api from "./axiosInstance";
import type {
  CreatePayment,
  Payment,
  PaymentWithTenantName,
  RecurringPaymentDto,
} from "../types/Payment";

export const createPayment = async (payment: CreatePayment): Promise<void> => {
  await api.post("/Payment", payment);
};

export const getPaymentsByActiveUserOffers = async (): Promise<Payment[]> => {
  const response = await api.get<Payment[]>(
    "/Payment/getPaymentsByActiveUserOffers"
  );
  return response.data;
};

export const getAllPaymentsForPropertyByActiveUserOffers = async (
  propertyId: number
): Promise<PaymentWithTenantName[]> => {
  const response = await api.get<PaymentWithTenantName[]>(
    `/Payment/getAllPaymentsForPropertyByActiveUserOffers?propertyId=${propertyId}`
  );
  return response.data;
};

export const getAllRecurringPaymentsByPropertyId = async (
  propertyId: number
): Promise<RecurringPaymentDto[]> => {
  const response = await api.get<RecurringPaymentDto[]>(
    `/Payment/getAllRecurringPaymentsByPropertyId?propertyId=${propertyId}`
  );
  return response.data;
};
