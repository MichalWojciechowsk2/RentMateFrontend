import api from "./axiosInstance";
import type {
  NotificationEntity,
  PostNotificationDto,
} from "../types/Notifications";

export const createNotification = async (
  dto: PostNotificationDto
): Promise<NotificationEntity> => {
  const response = await api.post("/Notification", dto);
  return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get("/Notification/countUnreadNotification");
  return response.data;
};

export const getListOfNotifications = async (): Promise<
  NotificationEntity[]
> => {
  const response = await api.get("/Notification");
  return response.data;
};
