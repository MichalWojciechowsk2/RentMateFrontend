import api from "./axiosInstance";
import type { Chat } from "../types/Chat";

export const getChatsForUser = async (): Promise<Chat[]> => {
  const response = await api.get("Chat/activeUserChats");
  return response.data;
};

export const createPrivateChat = async (otherUserId: number): Promise<Chat> => {
  const response = await api.post(
    `Chat/privateChat?otherUserId=${otherUserId}`
  );
  return response.data;
};
