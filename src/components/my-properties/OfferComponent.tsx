import { useEffect, useState } from "react";
import { GetPropertyById } from "../../api/property";
import {
  createOffer as CreateOfferApi,
  getValidOffersByPropertyId,
} from "../../api/offer";
import type { Property } from "../../types/Property";
import type { Offer, CreateOffer } from "../../types/Offer";
import CreateOfferFormComponent from "../my-properties/CreateOfferFormComponent";

type OfferComponentProps = {
  propertyId: number;
};

const OfferComponent = ({ propertyId }: OfferComponentProps) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [property, setProperty] = useState<Property | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prop = await GetPropertyById(propertyId);
        const of = await getValidOffersByPropertyId(propertyId);
        setProperty(prop);
        setOffers(of);
      } catch (err) {
        console.error("Błąd pobierania informacji o mieszkaniu: ", err);
      }
    };
    fetchData();
  }, [propertyId]);

  const handleGenerate = () => {
    if (!property) return;
    if (offers.length >= property.roomCount) {
      setErrorMessage(
        "Mieszkanie jest pełne, nie możesz wygenerować kolejnej umowy."
      );
    } else {
      setErrorMessage(null);
      setIsCreatingOffer(true);
    }
  };
  const handleCreateOffer = async (data: Omit<CreateOffer, "id">) => {
    try {
      await CreateOfferApi(data);
      setIsCreatingOffer(false);
    } catch (err) {
      console.error("Błąd tworzenia oferty", err);
      setErrorMessage("Nie udało się utworzyć oferty.");
    }
  };

  return (
    <div className="p-8 mx-auto bg-[#F1F5F9] min-h-[1000px] shadow-lg rounded-xl">
      {isCreatingOffer ? (
        <CreateOfferFormComponent
          onCancel={() => setIsCreatingOffer(false)}
          onSubmit={handleCreateOffer}
          propertyId={propertyId}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {property &&
              Array.from({ length: property.roomCount }).map((_, index) => {
                const offer = offers[index];
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center font-medium ${
                      offer
                        ? "bg-green-300 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {offer
                      ? `Zajęte (ID: ${offer.tenantId ?? "brak"})`
                      : "Wolne miejsce"}
                  </div>
                );
              })}
          </div>
          {errorMessage && (
            <div className="text-red-600 font-semibold mb-4">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Wygeneruj i wyślij umowę
          </button>
        </>
      )}
    </div>
  );
};

export default OfferComponent;
