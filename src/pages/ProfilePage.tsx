import { useAuth } from "../context/AuthContext";
import { IoIosSettings } from "react-icons/io";
import { useState } from "react";
import ProfileSettingsButtons from "../components/profile/ProfileSettingsButtons";

const ProfilePage = () => {
  const { currentUser: user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Panel użytkownika</h1>
        <p className="text-red-600">Nie jesteś zalogowany.</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Twój profil</h1>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 min-h-110 min-w-150">
        {/* Zdjęcie */}
        <div className="flex flex-col items-center">
          <div className="relative inline-block self-end">
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              className="bg-transparent border-0 p-0 shadow-none hover:bg-transparent focus:outline-none"
            >
              <IoIosSettings className="w-8 h-8 text-black transform transition-transform duration-200 hover:scale-125" />
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-0 bg-white shadow-md rounded-lg p-2 z-50">
                <ProfileSettingsButtons user={user} />
              </div>
            )}
          </div>

          <img
            src={user.photoUrl}
            alt="Profil"
            className="w-32 h-32 rounded-full object-cover mb-4 shadow"
          />
          <h2 className="text-xl font-semibold text-black">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Dane kontaktowe */}
        <div className="mt-6 space-y-2 text-black">
          <p>
            <span className="font-semibold">Telefon: </span>
            {user.phoneNumber || "Brak"}
          </p>
        </div>

        {/* O mnie */}
        {user.aboutMe && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">O mnie</h3>
            <p className="text-gray-700 whitespace-pre-line">{user.aboutMe}</p>
          </div>
        )}

        {/* Wyloguj się*/}
      </div>
      <div className="mt-6 justify-center ">
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Wyloguj się
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
