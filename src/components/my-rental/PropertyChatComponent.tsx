import { useEffect, useState, useRef } from "react";
import type { FormEvent } from "react";
import { getChatWithMessages, sendMessage } from "../../api/chat";
import {
  getAcceptedUserOffer,
  getPropertyChatIdByOfferId,
} from "../../api/offer";
import { GetPropertyById } from "../../api/property";
import type { Message } from "../../types/Chat";
import { useAuth } from "../../context/AuthContext.tsx";

type PropertyChatComponentProps = {
  currentUserId?: number;
  propertyId?: number;
};

const TAKE = 12;

const PropertyChatComponent = ({
  currentUserId,
  propertyId,
}: PropertyChatComponentProps) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [chatGroupId, setChatGroupId] = useState<number | null>(null);

  const [skip, setSkip] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchChat = async (append = false, skipValue = skip) => {
    if (!currentUserId && !propertyId) return;

    let chatId: number | null = null;

    if (currentUserId && !propertyId) {
      const offer = await getAcceptedUserOffer(Number(currentUserId));
      if (offer) {
        const propertyChatId = await getPropertyChatIdByOfferId(offer.id);
        if (propertyChatId) chatId = propertyChatId;
      }
    } else if (currentUserId && propertyId) {
      const property = await GetPropertyById(propertyId);
      if (property?.chatGroupId) chatId = property.chatGroupId;
    }

    if (!chatId) return;

    const data = await getChatWithMessages(chatId, skipValue, TAKE);

    const sorted = data.messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    if (append) {
      setChatMessages((prev) => [...sorted, ...prev]);
    } else {
      setChatMessages(sorted);
      setTimeout(() => scrollToBottom(), 50);
    }

    setChatGroupId(chatId);
  };

  useEffect(() => {
    fetchChat();
  }, [currentUserId]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const handleScroll = async () => {
    if (!containerRef.current || isLoadingMore) return;

    if (containerRef.current.scrollTop === 0) {
      setIsLoadingMore(true);

      const prevHeight = containerRef.current.scrollHeight;

      const newSkip = skip + TAKE;
      await fetchChat(true, newSkip);
      setSkip(newSkip);

      requestAnimationFrame(() => {
        const newHeight = containerRef.current!.scrollHeight;
        containerRef.current!.scrollTop = newHeight - prevHeight;
      });

      setIsLoadingMore(false);
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !chatGroupId) return;

    await sendMessage({ chatId: chatGroupId, content: messageText.trim() });
    setMessageText("");
    await fetchChat(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-[80vh] rounded-lg shadow-md">
      {/* Lista wiadomości */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto flex flex-col space-y-2"
      >
        {chatMessages.map((msg, index) => {
          const showDate =
            index === 0 ||
            new Date(chatMessages[index - 1].createdAt).toDateString() !==
              new Date(msg.createdAt).toDateString();

          return (
            <div key={msg.id}>
              {showDate && (
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
                <span className="text-xs opacity-70 block text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t flex space-x-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Napisz wiadomość..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-400 text-black"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
          Wyślij
        </button>
      </form>
    </div>
  );
};

export default PropertyChatComponent;
