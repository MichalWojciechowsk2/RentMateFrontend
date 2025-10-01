import React, { useEffect, useState } from "react";
import { getListOfNotifications, readNotification } from "../api/notifications";
import type { NotificationEntity } from "../types/Notifications";

const InboxPage = () => {
  const [listOfNotifications, setListOfNotifications] = useState<
    NotificationEntity[]
  >([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const readNoti = async (noti: NotificationEntity) => {
    setExpandedId(expandedId === noti.id ? null : noti.id);
    if (!noti.isRead) {
      setListOfNotifications((prev) =>
        prev.map((n) => (n.id === noti.id ? { ...n, isRead: true } : n))
      );
      try {
        await readNotification(noti.id);
      } catch (err) {
        console.error("Błąd oznaczania powiadomienia jako przeczytane:", err);
      }
    }
  };

  useEffect(() => {
    getListOfNotifications()
      .then(setListOfNotifications)
      .catch((err) => console.error("Błąd pobierania notyfikacji:", err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="border-b px-6 py-4 bg-gray-50">
        <h1 className="text-xl font-semibold text-gray-800">Powiadomienia</h1>
      </div>
      <ul className="divide-y divide-gray-200">
        {listOfNotifications.length === 0 ? (
          <li className="p-6 text-gray-500 text-center">Brak powiadomień</li>
        ) : (
          listOfNotifications
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((n) => (
              <li
                key={n.id}
                className="hover:bg-gray-50 transition cursor-pointer"
              >
                <button
                  className="w-full text-left px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50"
                  onClick={() => readNoti(n)}
                >
                  <div>
                    <h2
                      className={`text-md ${
                        n.isRead
                          ? "font-normal text-gray-500"
                          : "font-bold text-gray-900"
                      }`}
                    >
                      {n.title}
                    </h2>
                    {expandedId === n.id && (
                      <p className="mt-2 text-gray-700">{n.message}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 mt-2 sm:mt-0">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </button>
              </li>
            ))
        )}
      </ul>
    </div>
  );
};

export default InboxPage;
