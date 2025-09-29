export const NotificationType = {
  SendOffer: 0,
  PaymentDue: 1,
  InvitationAccepted: 2,
  Other: 3,
} as const;
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export type NotificationEntity = {
  id: number;
  senderId: number;
  receiverId: number;
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  type: NotificationType;
};

export type PostNotificationDto = {
  receiverId: number;
  type: NotificationType;
};
