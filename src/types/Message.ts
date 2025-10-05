type UserChat = {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  lastMessage?: string;
};

type Message = {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
};
