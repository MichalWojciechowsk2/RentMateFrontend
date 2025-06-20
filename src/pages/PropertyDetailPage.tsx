import { data, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetPropertyById } from "../api/property";
import { getUserById } from "../api/users";
import type { Property } from "../types/Property";
import type { User } from "../types/User";

const PropertyDetailPage = () => {
  const [laoding, setLoading] = useState(Boolean);
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyOwner, setPropertyOwner] = useState<User | null>(null);
  const [ownerNumberActive, setOwnerNumberActive] = useState<Boolean>(false);

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
  const fetchUser = async (ownerId: number) => {
    setLoading(true);
    try {
      let data = await getUserById(ownerId);
      setPropertyOwner(data);
    } catch (err) {
      console.error("Błąd wczytywania właściciela", err);
    } finally {
      setLoading(false);
      console.log("Property owner: ", propertyOwner);
    }
  };

  useEffect(() => {
    fetchProperty(Number(id));
  }, [id]);
  useEffect(() => {
    if (property?.ownerId) {
      fetchUser(property.ownerId);
    }
  }, [property]);

  if (laoding) return <p className="p-6">Ładowanie danych oferty...</p>;

  return (
    <div className="p-8 mx-auto bg-[#F1F5F9] min-h-[1000px] shadow-lg rounded-xl">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-800 border-l-8 border-blue-600 pl-4 mb-4">
          {property?.title}
        </h1>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-gray-300 w-full aspect-video flex items-center justify-center rounded-lg">
            <p className="text-gray-600 text-xl font-medium">
              Miejsce na zdjęcie
            </p>
          </div>

          <div className="text-lg text-gray-700 font-medium">
            📍 {property?.address}, {property?.city}, {property?.district}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800">
            <div className="md:col-span-2">
              <p className="font-semibold mb-1">📝 Opis:</p>
              <p className="text-gray-700 whitespace-pre-line">
                {property?.description}
              </p>
            </div>

            <div>
              <p className="font-semibold mb-1">🛏️ Liczba pokoi:</p>
              <p>{property?.roomCount}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">📐 Powierzchnia:</p>
              <p>{property?.area} m²</p>
            </div>
            <div>
              <p className="font-semibold mb-1">💰 Kaucja:</p>
              <p>{property?.baseDeposit} zł</p>
            </div>
            <div>
              <p className="font-semibold mb-1">💰 Cena wynajmu:</p>
              <p>{property?.basePrice} zł</p>
            </div>
          </div>
        </div>

        {/* Prawa kolumna */}
        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Właściciel ogłoszenia
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <Link
                to={`/user/${propertyOwner?.id}/profile`}
                className="flex space-x-4 items-center"
              >
                <div className="bg-gray-300 w-20 h-20 flex items-center justify-center rounded-full p-2">
                  Zdj prof
                </div>
                <div>
                  <div>
                    {propertyOwner?.firstName} {propertyOwner?.lastName}
                  </div>
                  <div>Ocena ⭐</div>
                </div>
              </Link>
            </div>
            {!ownerNumberActive ? (
              <button
                className="w-1/1 mb-2"
                onClick={() => setOwnerNumberActive(true)}
              >
                Wyświetl numer
              </button>
            ) : (
              <button
                className="w-full mb-2"
                onClick={() => setOwnerNumberActive(false)}
              >
                {propertyOwner?.phoneNumber}
              </button>
            )}
            <button className="w-full">Wyślij wiadomość</button>
            <p className="text-black">
              ZROBIĆ WIADOMOŚCI, OCENY, ZDJECIA !!!!!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
