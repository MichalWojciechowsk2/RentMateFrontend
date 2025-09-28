import * as signalR from "@microsoft/signalr";
import type { NotificationEntity } from "../types/Notifications";

let connection: signalR.HubConnection | null = null;

// export const startNotificationHub = async (token?: string) => {
//   if (!connection) {
//     console.log("StartedConnection");
//     connection = new signalR.HubConnectionBuilder()
//       .withUrl("https://localhost:7281/hubs/notifications", {
//         accessTokenFactory: () => token || "",
//       })
//       .withAutomaticReconnect()
//       .build();

//     await connection.start();
//   }
//   console.log(connection.baseUrl);
//   return connection;
// };

export const startNotificationHub = async (token?: string) => {
  if (!connection) {
    console.log("🔑 Token passed to SignalR:", token);

    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7281/hubs/notifications", {
        accessTokenFactory: () => token || "",
      })
      .withAutomaticReconnect()
      .build();

    connection.onclose((err) => console.log("Hub disconnected:", err));
    connection.onreconnecting((err) => console.log("Hub reconnecting:", err));
    connection.onreconnected((id) => console.log("Hub reconnected:", id));

    try {
      await connection.start();
      console.log("✅ Connected to hub, state:", connection.state);
    } catch (err) {
      console.error("❌ Failed to connect to hub:", err);
    }
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
