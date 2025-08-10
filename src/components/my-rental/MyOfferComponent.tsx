import { useEffect, useState } from "react";
import { OfferStatus, type Offer } from "../../types/Offer";
import { getOffersByUserId, updateOfferStatus } from "../../api/offer";
import { type Property } from "../../types/Property";
import { GetPropertyById } from "../../api/property";
import { Link } from "react-router-dom";

type MyOfferComponentProps = {
  currentUserId?: number;
};
const MyOfferComponent = ({ currentUserId }: MyOfferComponentProps) => {
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (currentUserId) {
      getOffersByUserId(currentUserId)
        .then(setOffers)
        .catch((err) => {
          console.error("Błąd ładowania oferty", err);
        });
    }
  }, [currentUserId]);

  const activeOffers = offers?.filter(
    (offer) => offer.status === OfferStatus.Active
  );

  const acceptedOffer = offers?.find(
    (offer) => offer.status === OfferStatus.Accepted
  );

  const changeOfferStatus = async (offerId: number, newStatus: OfferStatus) => {
    try {
      const updatedOffer = await updateOfferStatus(offerId, newStatus);
      if (offers) {
        const updatedOffers = offers.map((offer) =>
          offer.id === updatedOffer.id ? updatedOffer : offer
        );
        setOffers(updatedOffers);
      }
    } catch (err) {
      console.error("Błąd aktualizacji statusu", err);
    }
  };
  const fetchPropertyIfOfferAccepted = async (id?: number) => {
    if (id === undefined) return;
    try {
      let data;
      data = await GetPropertyById(id);
      setProperty(data);
    } catch (err) {
      console.error("Błąd wczytywania oferty", err);
    }
  };

  const AcceptOffer = (offerId: number) =>
    changeOfferStatus(offerId, OfferStatus.Accepted);
  const DeclineOffer = (offerId: number) =>
    changeOfferStatus(offerId, OfferStatus.Cancelled);

  useEffect(() => {
    if (acceptedOffer) {
      fetchPropertyIfOfferAccepted(acceptedOffer.propertyId).catch((err) => {
        console.error("Błąd ładowania oferty", err);
      });
      setProperty(property);
    }
  }, [acceptedOffer]);

  if (!offers || offers.length === 0) return <div>Brak ofert</div>;

  return (
    <div>
      {activeOffers && activeOffers.length > 0 && (
        <div>
          {activeOffers.map((offer) => (
            <div
              key={offer.id}
              className="mb-4 p-4 border rounded font-semibold text-blue-600"
            >
              <div>Masz zaproszenie do mieszkania</div>
              <div>
                <p>ID oferty: {offer.id}</p>
                <p>ID mieszkania: {offer.propertyId}</p>
                <p>Kwota najmu: {offer.rentAmount} PLN</p>
              </div>
              <button
                onClick={() => AcceptOffer(offer.id)}
                className="mr-2 px-3 py-1 bg-green-500 text-white rounded"
              >
                Akceptuj
              </button>
              <button
                onClick={() => DeclineOffer(offer.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Odrzuć
              </button>
            </div>
          ))}
        </div>
      )}

      {acceptedOffer && (
        <div>
          <div>
            <Link to={`/property/${acceptedOffer.propertyId}`}>
              <div className="flex flex-col md:flex-row bg-white shadow-md rounded-2xl overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300">
                {/* Placeholder na zdjęcie */}
                <div className="w-full md:w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  Zdj
                </div>

                {/* Szczegóły */}
                <div className="flex flex-col justify-between p-4 w-full">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {property?.title}
                  </h2>
                  <p className="text-gray-600 mb-1 line-clamp-2">
                    {property?.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    📍 {property?.address}
                  </p>
                  <div className="flex justify-between mt-2 text-sm text-gray-700">
                    <span>🛏️ {property?.roomCount} pokoi</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-6 p-4 border rounded font-semibold text-green-700 bg-green-100">
            <div>Twoja zaakceptowana oferta:</div>
            <div>
              <p>ID oferty: {acceptedOffer.id}</p>
              <p>ID mieszkania: {acceptedOffer.propertyId}</p>
              <p>Kwota najmu: {acceptedOffer.rentAmount} PLN</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOfferComponent;
