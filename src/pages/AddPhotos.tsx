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

      const orderedFiles = filesToUpload[0]
        ? [filesToUpload[0], ...filesToUpload.slice(1)]
        : filesToUpload;

      await uploadPropertyImages(Number(propertyId), orderedFiles);
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
      <div className="md:col-span-3 border rounded p-2 flex flex-col items-center justify-center">
        <label
          htmlFor="file-input-0"
          className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded mb-2 cursor-pointer"
        >
          {images[0] ? (
            <img
              src={URL.createObjectURL(images[0])}
              alt="Podgląd głównego zdjęcia"
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <span className="text-sm text-gray-500">Dodaj główne zdjęcie</span>
          )}
        </label>
        <input
          id="file-input-0"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(0, e.target.files?.[0] || null)}
        />
      </div>

      {images.slice(1).map((img, index) => (
        <div
          key={index + 1}
          className="border rounded p-2 flex flex-col items-center justify-center"
        >
          <label
            htmlFor={`file-input-${index + 1}`}
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
            id={`file-input-${index + 1}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleFileChange(index + 1, e.target.files?.[0] || null)
            }
          />
        </div>
      ))}

      <div className="md:col-span-3 flex justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
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
