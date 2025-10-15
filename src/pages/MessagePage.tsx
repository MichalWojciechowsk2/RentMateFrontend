import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { Chat } from "../types/Chat";
import { getChatsForUser } from "../api/chat";
import { sendMessage } from "../api/chat";
import { useNavigate, useParams } from "react-router-dom";

const MessagePage = () => {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();

  const [privateChats, setPrivateChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");

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

  useEffect(() => {
    fetchChats();
  }, []);

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
      setMessageText("");
    } catch (err) {
      console.error("Błąd wysyłania wiadomości:", err);
    }
  };

  if (loading) return <p>Ładowanie czatów...</p>;

  return (
    <div className="flex max-w-6xl mx-auto mt-10 bg-white shadow-lg rounded-xl overflow-hidden h-[80vh]">
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
                    onClick={() => navigate(`${chat.chatId}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h2 className="text-md">{chat.chatName}</h2>
                        <p className="text-sm text-gray-500 truncate w-60">
                          {chat.lastMessageContent || "Brak wiadomości"}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-gray-400 mt-2 sm:mt-0 transform transition-all duration-300 group-hover:-translate-x-6">
                      {chat.lastMessageCreateAt
                        ? new Date(chat.lastMessageCreateAt).toLocaleString()
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
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {/* Tutaj dynamicznie renderuj wiadomości */}
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
    </div>
  );
};

export default MessagePage;
