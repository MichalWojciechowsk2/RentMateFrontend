import api from "./axiosInstance";
import type { Offer, CreateOffer, OfferStatus } from "../types/Offer";

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

export const getOffersByUserId = async (userId: number): Promise<Offer[]> => {
  const response = await api.get<Offer[]>(
    `Offer/getOfferByUserId?userId=${userId}`
  );
  return response.data;
};

export const updateOfferStatus = async (
  offerId: number,
  offerStatus: OfferStatus
): Promise<Offer> => {
  const response = await api.patch<Offer>(
    `Offer/${offerId}/status`,
    offerStatus
  );
  return response.data;
};
