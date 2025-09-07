import { useState, useEffect } from "react";
import {
  createProperty,
  UpdateProperty,
  getCities,
  getDistricts,
  GetPropertyById,
} from "../api/property";
import type { City, District } from "../types/Location";
import { CITY_ID_TO_ENUM } from "../types/Location";
import { useNavigate, useParams } from "react-router-dom";
import { GrNext } from "react-icons/gr";

const EditPropertyCreateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (id) {
      setLoading(true);
      GetPropertyById(Number(id))
        .then((property) => {
          setForm({
            title: property.title,
            description: property.description,
            address: property.address,
            area: property.area.toString(),
            district: property.district,
            roomCount: property.roomCount.toString(),
            city: property.city.toString(),
            postalCode: property.postalCode,
            basePrice: property.basePrice.toString(),
            baseDeposit: property.baseDeposit.toString(),
            isActive: property.isActive ? 1 : 0,
          });
        })
        .catch((err) => console.error("Błąd pobierania mieszkania:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

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
      if (id) {
        await UpdateProperty(Number(id), {
          ...form,
          area: parseFloat(form.area),
          roomCount: parseInt(form.roomCount),
          city: CITY_ID_TO_ENUM[Number(form.city)],
          basePrice: parseFloat(form.basePrice),
          baseDeposit: parseFloat(form.baseDeposit),
        });
        navigate(`/${id}/add-photo`);
      } else {
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
      }
    } catch (err) {
      console.error("Błąd przy zapisie mieszkania:", err);
    }
  };

  if (loading) return <p className="p-6">Ładowanie danych...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Edytuj mieszkanie" : "Dodaj nowe mieszkanie"}
      </h2>

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
              <option key={c.id} value={c.id} className="text-black">
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
              <option key={d.id} value={d.enumName} className="text-black">
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
            {id ? "Zapisz zmiany" : "Dodaj zdjęcia"}{" "}
            <GrNext className="inline ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPropertyCreateForm;
