import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetPropertyById } from "../api/property";
import type { Property } from "../types/Property";

const PropertyDetailPage = () => {
  const [laoding, setLoading] = useState(Boolean);
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);

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
    fetchProperty(Number(id));
  }, [id]);

  if (laoding) return <p className="p-6">Ładowanie danych oferty...</p>;

  return (
    <div className="p-8 mx-auto bg-[#F1F5F9] min-h-[1000px] shadow-lg rounded-xl">
      {/* Tytuł */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-800 border-l-8 border-blue-600 pl-4 mb-4">
          {property?.title}
        </h1>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in">
        <div className="lg:col-span-2 space-y-10">
          {/* Placeholder galerii */}
          <div className="bg-gray-300 w-full aspect-video flex items-center justify-center rounded-lg">
            <p className="text-gray-600 text-xl font-medium">
              Miejsce na zdjęcie
            </p>
          </div>

          {/* Adres */}
          <div className="text-lg text-gray-700 font-medium">
            📍 {property?.address}, {property?.city}, {property?.district}
          </div>

          {/* Szczegóły */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800">
            {/* Opis */}
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
          <div className="bg-white shadow-md rounded-lg p-6 h-200">
            <p className="text-lg font-semibold text-gray-700">Miejsce</p>
            <p className="text-sm text-gray-500 mb-4">
              Dodać info o użytkowniku który wystawia ogłoszenie (Zdjęcie
              profilowe, Imię, Nazwisko, Ocena, pomyśleć nad linkiem do jego
              profilu). Zrobić te dwa przyciski które są pod spodem i dodać ich
              funkcjonalność.
            </p>
            <button className="w-1/1 mb-2">Wyświetl numer</button>
            <button className="w-1/1">Wyślij wiadomość</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
