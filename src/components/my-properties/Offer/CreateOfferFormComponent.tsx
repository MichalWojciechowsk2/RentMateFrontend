import { useState } from "react";
import type { CreateOffer } from "../../../types/Offer";

type CreateOfferFormProps = {
  onCancel: () => void;
  onSubmit?: (data: CreateOffer) => void;
  propertyId?: number;
};

const CreateOfferFormComponent = ({
  onCancel,
  onSubmit,
  propertyId,
}: CreateOfferFormProps) => {
  const [form, setForm] = useState<Omit<CreateOffer, "id">>({
    propertyId: propertyId || 0,
    rentAmount: 0,
    depositAmount: 0,
    rentalPeriodStart: new Date(),
    rentalPeriodEnd: new Date(),
    tenantId: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "tenantId" || name.includes("Amount") ? Number(value) : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: new Date(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ ...form });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-xl shadow-md mt-6 bg-white text-gray-600">
      <h2 className="text-2xl font-bold mb-4">Nowa oferta najmu</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block mb-1">Kwota najmu (zł):</label>
          <input
            type="number"
            name="rentAmount"
            value={form.rentAmount}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Kaucja (zł):</label>
          <input
            type="number"
            name="depositAmount"
            value={form.depositAmount}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Data rozpoczęcia najmu:</label>
          <input
            type="date"
            name="rentalPeriodStart"
            value={form.rentalPeriodStart.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Data zakończenia najmu:</label>
          <input
            type="date"
            name="rentalPeriodEnd"
            value={form.rentalPeriodEnd.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1">ID najemcy (tenantId):</label>
          <input
            type="number"
            name="tenantId"
            value={form.tenantId}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Wróć
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Zapisz ofertę
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOfferFormComponent;
