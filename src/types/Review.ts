import type { User } from "./User";

export type ReviewEntity = {
  propertyId: number;
  userId: number;
  authorId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  author: User;
};

export type ReviewDto = {
  propertyId?: number;
  userId?: number;
  rating: number;
  comment: string;
};
