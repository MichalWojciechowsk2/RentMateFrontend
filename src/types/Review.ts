export type ReviewEntity = {
  userId: number;
  authorId: number;
  rating: number;
  comment: string;
  createdAt: Date;
};

export type ReviewDto = {
  propertyId?: number;
  userId?: number;
  rating: number;
  comment: string;
};
