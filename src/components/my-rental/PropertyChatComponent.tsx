import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getChatWithMessages } from "../../api/chat";
import {
  getAcceptedUserOffer,
  getPropertyChatIdByOfferId,
} from "../../api/offer";
import { GetPropertyById } from "../../api/property";
import { sendMessage } from "../../api/chat";
import type { Message } from "../../types/Chat";
import { useRef } from "react";

type PropertyChatComponentProps = {
  currentUserId?: number;
  propertyId?: number;
};

const PropertyChatComponent = ({
  currentUserId,
  propertyId,
}: PropertyChatComponentProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [chatGroupId, setChatGroupId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchChat = async () => {
    if (!currentUserId && !propertyId) return;

    try {
      let chatId: number | null = null;

      if (currentUserId) {
        const offer = await getAcceptedUserOffer(Number(currentUserId));
        if (offer) {
          const propertyChatId = await getPropertyChatIdByOfferId(offer.id);
          if (propertyChatId) {
            chatId = propertyChatId;
          }
        }
        console.log(`Chat ID from offer: ${chatId}`);
      } else if (propertyId) {
        const property = await GetPropertyById(propertyId);
        if (property?.chatGroupId) {
          chatId = property.chatGroupId;
        }
      }
      if (!chatId) {
        console.warn("Nie znaleziono chatId!");
        return;
      }
      const data = await getChatWithMessages(chatId);
      setChatMessages(data.messages);
      setChatGroupId(chatId);
    } catch (err) {
      console.error("Błąd ładowania wiadomości", err);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [currentUserId]);
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !chatGroupId) return;

    try {
      const chatCreateMessage = {
        chatId: chatGroupId,
        content: messageText.trim(),
      };
      await sendMessage(chatCreateMessage);
      setMessageText("");

      await fetchChat();
    } catch (err) {
      console.error("Błąd wysyłania wiadomości:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <p className="p-6">Ładowanie...</p>;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-[80vh] max-h-[80vh] rounded-lg shadow-md">
      {/* Lista wiadomości */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {chatMessages.map((msg, index) => {
          const currentDate = new Date(msg.createdAt).toDateString();
          const prevDate =
            index > 0
              ? new Date(chatMessages[index - 1].createdAt).toDateString()
              : null;

          const isFirstOfDay = currentDate !== prevDate;

          return (
            <div key={msg.id}>
              {/* 🔹 Separator daty */}
              {isFirstOfDay && (
                <div className="flex justify-center my-3">
                  <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    {new Date(msg.createdAt).toLocaleDateString("pl-PL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  msg.senderId === currentUserId
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start mr-auto"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Pole wysyłania wiadomości */}
      <form
        className="p-4 border-t flex items-center space-x-2"
        onSubmit={handleSend}
      >
        <input
          type="text"
          placeholder="Napisz wiadomość..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-400 text-black"
          value={messageText}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          type="submit"
        >
          Wyślij
        </button>
      </form>
    </div>
  );
};

export default PropertyChatComponent;
