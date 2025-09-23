import * as signalR from "@microsoft/signalr";
import type { NotificationEntity } from "../types/Notifications";

let connection: signalR.HubConnection | null = null;

export const startNotificationHub = (token?: string) => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/hubs/notifications", {
        accessTokenFactory: () => token || "",
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("Połączono z signalR"))
      .catch((err) => console.error("Błąd połączenia z signalR: ", err));
  }
  console.log("Mam połączenie", connection);
  return connection;
};

export const onReceiveUnreadCount = (callback: (count: number) => void) => {
  if (!connection) return;
  connection.on("ReceiveUnreadCount", callback);
};
