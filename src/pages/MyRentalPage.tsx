import * as Tabs from "@radix-ui/react-tabs";

const tabs = [
  { value: "umowa", label: "Umowa" },
  { value: "harmonogram", label: "Harmonogram" },
  { value: "kalendarz", label: "Kalendarz" },
  { value: "usterki", label: "Usterki" },
  { value: "historia", label: "Historia" },
];

export default function MyRentalPage() {
  return (
    <div className="p-6">
      <Tabs.Root className="w-full">
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

        <div className="bg-gray-50 p-4">
          {tabs.map(({ value, label }) => (
            <Tabs.Content
              key={value}
              value={value}
              className="outline-none text-black"
            >
              <div>Treść zakładki {label}</div>
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>
    </div>
  );
}
