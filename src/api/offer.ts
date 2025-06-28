import api from "./axiosInstance";
import type { Offer, CreateOffer } from "../types/Offer";

export const createOffer = async (offer: CreateOffer): Promise<void> => {
  await api.post("/Offer", offer);
};

export const getValidOffersByPropertyId = async (
  propertyId: number
): Promise<Offer[]> => {
  const response = await api.get<Offer[]>(
    `Offer/getActiveAndAcceptedOffersByPropId?propertyId=${propertyId}`
  );
  return response.data;
};
