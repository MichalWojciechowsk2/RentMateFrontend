import { useEffect, useState } from "react";
import { GetPropertyById } from "../../../api/property";
import {
  createOffer as CreateOfferApi,
  getValidOffersByPropertyId,
  downloadOfferContractPdf,
} from "../../../api/offer";
import type { Property } from "../../../types/Property";
import {
  type Offer,
  type CreateOffer,
  OfferStatus,
} from "../../../types/Offer";
import CreateOfferFormComponent from "../Offer/CreateOfferFormComponent";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";

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

  const fetchOffers = async () => {
    if (!property) return;
    try {
      const of = await getValidOffersByPropertyId(propertyId);
      setOffers(of);
    } catch (err) {
      console.error("Błąd pobierania ofert: ", err);
    }
  };
  const handleCreateOffer = async (data: Omit<CreateOffer, "id">) => {
    try {
      await CreateOfferApi(data);
      setIsCreatingOffer(false);
      await fetchOffers();
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
          <div className="gap-4 mb-6">
            {property &&
              Array.from({ length: property.roomCount }).map((_, index) => {
                const offer = offers[index];

                if (!offer) {
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-lg text-center font-medium bg-gray-300 text-gray-700 mb-2"
                    >
                      Wolne miejsce
                    </div>
                  );
                }

                if (
                  offer.status === OfferStatus.Accepted ||
                  offer.status === OfferStatus.Active
                ) {
                  return (
                    <Accordion.Root
                      key={index}
                      type="single"
                      collapsible
                      className="mb-2"
                    >
                      <Accordion.Item
                        value={`item-${index}`}
                        className="border rounded overflow-hidden bg-[#F1F5F9] border-[#F1F5F9]"
                      >
                        <Accordion.Header>
                          <Accordion.Trigger className="group w-full text-left px-4 py-3 bg-[#1b2947] text-white flex justify-between items-center">
                            <div>
                              <div className="font-medium text-lg">
                                {offer.status === OfferStatus.Accepted
                                  ? "Umowa - "
                                  : offer.status === OfferStatus.Active
                                  ? " Oczekująca na akcje najemcy "
                                  : ""}

                                {`${offer.tenant.firstName}  ${offer.tenant.lastName}`}
                              </div>
                              <div className="text-sm">
                                {offer.status === OfferStatus.Accepted && (
                                  <>
                                    Zaakceptowana:{" "}
                                    {offer.acceptedAt &&
                                      new Date(
                                        offer.acceptedAt
                                      ).toLocaleDateString("pl-PL", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </>
                                )}
                                {offer.status === OfferStatus.Active && (
                                  <>
                                    Oferta utworzona:{" "}
                                    {offer.createdAt &&
                                      new Date(
                                        offer.createdAt
                                      ).toLocaleDateString("pl-PL", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </>
                                )}
                              </div>
                              <div className="text-sm">
                                Okres wynajmu:{" "}
                                {offer.rentalPeriodStart &&
                                  new Date(
                                    offer.rentalPeriodStart
                                  ).toLocaleDateString("pl-PL")}{" "}
                                –{" "}
                                {offer.rentalPeriodEnd &&
                                  new Date(
                                    offer.rentalPeriodEnd
                                  ).toLocaleDateString("pl-PL")}
                              </div>
                            </div>

                            <ChevronDownIcon className="w-6 h-6 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="px-4 py-3">
                          <div className="flex justify-end mb-2">
                            <button
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              onClick={() => handleDownloadPdf(offer.id)}
                            >
                              Pobierz PDF
                            </button>
                          </div>

                          <div
                            className="text-gray-700 prose p-5"
                            dangerouslySetInnerHTML={{
                              __html: offer.offerContract,
                            }}
                          />
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion.Root>
                  );
                }

                return null;
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
