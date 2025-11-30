import type { User } from "./User";

export type Chat = {
  chatId: number;
  chatName: string;
  lastMessageContent: string;
  lastMessageCreateAt: Date;
  otherUserId: number;
  otherUserPhotoUrl: string;
  otherUserName: string;
};

export type ChatEntity = {
  id: number;
  name: string;
  isGroup: boolean;
  createdAt: Date;
  lastMessageId: number;
};

export type ChatCreateMessage = {
  chatId: number;
  content: string;
};

export type Message = {
  id: number;
  senderId: number;
  content: string;
  isRead: boolean;
  createdAt: Date;
  chatId: number;
};

export type ChatWithContent = {
  chatId: number;
  users: User[];
  messages: Message[];
};
