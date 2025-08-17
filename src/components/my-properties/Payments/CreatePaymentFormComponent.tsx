import React, { useEffect, useState } from "react";
import type { CreatePayment } from "../../../types/Payment";
import { OfferStatus, type Offer } from "../../../types/Offer";
import { getValidOffersByPropertyId } from "../../../api/offer";

type CreatePaymentFormComponentProps = {
  onCancel: () => void;
  onSubmit: (data: CreatePayment) => void;
  propertyId: number;
};

const CreatePaymentFormComponent = ({
  onCancel,
  onSubmit,
  propertyId,
}: CreatePaymentFormComponentProps) => {
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [form, setForm] = useState<Omit<CreatePayment, "id">>({
    propertyId: propertyId,
    offerId: 0,
    amount: 0,
    description: "",
    dueDate: "",
    paymentMethod: "",
    generateWithRecurring: false,
    recurrenceTimes: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const of = await getValidOffersByPropertyId(propertyId);
        setOffers(of);
      } catch (err) {
        console.error("Błąd pobierania ofert mieszkania: ", err);
      }
    };
    fetchData();
  }, [propertyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      propertyId: propertyId,
      offerId: form.offerId,
      amount: form.amount,
      description: form.description,
      dueDate: new Date(form.dueDate).toISOString(),
      paymentMethod: form.paymentMethod,
      generateWithRecurring: form.generateWithRecurring,
      recurrenceTimes: form.recurrenceTimes,
    });
    onCancel();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6 text-gray-600 mt-4">
        <div>
          <label htmlFor="offerId" className="block mb-1 font-medium">
            Najemca
          </label>
          <select
            id="offerId"
            className="w-full border p-2 rounded"
            value={form.offerId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                offerId: parseInt(e.target.value, 10),
              }))
            }
          >
            <option value={0}>Wybierz najemców</option>
            <option value={-1}>Wszyscy</option>
            {offers
              ?.filter((offer) => offer.status === OfferStatus.Accepted)
              .map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.tenant.firstName} {offer.tenant.lastName}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block mb-1 font-medium">
            Kwota
          </label>
          <input
            id="amount"
            type="number"
            className="w-full border p-2 rounded"
            value={form.amount}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                amount: parseFloat(e.target.value),
              }))
            }
            min={0}
            step={0.01}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Opis
          </label>
          <textarea
            id="description"
            className="w-full border p-2 rounded"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block mb-1 font-medium">
            Termin płatności
          </label>
          <input
            id="dueDate"
            type="date"
            className="w-full border p-2 rounded"
            value={form.dueDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, dueDate: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block mb-1 font-medium">
            Metoda płatności
          </label>
          <input
            id="paymentMethod"
            type="text"
            className="w-full border p-2 rounded"
            value={form.paymentMethod}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.generateWithRecurring}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  generateWithRecurring: e.target.checked,
                }))
              }
            />
            <span>Generuj cyklicznie</span>
          </label>
        </div>

        {form.generateWithRecurring && (
          <>
            <div>
              <label className="block mb-1 font-medium">Opcje powtórzeń</label>

              {form.recurrenceTimes !== -1 && (
                <input
                  id="recurrenceTimes"
                  type="number"
                  className="w-full border p-2 rounded"
                  value={form.recurrenceTimes}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      recurrenceTimes: parseInt(e.target.value, 10),
                    }))
                  }
                  min={1}
                  required
                />
              )}
              <label className="inline-flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={form.recurrenceTimes === -1}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      recurrenceTimes: e.target.checked ? -1 : 1,
                    }))
                  }
                />
                <span>Do końca trwania umowy</span>
              </label>
            </div>
          </>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Wyślij
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePaymentFormComponent;
