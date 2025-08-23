import { useState, useEffect } from "react";
import { createProperty, getCities, getDistricts } from "../api/property";
import type { City, District } from "../types/Location";
import { CITY_ID_TO_ENUM } from "../types/Location";
import { useNavigate } from "react-router-dom";
import { GrNext } from "react-icons/gr";

const AddPhotos = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {}, []);

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

      navigate(`/properties`);
    } catch (err) {
      console.error("Błąd przy dodawaniu mieszkania:", err);
    }
  };

  return (
    <div className="md:col-span-2">
      <label className="block mb-1 font-medium">Zdjęcia mieszkania</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) {
            setForm((prev) => ({
              ...prev,
              images: Array.from(e.target.files), // zakładam, że w form masz pole images: File[]
            }));
          }
        }}
        className="w-full border p-2 rounded"
      />
    </div>
  );
};

export default AddPhotos;
