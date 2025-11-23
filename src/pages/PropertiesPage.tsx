import { useEffect, useState } from "react";
import {
  getCities,
  getDistricts,
  getMainImageByPropertyId,
  getAllPagedActiveProperties,
} from "../api/property";
import type { Property } from "../types/Property";
import type { Filters } from "../types/Property";
import type { City, District } from "../types/Location";
import { Link } from "react-router-dom";

export interface PagedResult<T> {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  items: T[];
}

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [mainImages, setMainImages] = useState<Record<number, string>>({});
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 2;

  useEffect(() => {
    getCities()
      .then(setCities)
      .catch((err) => console.error("Błąd pobierania miast:", err));
  }, []);

  useEffect(() => {
    if (filters.City) {
      getDistricts(filters.City)
        .then(setDistricts)
        .catch((err) => console.error("Błąd pobierania dzielnic:", err));
    } else {
      setDistricts([]);
    }
  }, [filters.City]);
  const fetchProperties = async (filters?: Filters, page = 1) => {
    setLoading(true);

    try {
      const data = await getAllPagedActiveProperties(page, pageSize, filters);

      setProperties(data.items);
      setPageNumber(data.pageNumber);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Błąd ładowania nieruchomości: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties({}, 1);
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]:
        value === ""
          ? undefined
          : ["PriceFrom", "PriceTo", "Rooms"].includes(name)
          ? Number(value)
          : value,
    }));
    console.log(value);
  };
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filtersToSend = {
      City: filters.City,
      District: filters.District,
      PriceFrom: filters.PriceFrom,
      PriceTo: filters.PriceTo,
      Rooms: filters.Rooms,
    };

    fetchProperties(filtersToSend);
  };
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
    if (properties.length > 0) {
      fetchMainImages(properties);
    }
  }, [properties]);

  const handleReset = () => {
    setFilters({});
    setDistricts([]);
    fetchProperties();
  };

  if (loading) return <p className="p-6">Ładowanie ofert...</p>;

  return (
    <div className="p-6">
      <form
        onSubmit={handleFilterSubmit}
        className="mb-15 flex flex-wrap gap-4 items-end"
      >
        <div>
          <label className="block mb-1">Miasto:</label>
          <select
            name="City"
            value={filters.City ?? ""}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1 w-75"
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
          <label className="block mb-1 ">Osiedle:</label>
          <select
            name="District"
            value={filters.District ?? ""}
            onChange={handleFilterChange}
            disabled={!filters.City}
            className="border rounded px-2 py-1 w-75"
          >
            <option value="" className="text-black">
              -- Wybierz osiedle --
            </option>
            {districts.map((d) => (
              <option key={d.name} value={d.name} className="text-black">
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Min. cena (zł):</label>
          <input
            type="number"
            name="PriceFrom"
            value={filters.PriceFrom || ""}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Max. cena (zł):</label>
          <input
            type="number"
            name="PriceTo"
            value={filters.PriceTo || ""}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Liczba pokoi:</label>
          <input
            type="number"
            name="Rooms"
            value={filters.Rooms || ""}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Filtruj
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Resetuj
          </button>
        </div>
      </form>

      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            <Link to={`/property/${property.id}`}>
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
      {/* Paginacja */}
      <div className="flex justify-center gap-2 mt-4">
        {/* Pierwsza strona */}
        {pageNumber > 2 && (
          <button
            onClick={() => fetchProperties(filters, 1)}
            className="px-3 py-1 rounded bg-gray-400 hover:bg-gray-300"
          >
            1
          </button>
        )}

        {pageNumber > 3 && <span className="px-2 py-1">…</span>}

        {/* Poprzednia strona */}
        {pageNumber > 1 && (
          <button
            onClick={() => fetchProperties(filters, pageNumber - 1)}
            className="px-3 py-1 rounded bg-gray-400 hover:bg-gray-300"
          >
            {pageNumber - 1}
          </button>
        )}

        {/* Aktualna strona */}
        <button className="px-3 py-1 rounded bg-blue-600 text-white">
          {pageNumber}
        </button>

        {/* Następna strona */}
        {pageNumber < totalPages && (
          <button
            onClick={() => fetchProperties(filters, pageNumber + 1)}
            className="px-3 py-1 rounded bg-gray-400 hover:bg-gray-300"
          >
            {pageNumber + 1}
          </button>
        )}

        {pageNumber < totalPages - 2 && <span className="px-2 py-1">…</span>}

        {/* Ostatnia strona */}
        {pageNumber < totalPages - 1 && (
          <button
            onClick={() => fetchProperties(filters, totalPages)}
            className="px-3 py-1 rounded bg-gray-400 hover:bg-gray-300"
          >
            {totalPages}
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
