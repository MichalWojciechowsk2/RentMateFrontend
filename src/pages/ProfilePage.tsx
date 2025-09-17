import { useAuth } from "../context/AuthContext";
import { IoIosSettings } from "react-icons/io";
import { useState, useEffect } from "react";
import ProfileSettingsButtons from "../components/profile/ProfileSettingsButtons";
import { uploadUserPhoto, getUserPhoto, updateUserFields } from "../api/users";
import { requestFormReset } from "react-dom";

//Obsłużyć zmiane aboutMe i telephone

const ProfilePage = () => {
  const { currentUser: user, logout, refreshUser } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Panel użytkownika</h1>
        <p className="text-red-600">Nie jesteś zalogowany.</p>
      </div>
    );
  }
  const handleSelect = (action: string) => {
    setActiveAction(action);
    setShowSettings(false);
  };
  const closeModal = () => setActiveAction(null);

  const handleSubmitAboutMe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const textarea = form.elements.namedItem("aboutMe") as HTMLTextAreaElement;

    if (!textarea.value.trim()) return;
    try {
      await updateUserFields("aboutMe", textarea.value);
      closeModal();
      refreshUser();
    } catch (err) {
      console.error("Failed to update aboutMe", err);
    }
  };
  const handleSumbitPhoneNumber = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const textarea = form.elements.namedItem(
      "phoneNumber"
    ) as HTMLTextAreaElement;
    if (!textarea.value.trim()) return;
    try {
      await updateUserFields("phoneNumber", textarea.value);
      closeModal();
      refreshUser();
    } catch (err) {
      console.error("Failed to update phone number", err);
    }
  };
  const handleSubmitUserPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.elements.namedItem(
      "photo"
    ) as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await uploadUserPhoto(file);
      setUserPhotoUrl(result.imageUrl || result);
      closeModal();
      refreshUser();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const fetchUserPhoto = async () => {
    try {
      const data = await getUserPhoto();
      setUserPhotoUrl(data);
    } catch (error) {
      console.error("Failed to fetch user photo:", error);
    }
  };

  useEffect(() => {
    // refreshUser();
    fetchUserPhoto();
  }, []);

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
                <ProfileSettingsButtons user={user} onSelect={handleSelect} />
              </div>
            )}
          </div>

          <img
            src={
              userPhotoUrl ||
              "https://localhost:7281/uploads/UserPhoto/defaultPersonPhoto.png"
            }
            alt="Profil"
            className="w-32 h-32 rounded-full object-cover mb-4 shadow"
          />
          <h2 className="text-xl font-semibold text-black">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Dane kontaktowe */}
        <div className="mt-2 space-y-2 text-black">
          <p>
            <span className="font-semibold">Telefon: </span>
            {user.phoneNumber || "Brak"}
          </p>
        </div>

        {/* O mnie */}
        {user.aboutMe && (
          <div className="mt-1">
            <h3 className="text-lg font-semibold text-black">O mnie</h3>
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

      {/* MODALE DO ZMIANY PROFILU------------------------------------*/}
      {/* ZMIANA ZDJĘCIA PROFILOWEGO */}
      {activeAction === "changePhoto" && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1b2947] bg-opacity-80 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 flex flex-col items-center">
            {/* Nagłówek */}
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Zmień zdjęcie profilowe
            </h2>

            {/* Podgląd zdjęcia */}
            <div className="w-32 h-32 mb-6">
              <img
                src={
                  userPhotoUrl ||
                  "https://localhost:7281/uploads/UserPhoto/defaultPersonPhoto.png"
                }
                alt="Profil"
                className="w-full h-full object-cover rounded-full shadow-md"
              />
            </div>

            {/* Formularz */}
            <form
              onSubmit={handleSubmitUserPhoto}
              className="w-full flex flex-col items-center"
            >
              <input
                type="file"
                name="photo"
                accept="image/*"
                className="mb-6 w-full text-gray-700 file:bg-blue-400 file:text-white file:px-4 file:py-2 file:rounded file:border-none file:cursor-pointer "
              />

              <div className="flex justify-center gap-4 w-full">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                  Dodaj
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition-colors"
                >
                  Zamknij
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ZMIANA SEKCJI O MNIE */}
      {activeAction === "changeAboutMe" && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1b2947] bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-200">
            {/* formularz do zmiany/dodania aboutMe */}
            <h2 className="text-xl font-semibold mb-4 text-black">
              Sekcja "O mnie"
            </h2>
            <form onSubmit={handleSubmitAboutMe}>
              <textarea
                name="aboutMe"
                defaultValue={user.aboutMe || ""}
                className="border border-black rounded w-full p-2 h-62 text-black"
              />
              <button
                type="submit"
                className="mt-4 text-gray-200 mr-2 bg-blue-600"
              >
                Potwierdź
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="mt-4 text-gray-200"
              >
                Zamknij
              </button>
            </form>
          </div>
        </div>
      )}
      {/* ZMIANA NUMERU TELEFONU */}
      {activeAction === "changePhoneNumber" && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1b2947] bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-100 h-50">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Zmień numer telefonu
            </h2>
            {/* formularz do zmiany telefonu */}
            <form onSubmit={handleSumbitPhoneNumber}>
              <textarea
                name="phoneNumber"
                // value={form.description}
                // onChange={handleChange}
                defaultValue={user.phoneNumber || ""}
                className="border border-black rounded w-full p-2 h-12 text-black"
              />
              <button
                type="submit"
                className="mt-4 text-gray-200 mr-2 bg-blue-600"
              >
                Potwierdź
              </button>
              <button
                onClick={closeModal}
                type="button"
                className="mt-4 text-gray-200"
              >
                Zamknij
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
