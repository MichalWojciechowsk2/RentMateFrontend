import { useEffect, useState } from "react";
import { OfferStatus, type Offer } from "../../types/Offer";
import {
  getOffersByUserId,
  updateOfferStatus,
  downloadOfferContractPdf,
} from "../../api/offer";
import { type Property, type PropertyImage } from "../../types/Property";
import { GetPropertyById, getMainImageByPropertyId } from "../../api/property";
import { Link } from "react-router-dom";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";

type MyOfferComponentProps = {
  currentUserId?: number;
};
const MyOfferComponent = ({ currentUserId }: MyOfferComponentProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [mainImage, setMainImage] = useState<PropertyImage | null>(null);

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
      setLoading(true);
      let data;
      let image;
      data = await GetPropertyById(id);
      image = await getMainImageByPropertyId(id);
      setProperty(data);
      setMainImage(image);
    } catch (err) {
      console.error("Błąd wczytywania oferty", err);
    } finally {
      setLoading(false);
    }
  };

  const AcceptOffer = (offerId: number) =>
    changeOfferStatus(offerId, OfferStatus.Accepted);
  const DeclineOffer = (offerId: number) =>
    changeOfferStatus(offerId, OfferStatus.Cancelled);

  const handleDownloadPdf = async (offerId: number) => {
    try {
      const pdfBlob = await downloadOfferContractPdf(offerId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Umowa_${offerId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Błąd pobierania PDF:", error);
    }
  };

  useEffect(() => {
    if (acceptedOffer) {
      fetchPropertyIfOfferAccepted(acceptedOffer.propertyId).catch((err) => {
        console.error("Błąd ładowania oferty", err);
      });
      setProperty(property);
    }
  }, [acceptedOffer]);

  if (!offers || offers.length === 0) return <div>Brak ofert</div>;
  if (loading) return <p className="p-6">Ładowanie...</p>;

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
                <p>Identyfikator oferty: {offer.id}</p>
                <p>Identyfikator mieszkania mieszkania: {offer.propertyId}</p>
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
                  {mainImage ? (
                    <img
                      src={mainImage.imageUrl}
                      alt={property?.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "Zdj"
                  )}
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
          <div className="mt-6 p-4 border rounded font-semibold bg-grey-100">
            <Accordion.Root
              key={acceptedOffer.id}
              type="single"
              collapsible
              className="mb-2"
            >
              <Accordion.Item
                value={`item-${acceptedOffer.id}`}
                className="border rounded overflow-hidden bg-[#F1F5F9] border-[#F1F5F9]"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group w-full text-left px-4 py-3 bg-[#1b2947] text-white flex justify-between items-center">
                    <div>
                      <p>Identyfikator oferty: {acceptedOffer.id}</p>
                      <p>
                        Identyfikator mieszkania: {acceptedOffer.propertyId}
                      </p>
                      <p>Kwota najmu: {acceptedOffer.rentAmount} PLN</p>
                    </div>

                    <ChevronDownIcon className="w-6 h-6 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Content className="px-4 py-3">
                  <div className="flex justify-end mb-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => handleDownloadPdf(acceptedOffer.id)}
                    >
                      Pobierz PDF
                    </button>
                  </div>
                  <div
                    className="text-gray-700 prose p-5"
                    dangerouslySetInnerHTML={{
                      __html: acceptedOffer.offerContract,
                    }}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOfferComponent;
