import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  UpdateIsActive,
  GetPropertyEntityById,
  UpdateProperty,
} from "../../api/property";
import type {
  PropertyEntity,
  CreateProperty,
  Property,
} from "../../types/Property";
import EditPropertyForm from "../Property/EditPropertyForm";

type Props = {
  onRefetch: () => void;
};

const PropertyComponent = ({ onRefetch }: Props) => {
  const [laoding, setLoading] = useState(Boolean);
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyEntity | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProperty = async (id?: number) => {
    if (id === undefined) return;
    setLoading(true);
    try {
      let data;
      data = await GetPropertyEntityById(id);
      setProperty(data);
    } catch (err) {
      console.error("Błąd wczytywania oferty", err);
    } finally {
      setLoading(false);
    }
  };

  const changeIsActive = async (propertyId: number, isActive: boolean) => {
    try {
      await UpdateIsActive(propertyId, isActive);
      await fetchProperty(propertyId);
    } catch (err) {
      console.error("Błąd aktualizacji aktywności mieszkania", err);
    }
  };
  const publishProperty = async () => {
    if (id) await changeIsActive(Number(id), true);
  };
  const unpublishProperty = async () => {
    if (id) await changeIsActive(Number(id), false);
  };

  const handleSave = async (updatedProperty: CreateProperty) => {
    if (!property) return;
    try {
      setLoading(true);
      await UpdateProperty(property.id, updatedProperty);
      const refreshed = await GetPropertyEntityById(property.id);
      setProperty(refreshed);
      await onRefetch();
      setIsEditing(false);
    } catch (err) {
      console.error("Błąd zapisu zmian mieszkania", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (id) fetchProperty(Number(id));
  }, [id]);

  if (laoding) return <p className="p-6">Ładowanie danych oferty...</p>;

  if (isEditing && property) {
    return (
      <EditPropertyForm
        property={property}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="p-8 mx-auto bg-[#F1F5F9] min-h-[1000px] shadow-lg rounded-xl">
      {property?.isActive ? (
        <div className="flex text-gray-900 justify-between items-center p-3 mb-6 border border-blue-300 rounded-xl bg-blue-100 shadow-sm">
          <span className="font-medium">
            Twoje ogłoszenie jest opublikowane
          </span>
          <button
            onClick={unpublishProperty}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg transition"
          >
            Ukryj ogłoszenie
          </button>
        </div>
      ) : (
        <div className="flex text-gray-900 justify-between items-center p-3 mb-6 border border-orange-300 rounded-xl bg-orange-100 shadow-sm">
          <span className="font-medium">
            Twoje ogłoszenie nie jest opublikowane
          </span>
          <button
            onClick={publishProperty}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg transition"
          >
            Opublikuj
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto gap-12 animate-fade-in mb-30">
        <div className="lg:col-span-2 space-y-10 mb-20">
          <div className="bg-gray-300 w-[75%] aspect-video flex items-center justify-center rounded-lg mx-auto">
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
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg transition h-12"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edytuj ogłoszenie
          </button>
          {property?.UpdatedAt && (
            <div className="text-gray-700 mb-2">
              Ostatnio modyfikowane:{" "}
              {new Date(property.UpdatedAt).toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyComponent;
