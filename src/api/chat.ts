import api from "./axiosInstance";
import type {
  Chat,
  ChatEntity,
  ChatCreateMessage,
  Message,
  ChatWithContent,
} from "../types/Chat";

export const getChatsForUser = async (chatId?: number): Promise<Chat[]> => {
  const endpoint = chatId
    ? `Chat/activeUserChatsFirstMessage?sendToUserId=${chatId}`
    : `Chat/activeUserChats`;

  const response = await api.get(endpoint);
  return response.data;
};

export const createPrivateChat = async (
  otherUserId: number
): Promise<ChatEntity> => {
  const response = await api.post(
    `Chat/privateChat?otherUserId=${otherUserId}`
  );
  return response.data;
};

// MESSAGE
export const getMessageById = async (messageId: number): Promise<string> => {
  const response = await api.get(`Message/messageById?messageId=${messageId}`);
  return response.data;
};

export const sendMessage = async (
  messageDto: ChatCreateMessage
): Promise<Message> => {
  const response = await api.post(`Message/send`, messageDto);
  return response.data;
};

export const getChatWithMessages = async (
  chatId: number
): Promise<ChatWithContent> => {
  const response = await api.get(`Message/chat`, { params: { chatId } });
  return response.data;
};
