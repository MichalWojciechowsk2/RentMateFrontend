import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetPropertyById } from "../../api/property";
import { Property } from "../../types/Property";

type OfferComponentProps = {
  propertyId: number;
};

const OfferComponent = ({ propertyId }: OfferComponentProps) => {
  const [offer, setOffer] = useState<Offer>();
  const [property, setProperty] = useState<Property | null>(null);
  const [maxOfferCount, setmaxOfferCount] = useState();

  useEffect(() => {
    const fetchProperty = GetPropertyById(propertyId)
      .then(setProperty)
      .catch((err) => {
        console.error("Błąd pobierania informacji o mieszkaniu: ", err);
      });
  }, [propertyId]);

  //policzyć ile jest wolnych miejsc i jak jest np 4/4 użytkowników to jak właściciel naciśnie wygeneruj i wyślij umowę to mu pokaże
  //że mieszkanie jest pełne i że nie może nowej umowy wygenerować

  return (
    <div className="p-8 mx-auto bg-[#F1F5F9] min-h-[1000px] shadow-lg rounded-xl">
      {!offer && <div className="text-gray-700 mb-4">Brak umowy wynajmu</div>}
      <div>
        <button> Wygeneruj i wyślij umowę </button>
      </div>
    </div>
  );
};

export default OfferComponent;
