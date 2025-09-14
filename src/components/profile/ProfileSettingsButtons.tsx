import type { User } from "../../types/User";

type ProfileSettingsButtonsProps = {
  user: User;
  onSelect: (action: string) => void;
};

const ProfileSettingsButtons = ({
  user,
  onSelect,
}: ProfileSettingsButtonsProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <button
        className="w-30 bg-[#101828] py-0 px-2 rounded text-xs"
        onClick={() => {
          onSelect("changePhoto");
        }}
      >
        Zmień zdjęcie profilowe
      </button>
      {user.aboutMe ? (
        <button
          className="w-30 bg-[#101828] py-0 px-2 rounded text-xs"
          onClick={() => {
            onSelect("changeAboutMe");
          }}
        >
          Zmień sekcje o mnie
        </button>
      ) : (
        <button
          className="w-30 bg-[#101828] py-0 px-2 rounded text-xs"
          onClick={() => {
            onSelect("changeAboutMe");
          }}
        >
          Dodaj sekcje o mnie
        </button>
      )}
      <button
        className="w-30 bg-[#101828] py-0 px-2 rounded text-xs"
        onClick={() => onSelect("changePhoneNumber")}
      >
        Zmień numer telefonu
      </button>
    </div>
  );
};

export default ProfileSettingsButtons;
