import api from "./axiosInstance";
import type {
  ReviewEntity, ReviewDto
} from "../types/Review";

export const createReview = async (
    review: ReviewDto
) : Promise<ReviewEntity> => {
    const response = await api.post('/Review', review);
    return response.data;
}

export const deleteReview = async (
    reviewId:number
) : Promise<boolean> => {
    const response = await api.delete(`/Review/${reviewId}`);
    return response.data;
}

export const getReviewById = async (
    reviewId: number
): Promise <ReviewEntity> => {
    const response = await api.get<ReviewEntity>(`/Review/${reviewId}`);
    return response.data;
}

export const getAllReviewsForUserByUserId = async (
    userId: number
) : Promise<ReviewEntity[]> => {
    const response = await api.get<ReviewEntity[]>(`/Review/user/${userId}`);
    return response.data;
}

export const getAllReviewsForPropertyByPropertyId = async (
    propertyId : number
) : Promise <ReviewEntity[]> => {
    const response = await api.get<ReviewEntity[]>(`/Review/property/${propertyId}`);
    return response.data;
}