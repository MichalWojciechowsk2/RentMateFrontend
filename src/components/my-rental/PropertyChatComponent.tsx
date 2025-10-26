import { useEffect, useState } from "react";
import { getChatWithMessages } from "../../api/chat";
import { getAcceptedUserOffer } from "../../api/offer";
import { GetPropertyById } from "../../api/property";
import type { Message } from "../../types/Chat";

type PropertyChatComponentProps = {
  currentUserId?: number;
};
const PropertyChatComponent = ({
  currentUserId,
}: PropertyChatComponentProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  useEffect(() => {
    const fetchChat = async () => {
      if (!currentUserId) return;

      try {
        setLoading(true);
        const offer = await getAcceptedUserOffer(Number(currentUserId));
        if (offer) {
          const data = await getChatWithMessages(offer.property.chatGroupId);
          setChatMessages(data.messages);
        }
      } catch (err) {
        console.error("Błąd ładowania wiadomości", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [currentUserId]);

  if (loading) return <p className="p-6">Ładowanie...</p>;
  return (
    <div>
      <div></div>
    </div>
  );
};
export default PropertyChatComponent;
