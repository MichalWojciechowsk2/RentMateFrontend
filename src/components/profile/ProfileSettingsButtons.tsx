import type { User } from "../../types/User";

type ProfileSettingsButtonsProps = {
  user: User;
};

const ProfileSettingsButtons = ({ user }: ProfileSettingsButtonsProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <button className="w-30 bg-[#101828] py-0 px-2 rounded text-sm">A</button>
      <button className="w-30 bg-[#101828] py-0 px-2 rounded text-sm">B</button>
      <button className="w-30 bg-[#101828] py-0 px-2 rounded text-sm">C</button>
      Zmień zdjęcie, dodaj/zmień opis, zmień numer telefonu
    </div>
  );
};

export default ProfileSettingsButtons;
