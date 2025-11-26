import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { Chat, Message } from "../types/Chat";
import { getChatsForUser } from "../api/chat";
import { sendMessage, getChatWithMessages } from "../api/chat";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRef } from "react";
import { FaCommentMedical } from "react-icons/fa6";

const TAKE = 12;

const MessagePage = () => {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const { currentUser } = useAuth();

  const [privateChats, setPrivateChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [skip, setSkip] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const messageStartRef = useRef<HTMLDivElement | null>(null);

  // Fetch wszystkich czatów
  const fetchChats = async () => {
    try {
      const data = await getChatsForUser();
      setPrivateChats(data);
    } catch (err) {
      console.error("Błąd pobierania czatów:", err);
    } finally {
      setLoading(false);
    }
  };

  //Fetch konkretnego chatu
  const fetchChatBasedOnId = async (
    chatId: number,
    append = false,
    skipValue = skip
  ) => {
    try {
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
    } catch (err) {
      console.error("Błąd pobierania wiadomości: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    if (chatId) fetchChatBasedOnId(Number(chatId));
  }, [chatId]);
  // Obsługa inputa
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  // Wysyłanie wiadomości
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !chatId) return;

    try {
      const chatCreateMessage = {
        chatId: Number(chatId),
        content: messageText.trim(),
      };
      await sendMessage(chatCreateMessage);
      fetchChatBasedOnId(Number(chatId));
      setMessageText("");
    } catch (err) {
      console.error("Błąd wysyłania wiadomości:", err);
    }
  };

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
      await fetchChatBasedOnId(Number(chatId), true, newSkip);
      setSkip(newSkip);

      requestAnimationFrame(() => {
        const newHeight = containerRef.current!.scrollHeight;
        containerRef.current!.scrollTop = newHeight - prevHeight;
      });
      setIsLoadingMore(false);
    }
  };

  if (loading) return <p>Ładowanie czatów...</p>;

  return (
    <div className="flex max-w-7xl mx-auto mt-10 bg-white shadow-lg rounded-xl overflow-hidden h-[80vh]">
      {/* Lewa kolumna - lista czatów */}
      <div
        className={`${chatId ? "w-1/3" : "w-full"} border-r overflow-y-auto`}
      >
        <div className="border-b px-6 py-4 bg-gray-50">
          <h1 className="text-xl font-semibold text-gray-800">Twoje czaty</h1>
        </div>
        <ul className="divide-y divide-gray-200">
          {privateChats.length === 0 ? (
            <li className="p-6 text-gray-500 text-center">
              Brak rozpoczętych rozmów
            </li>
          ) : (
            privateChats
              .sort(
                (a, b) =>
                  new Date(b.lastMessageCreateAt ?? "").getTime() -
                  new Date(a.lastMessageCreateAt ?? "").getTime()
              )
              .map((chat) => (
                <li
                  key={chat.chatId}
                  className="group hover:bg-gray-50 transition cursor-pointer"
                >
                  <button
                    className="relative w-full text-left px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50"
                    onClick={() => navigate(`/chats/${chat.chatId}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <img
                          src={`https://localhost:7281${chat.otherUserPhotoUrl}`}
                          alt="Avatar użytkownika"
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      </div>
                      <div>
                        <h2 className="text-md text-black">
                          {chat.otherUserName}
                        </h2>
                        <p className="text-sm text-gray-500 truncate w-60">
                          {chat.lastMessageContent || "Brak wiadomości"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2 sm:mt-0 transform transition-all duration-300 group-hover:-translate-x-6">
                      {chat.lastMessageCreateAt
                        ? new Date(chat.lastMessageCreateAt).toLocaleString(
                            "pl-PL",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : ""}
                    </span>
                  </button>
                </li>
              ))
          )}
        </ul>
      </div>

      {/* Prawa kolumna - okno wiadomości */}
      {chatId && (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Lista wiadomości */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 p-4 overflow-y-auto space-y-2"
          >
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

                  {/* 🔹 Sama wiadomość */}
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.senderId === currentUser?.id
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
      )}
      {chatId && (
        <div className="flex items-start ml-2 bg-[#101828]">
          <button className="absolute top-1/6 right-60 transform -translate-y-1/2 bg-transparent hover:bg-transparent focus:bg-transparent">
            <FaCommentMedical className="text-[#535BF2] text-4xl" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
