import { data, Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  GetPropertyById,
  GetPropertiesByOwnerId,
  getMainImageByPropertyId,
  getImagesForPropertyUrl,
} from "../api/property";
import { getUserById } from "../api/users";
import type { Property, PropertyImage } from "../types/Property";
import type { User } from "../types/User";

const PropertyDetailPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyOwner, setPropertyOwner] = useState<User | null>(null);
  const [ownerNumberActive, setOwnerNumberActive] = useState(false);
  const [propertyOwnerOtherProperties, setPropertyOwnerOtherProperties] =
    useState<Property[] | null>(null);
  const [mainImages, setMainImages] = useState<Record<number, string>>({});
  const [mainImage, setMainImage] = useState<PropertyImage | null>(null);
  const [otherImages, setOtherImages] = useState<PropertyImage[]>([]);

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

  const fetchImagesForMainProperty = async (id?: number) => {
    if (!id) return;
    setLoading(true);
    try {
      const images = await getImagesForPropertyUrl(id);
      setMainImage(images.find((img) => img.isMainImage) || null);
      setOtherImages(images.filter((img) => !img.isMainImage));
    } catch (err) {
      console.error("Błąd pobierania zdjęć:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMainImages = async (properties: Property[]) => {
    const images: Record<number, string> = {};
    await Promise.all(
      properties.map(async (prop) => {
        try {
          const image = await getMainImageByPropertyId(prop.id);
          if (image) images[prop.id] = image.imageUrl;
        } catch (err) {
          console.error(
            `Błąd pobierania zdjęcia dla propertyId=${prop.id}:`,
            err
          );
        }
      })
    );
    setMainImages(images);
  };

  const fetchOwnerOtherProperties = async (ownerId?: number) => {
    if (ownerId === undefined) return;
    setLoading(true);
    try {
      console.log("OwnerId: ", ownerId);
      let data = await GetPropertiesByOwnerId(ownerId);
      setPropertyOwnerOtherProperties(data);
    } catch (err) {
      console.error("Błąd przy wczytywaniu innych ofert wynajmującego: ", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (ownerId: number) => {
    setLoading(true);
    try {
      let data = await getUserById(ownerId);
      setPropertyOwner(data);
      fetchOwnerOtherProperties(ownerId);
    } catch (err) {
      console.error("Błąd wczytywania właściciela", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const mainPropertyId = Number(id);
    if (id) {
      fetchProperty(mainPropertyId);
      fetchImagesForMainProperty(mainPropertyId);
    }
  }, [id]);

  useEffect(() => {
    if (property?.ownerId) fetchUser(property.ownerId);
  }, [property?.ownerId]);
  useEffect(() => {
    console.log("Property owner: ", propertyOwner);
    console.log(
      "Zaktualizowane oferty właściciela:",
      propertyOwnerOtherProperties
    );
  }, [propertyOwnerOtherProperties]);
  useEffect(() => {
    if (
      propertyOwnerOtherProperties &&
      propertyOwnerOtherProperties.length > 0
    ) {
      fetchMainImages(propertyOwnerOtherProperties);
    }
  }, [propertyOwnerOtherProperties]);

  if (loading) return <p className="p-6">Ładowanie danych oferty...</p>;

  return (
    <div className="p-8 mx-auto bg-[#F1F5F9] min-h-[1000px] shadow-lg rounded-xl">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-800 border-l-8 border-blue-600 pl-4 mb-4">
          {property?.title}
        </h1>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in mb-30">
        <div className="lg:col-span-2 space-y-10">
          <div className="w-full">
            {/* Główne zdjęcie */}
            {mainImage ? (
              <img
                src={mainImage.imageUrl}
                alt="Główne zdjęcie"
                className="w-full aspect-video object-cover rounded-lg shadow"
              />
            ) : loading ? (
              <div className="bg-gray-300 w-full aspect-video flex items-center justify-center rounded-lg">
                <p className="text-gray-600 text-xl font-medium">
                  Ładowanie zdjęcia...
                </p>
              </div>
            ) : (
              <div className="bg-gray-300 w-full aspect-video flex items-center justify-center rounded-lg">
                <p className="text-gray-600 text-xl font-medium">
                  Brak zdjęcia
                </p>
              </div>
            )}

            {/* Pozostałe zdjęcia */}
            {otherImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {otherImages.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageUrl}
                    alt={`Zdjęcie ${index + 1}`}
                    className="aspect-video object-cover rounded-lg shadow"
                  />
                ))}
              </div>
            )}
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

      <div className="text-black">
        Inne oferty od {propertyOwner?.firstName} {propertyOwner?.lastName}
      </div>
      <div>
        {propertyOwnerOtherProperties
          ?.filter((p) => property && p.id !== property.id)
          .map((p) => (
            <li key={p.id}>
              <Link to={`/property/${p.id}`}>
                <div className="flex flex-col md:flex-row bg-white shadow-md rounded-2xl overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300">
                  {/* Placeholder na zdjęcie */}
                  <div className="w-full md:w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    {mainImages[p.id] ? (
                      <img
                        src={mainImages[p.id]}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "Zdj"
                    )}
                  </div>

                  {/* Szczegóły */}
                  <div className="flex flex-col justify-between p-4 w-full">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {p.title}
                    </h2>
                    <p className="text-gray-600 mb-1 line-clamp-2">
                      {p.description}
                    </p>
                    <p className="text-sm text-gray-500">📍 {p.address}</p>
                    <div className="flex justify-between mt-2 text-sm text-gray-700">
                      <span>🛏️ {p.roomCount} pokoi</span>
                      <span>💰 {p.basePrice} zł/mc</span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
      </div>
    </div>
  );
};

export default PropertyDetailPage;
