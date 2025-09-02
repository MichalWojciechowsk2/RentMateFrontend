import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Property } from "../types/Property";
import { GetPropertiesByOwnerId } from "../api/property";
import { getMainImageByPropertyId } from "../api/property";
import { Link } from "react-router-dom";

const MyPropertiesPage = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [mainImages, setMainImages] = useState<Record<number, string>>({});

  const fetchMainImages = async (properties: Property[]) => {
    const images: Record<number, string> = {};
    await Promise.all(
      properties.map(async (prop) => {
        try {
          const image = await getMainImageByPropertyId(prop.id);
          if (image) images[prop.id] = image.imageUrl;
        } catch (err) {
          console.error(
            `Błąd pobierania zdjęcia dla propertyId=${prop.id}:`,
            err
          );
        }
      })
    );

    setMainImages(images);
  };

  useEffect(() => {
    if (currentUser?.id) {
      GetPropertiesByOwnerId(currentUser.id)
        .then(setProperties)
        .catch((err) => {
          console.error("Błąd pobierania nieruchomości: ", err);
        });
    }
  }, [currentUser]);
  useEffect(() => {
    if (properties.length > 0) {
      fetchMainImages(properties);
    }
  }, [properties]);

  return (
    <ul>
      {properties.map((property) => (
        <li key={property.id}>
          <Link to={`/my-properties/${property.id}/menage`}>
            <div className="flex flex-col md:flex-row bg-white shadow-md rounded-2xl overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300">
              {/* Placeholder na zdjęcie */}
              <div className="w-full md:w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                {mainImages[property.id] ? (
                  <img
                    src={mainImages[property.id]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Zdj"
                )}
              </div>

              {/* Szczegóły */}
              <div className="flex flex-col justify-between p-4 w-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {property.title}
                </h2>
                <p className="text-gray-600 mb-1 line-clamp-2">
                  {property.description}
                </p>
                <p className="text-sm text-gray-500">📍 {property.address}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-700">
                  <span>🛏️ {property.roomCount} pokoi</span>
                  <span>💰 {property.basePrice} zł/mc</span>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MyPropertiesPage;
