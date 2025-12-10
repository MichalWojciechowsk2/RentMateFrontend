import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetPropertyById } from "../api/property";
import type { Property } from "../types/Property";
import * as Tabs from "@radix-ui/react-tabs";
import PropertyComponent from "../components/my-properties/Property/PropertyComponent";
import OfferComponent from "../components/my-properties/Offer/OfferComponent";
import PaymentOwnerComponent from "../components/my-properties/Payments/PaymentOwnerComponent";
import PropertyChatComponent from "../components/my-rental/PropertyChatComponent";
import PropertyIssuesComponent from "../components/my-properties/Issues/PropertyIssuesComponent";
import { useAuth } from "../context/AuthContext";

const tabs = [
  { value: "property", label: "Mieszkanie" },
  { value: "offer", label: "Umowy wynajmu" },
  { value: "payments", label: "Rachunki" },
  { value: "problems", label: "Problemy" },
  { value: "chat", label: "Chat" },
];

const MenagePropertyPage = () => {
  const [loading, setLoading] = useState(Boolean);
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const { currentUser: user } = useAuth();

  const fetchProperty = async (id?: number) => {
    if (id === undefined) return;
    setLoading(true);
    try {
      let data;
      data = await GetPropertyById(id);
      setProperty(data);
    } catch (err) {
      console.error("Błąd wczytywania oferty", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProperty(Number(id));
  }, [id]);

  if (loading) return <p className="p-6">Ładowanie twojego mieszkania...</p>;

  return (
    <div className="p-8 mx-auto bg-[#F1F5F9] min-h-[1000px] shadow-lg rounded-xl">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-800 border-l-8 border-blue-600 pl-4 mb-4">
          {property?.title}
        </h1>
      </div>
      <div className="p-6">
        <Tabs.Root className="w-full" defaultValue="property">
          <Tabs.List className="flex w-full border-b border-gray-300">
            {tabs.map(({ value, label }) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className={`
                  group
                  flex-1 text-center px-0 py-3
                  bg-[#F8FAFC]
                  data-[state=active]:bg-gray-300
                  data-[state=active]:font-semibold
                  text-black
                  cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-gray-500
                  border-r last:border-r-0
                  rounded-b-none
                  flex justify-center items-center
                  `}
              >
                <span
                  className="
                    transition-transform duration-300 ease-in-out
                    group-data-[state=active]:text-lg
                    group-data-[state=active]:scale-110
                    "
                >
                  {label}
                </span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <div className="bg-[#F1F5F9]">
            <Tabs.Content value="property">
              <PropertyComponent onRefetch={() => fetchProperty(Number(id))} />
            </Tabs.Content>
            <Tabs.Content value="offer">
              <OfferComponent propertyId={Number(id)} />
            </Tabs.Content>
            <Tabs.Content value="payments">
              <PaymentOwnerComponent propertyId={Number(id)} />
            </Tabs.Content>
            <Tabs.Content value="problems">
              <div className="pt-6">
                <PropertyIssuesComponent propertyId={Number(id)} />
              </div>
            </Tabs.Content>
            <Tabs.Content value="chat">
              <PropertyChatComponent
                currentUserId={user?.id}
                propertyId={Number(id)}
              />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default MenagePropertyPage;
