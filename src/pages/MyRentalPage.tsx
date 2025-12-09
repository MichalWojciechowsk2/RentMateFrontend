import * as Tabs from "@radix-ui/react-tabs";
import MyOfferComponent from "../components/my-rental/MyOfferComponent.tsx";
import PaymentTenantComponent from "../components/my-rental/Payments/PaymentTenantComponent.tsx";
import PropertyChatComponent from "../components/my-rental/PropertyChatComponent.tsx";
import AddIssueFormComponent from "../components/my-rental/Issues/AddIssueFormComponent.tsx";
import TenantIssuesList from "../components/my-rental/Issues/TenantIssuesList.tsx";
import { useAuth } from "../context/AuthContext.tsx";

// 1. Dodałem nową zakładkę "problemy" do listy
const tabs = [
  { value: "oferta", label: "oferta" },
  { value: "rachunki", label: "rachunki" },
  { value: "chat", label: "chat" },
  { value: "problemy", label: "Zgłoś problem" },
];

export default function MyRentalPage() {
  const { currentUser: user } = useAuth();

  return (
    <div className="p-6">
      <Tabs.Root className="w-full" defaultValue="problemy">
        <Tabs.List className="flex w-full border-b border-gray-300">
          {tabs.map(({ value, label }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className={`
            group
            flex-1 text-center px-0 py-3
            bg-white
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

        <div className="bg-[#F1F5F9] p-4"> {/* Dodałem p-4 dla ładniejszego odstępu */}

          <Tabs.Content value="oferta">
            <MyOfferComponent currentUserId={user?.id} />
          </Tabs.Content>

          <Tabs.Content value="rachunki">
            <PaymentTenantComponent />
          </Tabs.Content>

          <Tabs.Content value="chat">
            <PropertyChatComponent currentUserId={user?.id} />
          </Tabs.Content>

          <Tabs.Content value="problemy">
            <div className="bg-white p-4 rounded shadow-sm">
              <AddIssueFormComponent
                propertyId={1}
                onSuccess={() => window.location.reload()}
              />
              <TenantIssuesList />
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}