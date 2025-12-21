import { useState, useEffect } from "react";
import { createProperty, getCities, getDistricts } from "../api/property";
import type { City, District } from "../types/Location";
import { CITY_ID_TO_ENUM } from "../types/Location";
import { useNavigate } from "react-router-dom";
import { GrNext } from "react-icons/gr";

const AddPropertyForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    area: "",
    district: "",
    roomCount: "",
    city: "",
    postalCode: "",
    basePrice: "",
    baseDeposit: "",
    isActive: 1,
  });

  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCities().then(setCities).catch(console.error);
  }, []);

  useEffect(() => {
    if (form.city) {
      getDistricts(form.city).then(setDistricts).catch(console.error);
    } else {
      setDistricts([]);
    }
  }, [form.city]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newProperty = await createProperty({
        title: form.title.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        area: parseFloat(form.area),
        district: form.district,
        roomCount: parseInt(form.roomCount),
        city: CITY_ID_TO_ENUM[Number(form.city)],
        postalCode: form.postalCode.trim(),
        basePrice: parseFloat(form.basePrice),
        baseDeposit: parseFloat(form.baseDeposit),
      });

      navigate(`/${newProperty.id}/add-photo`);
    } catch (err) {
      console.error("Błąd przy dodawaniu mieszkania:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Dodaj nowe ogłosznie</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block mb-1">Tytuł ogłoszenia:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1">Opis:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full min-h-[100px]"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Miasto:</label>
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="" className="text-black">
              -- Wybierz miasto --
            </option>
            {cities.map((c) => (
              <option className="text-black" key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Dzielnica:</label>
          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            disabled={!form.city}
            required
          >
            <option value="" className="text-black">
              -- Wybierz dzielnicę --
            </option>
            {districts.map((d) => (
              <option key={d.name} value={d.name} className="text-black">
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Ulica i numer mieszkania:</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Kod pocztowy:</label>
          <input
            type="text"
            name="postalCode"
            pattern="\d{2}-\d{3}"
            value={form.postalCode}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Powierzchnia (m²):</label>
          <input
            type="number"
            name="area"
            value={form.area}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Liczba pokoi:</label>
          <input
            type="number"
            name="roomCount"
            value={form.roomCount}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Cena/miesiąc (zł):</label>
          <input
            type="number"
            name="basePrice"
            value={form.basePrice}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Kaucja (zł):</label>
          <input
            type="number"
            name="baseDeposit"
            value={form.baseDeposit}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Dodaj zdjęcia <GrNext className="inline ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;
