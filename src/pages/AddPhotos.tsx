import { useState } from "react";
import { uploadPropertyImages } from "../api/property";
import { useParams, useNavigate } from "react-router-dom";

const MAX_IMAGES = 6;

const AddPhotos = () => {
  const [images, setImages] = useState<(File | null)[]>(
    Array(MAX_IMAGES).fill(null)
  );
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const handleFileChange = (index: number, file: File | null) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!propertyId) {
      alert("Brak ID mieszkania w adresie!");
      return;
    }

    try {
      const filesToUpload = images.filter((img): img is File => img !== null);
      await uploadPropertyImages(Number(propertyId), filesToUpload);
      navigate(`/my-properties/${propertyId}/menage`);
    } catch (err) {
      console.error("Błąd przy dodawaniu zdjęć:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
    >
      {images.map((img, index) => (
        <div
          key={index}
          className="border rounded p-2 flex flex-col items-center justify-center"
        >
          <label
            htmlFor={`file-input-${index}`}
            className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400 rounded mb-2 cursor-pointer"
          >
            {img ? (
              <img
                src={URL.createObjectURL(img)}
                alt={`Podgląd ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <span className="text-sm text-gray-500">Dodaj zdjęcie</span>
            )}
          </label>
          <input
            id={`file-input-${index}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleFileChange(index, e.target.files?.[0] || null)
            }
          />
        </div>
      ))}

      <div className="md:col-span-3 flex justify-between">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Wróć
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Dodaj zdjęcia
        </button>
      </div>
    </form>
  );
};

export default AddPhotos;
