import * as signalR from "@microsoft/signalr";
import type { NotificationEntity } from "../types/Notifications";

let connection: signalR.HubConnection | null = null;

export const startNotificationHub = async (token?: string) => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7281/hubs/notifications", {
        accessTokenFactory: () => token || "",
      })
      .withAutomaticReconnect()
      .build();

    await connection.start();
  }
  return connection;
};

export const onReceiveUnreadCount = (callback: (count: number) => void) => {
  if (!connection) return;
  connection.on("ReceiveUnreadCount", callback);
};

export const stopNotificationHub = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
  }
};
