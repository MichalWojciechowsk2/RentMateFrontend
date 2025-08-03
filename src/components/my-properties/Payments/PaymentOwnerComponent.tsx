// Kontrolowanie rachunków, dodać w encji za co jest to rachunek (Kaucja, Szkody, dodatkowe opłaty).
//Właściciel do dodatkowych opłat powinien móc dodać notatkę i zdjęcie np rachunku ile wyszło za prąd, gaz etc.
//Właściciel może ustawić cykliczne generowanie i wysyłanie rachunków do najemców
//Właściciel może wybrać czy do wszystkich wysyła ten rachunek czy do pojedyńczej osoby bo np ktoś kto ma większy pokój płaci więcej etc
//Kolor zielony (wszyscy opłacili), niebieski (w trakcie opłacania), czerwony już jest po terminie na wpłatę
//Zakładka jakaś na to żeby właściciel mógł edytować te oferty które wysyłane są cyklicznie
//Filtrowanie po jednym najemcy

import React from "react";
import { useState, useEffect } from "react";
import CreatePaymentFormComponent from "../Payments/CreatePaymentFormComponent";
import {
  createPayment,
  getAllPaymentsForPropertyByActiveUserOffers,
} from "../../../api/payment";
import type { PaymentWithTenantName } from "../../../types/Payment";

type PaymentOwnerComponentsProps = {
  propertyId: number;
};

const PaymentOwnerComponent = ({ propertyId }: PaymentOwnerComponentsProps) => {
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [payments, setPayments] = useState<PaymentWithTenantName[]>([]);

  const handleCreatePayment = () => {
    if (!propertyId) return;
    setIsCreatingPayment(true);
  };
  const fetchPayments = async () => {
    try {
      let data = await getAllPaymentsForPropertyByActiveUserOffers(propertyId);
      setPayments(data);
    } catch (err) {
      console.error("Błąd przy ładowaniu rachunków ", err);
    }
  };
  useEffect(() => {
    if (propertyId) {
      fetchPayments();
    }
  }, [propertyId]);

  return (
    <div>
      {isCreatingPayment ? (
        <CreatePaymentFormComponent
          onCancel={() => setIsCreatingPayment(false)}
          onSubmit={async (data) => {
            try {
              await createPayment(data);
              await fetchPayments();
              setIsCreatingPayment(false);
            } catch (err) {
              console.error("Błąd tworzenia płatności:", err);
            }
          }}
          propertyId={propertyId}
        />
      ) : (
        <div>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th className="px-4 py-2">Najemca</th>
                <th className="px-4 py-2">Kwota</th>
                <th className="px-4 py-2">Opis</th>
                <th className="px-4 py-2">Termin płatności</th>
              </tr>
            </thead>
            <tbody>
              {[...payments]
                .sort(
                  (a, b) =>
                    new Date(b.dueDate).getTime() -
                    new Date(a.dueDate).getTime()
                )
                .map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 text-sm text-gray-800 w-[25%]">
                      {payment.tenantName} {payment.tenantSurname}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800 w-[25%]">
                      {payment.amount.toFixed(2)} zł
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800 w-[50%]">
                      {payment.description}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800 w-[25%]">
                      {new Date(payment.dueDate).toLocaleDateString("pl-PL")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button
            onClick={handleCreatePayment}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
          >
            Stwórz rachunek
          </button>
        </div>
      )}
    </div>
  );
};
export default PaymentOwnerComponent;
