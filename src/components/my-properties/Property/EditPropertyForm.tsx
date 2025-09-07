import { useState, useEffect } from "react";
import type {
  CreateProperty,
  PropertyEntity,
  PropertyImage,
} from "../../../types/Property";
import PropertyDetailPage from "../../../pages/PropertyDetailPage";

type Props = {
  property: CreateProperty;
  mainImg: PropertyImage | null;
  otherImg: PropertyImage[];
  onSave: (updated: CreateProperty) => void;
  onCancel: () => void;
};

const EditPropertyForm = ({
  property,
  mainImg,
  otherImg,
  onSave,
  onCancel,
}: Props) => {
  const [form, setForm] = useState<CreateProperty>(property);

  useEffect(() => {
    setForm(property);
  }, [property]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      // city: property.city,
      // district: property.district,
      // postalCode: property.postalCode,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 mx-auto bg-[#F1F5F9] min-h-[1000px] shadow-lg rounded-xl max-w-7xl mt-22"
    >
      <div className="space-y-10 mb-20">
        <div className="w-full">
          {/* Główne zdjęcie */}
          {mainImg ? (
            <img
              src={mainImg.imageUrl}
              alt="Główne zdjęcie"
              className="w-full aspect-video object-cover rounded-lg shadow"
            />
          ) : (
            <div className="bg-gray-300 w-full aspect-video flex items-center justify-center rounded-lg">
              <p className="text-gray-600 text-xl font-medium">Brak zdjęcia</p>
            </div>
          )}

          {/* Pozostałe zdjęcia */}
          {otherImg.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {otherImg.map((img, index) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800">
          <div className="md:col-span-2">
            <label className="block mb-1">Tytuł:</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="bg-white border p-2 rounded w-full"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">📍Ulica i numer mieszkania:</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="bg-white border p-2 rounded w-full"
              required
            />
          </div>
          <div className="md:col-span-2">
            <p className="font-semibold mb-1">📝 Opis:</p>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="bg-white border rounded w-full p-2 h-32"
            />
          </div>

          <div>
            <p className="font-semibold mb-1">🛏️ Liczba pokoi:</p>
            <input
              type="number"
              name="roomCount"
              value={form.roomCount}
              onChange={handleChange}
              className="bg-white border p-1 rounded w-full"
            />
          </div>

          <div>
            <p className="font-semibold mb-1">📐 Powierzchnia:</p>
            <input
              type="number"
              name="area"
              value={form.area}
              onChange={handleChange}
              className="bg-white border p-1 rounded w-full"
            />
          </div>

          <div>
            <p className="font-semibold mb-1">💰 Kaucja:</p>
            <input
              type="number"
              name="baseDeposit"
              value={form.baseDeposit}
              onChange={handleChange}
              className="bg-white border p-1 rounded w-full"
            />
          </div>

          <div>
            <p className="font-semibold mb-1">💰 Cena wynajmu:</p>
            <input
              type="number"
              name="basePrice"
              value={form.basePrice}
              onChange={handleChange}
              className="bg-white border p-1 rounded w-full"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Zapisz zmiany
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditPropertyForm;
