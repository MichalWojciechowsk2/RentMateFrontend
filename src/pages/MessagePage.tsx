import { useState, useEffect } from "react";
import type { Chat } from "../types/Chat";
import { getChatsForUser } from "../api/chat";

const MessagePage = () => {
  const [privateChats, setPrivateChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Ładowanie czatów...</p>;
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl overflow-hidden">
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
                new Date(b.LastMessageCreateAt ?? "").getTime() -
                new Date(a.LastMessageCreateAt ?? "").getTime()
            )
            .map((chat) => (
              <li
                key={chat.ChatId}
                className="group hover:bg-gray-50 transition cursor-pointer"
              >
                <button
                  className="relative w-full text-left px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50"
                  // onClick={() => toggleChat(chat.ChatId)}
                >
                  <div className="flex items-center space-x-4">
                    {/* <img
                      src={
                        chat.photoUrl ||
                        "https://localhost:7281/uploads/UserPhoto/defaultPersonPhoto.png"
                      }
                      alt={"UserPhoto"}
                      className="w-10 h-10 rounded-full object-cover"
                    /> */}
                    <div>
                      <h2 className={`text-md`}>{chat.ChatName}</h2>
                      <p className="text-sm text-gray-500 truncate w-60">
                        {chat.LastMessageContent || "Brak wiadomości"}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-gray-400 mt-2 sm:mt-0 transform transition-all duration-300 group-hover:-translate-x-6">
                    {chat.LastMessageCreateAt
                      ? new Date(chat.LastMessageCreateAt).toLocaleString()
                      : ""}
                  </span>
                </button>
              </li>
            ))
        )}
      </ul>
    </div>
  );
};

export default MessagePage;
