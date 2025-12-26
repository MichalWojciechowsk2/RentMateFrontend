import { Link, useParams } from "react-router-dom";
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
import { createPrivateChat } from "../api/chat";
import { useNavigate } from "react-router-dom";
import type { ReviewEntity } from "../types/Review";
import {
  getLast5ReviewsForUserByUserId,
  getAvgReview,
  getLast5ReviewsForPropertyByPropertyId,
} from "../api/review";
import MoreReviewModal from "../components/review/MoreReviewComponent";
import * as Tabs from "@radix-ui/react-tabs";

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
  const [userReviews, setReviews] = useState<ReviewEntity[]>([]);
  const [propertyReviews, setPropertyReviews] = useState<ReviewEntity[]>([]);
  const [userAvgReview, setUserAvgReview] = useState<number>(0);
  const [showMoreUserReviews, setShowMoreUserReviews] =
    useState<boolean>(false);
  const [showMorePropertyReviews, setShowMorePropertyReviews] = useState(false);

  const navigate = useNavigate();

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

  const fetchUserWithReviews = async (ownerId: number) => {
    setLoading(true);
    try {
      let data = await getUserById(ownerId);
      let userReviews = await getLast5ReviewsForUserByUserId(data.id);
      let propertyReviews = await getLast5ReviewsForPropertyByPropertyId(
        Number(id)
      );
      let userAvgReview = await getAvgReview(true, ownerId);
      setReviews(userReviews);
      setPropertyReviews(propertyReviews);
      setPropertyOwner(data);
      setUserAvgReview(userAvgReview);
      fetchOwnerOtherProperties(ownerId);
      console.log("Property Reviews:", propertyReviews);
    } catch (err) {
      console.error("Błąd wczytywania właściciela", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (otherUserId: number) => {
    try {
      const newChat = await createPrivateChat(otherUserId);
      navigate(`/chats/${newChat.id}`);
    } catch (err) {
      console.error("Błąd tworzenia/zwracania chatu");
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
    if (property?.ownerId) fetchUserWithReviews(property.ownerId);
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

  const otherProperties =
    propertyOwnerOtherProperties?.filter(
      (p) => property && p.id != property.id
    ) ?? [];

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
              <div className="flex space-x-4 items-center text-black">
                <img
                  src={
                    propertyOwner?.photoUrl ||
                    "https://localhost:7281/uploads/UserPhoto/defaultPersonPhoto.png"
                  }
                  alt="Profil"
                  className="w-20 h-20 flex items-center justify-center rounded-full p-2 object-cover mb-4 shadow"
                />

                <div>
                  <div>
                    {propertyOwner?.firstName} {propertyOwner?.lastName}
                  </div>
                  <div>⭐{userAvgReview.toFixed(2)}</div>
                </div>
              </div>
            </div>
            {!ownerNumberActive ? (
              <button
                className="w-1/1 mb-2 bg-[#1d2b4b]"
                onClick={() => setOwnerNumberActive(true)}
              >
                Wyświetl numer
              </button>
            ) : (
              <button
                className="w-full mb-2 bg-[#1d2b4b]"
                onClick={() => setOwnerNumberActive(false)}
              >
                {propertyOwner?.phoneNumber}
              </button>
            )}
            <button
              className="w-full bg-[#1d2b4b]"
              onClick={() => handleSendMessage(propertyOwner?.id!)}
            >
              Wyślij wiadomość
            </button>
            <p className="text-black"></p>
          </div>
          <div>
            <div className="text-black mb-2 text-xl">Opinie</div>
            <Tabs.Root className="TabsRoot text-cent" defaultValue="user">
              <Tabs.List className="TabsList" aria-label="Manage your account">
                <Tabs.Trigger
                  className="px-4 py-2
    font-semibold
    text-gray-600
    bg-gray-300
    rounded-xl
    transition-all
    duration-200
    data-[state=active]:bg-[#1d2b4b]
    data-[state=active]:text-white
    data-[state=active]:shadow-md
    hover:bg-gray-100
    hover:text-gray-800
    w-[50%]"
                  value="user"
                >
                  {" "}
                  Użytkownik{" "}
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="px-4 py-2
    font-semibold
    text-gray-600
    bg-gray-300
    rounded-xl
    transition-all
    duration-200
    data-[state=active]:bg-[#1d2b4b]
    data-[state=active]:text-white
    data-[state=active]:shadow-md
    hover:bg-gray-100
    hover:text-gray-800
    w-[50%]"
                  value="property"
                >
                  {" "}
                  Mieszkanie{" "}
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content className="TabsContent" value="user">
                <div className="space-y-4 mt-4">
                  {userReviews.length === 0 ? (
                    <p></p>
                  ) : (
                    userReviews.slice(0, 4).map((r) => (
                      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                        {/* Górna część */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">
                            {r.author
                              ? `${r.author.firstName} ${r.author.lastName}`
                              : "Anonim"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Gwiazdki */}
                        <div className="flex items-center mb-2 text-black">
                          ⭐ {r.rating}
                        </div>

                        {/* Opinia */}
                        <p className="text-gray-700 text-sm whitespace-pre-line">
                          {r.comment}
                        </p>
                      </div>
                    ))
                  )}
                  {userReviews.length > 4 ? (
                    <div>
                      <button
                        className="w-full bg-[#1d2b4b] text-sm"
                        onClick={() => setShowMoreUserReviews(true)}
                      >
                        Zobacz więcej opinii o użytkowniku
                      </button>
                      <MoreReviewModal
                        isOpen={showMoreUserReviews}
                        onClose={() => setShowMoreUserReviews(false)}
                        isUserReviews={true}
                        objectId={propertyOwner?.id!}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </Tabs.Content>
              <Tabs.Content className="TabsContent" value="property">
                <div className="space-y-4 mt-4">
                  {propertyReviews.length === 0 ? (
                    <p></p>
                  ) : (
                    propertyReviews.slice(0, 4).map((r) => (
                      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                        {/* Górna część */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">
                            {r.author
                              ? `${r.author.firstName} ${r.author.lastName}`
                              : "Anonim"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Gwiazdki */}
                        <div className="flex items-center mb-2 text-black">
                          ⭐ {r.rating}
                        </div>

                        {/* Opinia */}
                        <p className="text-gray-700 text-sm whitespace-pre-line">
                          {r.comment}
                        </p>
                      </div>
                    ))
                  )}
                  {propertyReviews.length > 4 ? (
                    <div>
                      <button
                        className="w-full bg-[#1d2b4b] text-sm"
                        onClick={() => setShowMorePropertyReviews(true)}
                      >
                        Zobacz więcej opinii o mieszkaniu
                      </button>
                      <MoreReviewModal
                        isOpen={showMorePropertyReviews}
                        onClose={() => setShowMorePropertyReviews(false)}
                        isUserReviews={false}
                        objectId={Number(id)}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </div>

      {otherProperties?.length > 0 && (
        <>
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
        </>
      )}
    </div>
  );
};

export default PropertyDetailPage;
