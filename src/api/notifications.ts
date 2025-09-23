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
