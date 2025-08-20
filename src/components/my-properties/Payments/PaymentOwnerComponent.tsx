// Kontrolowanie rachunków, dodać w encji za co jest to rachunek (Kaucja, Szkody, dodatkowe opłaty).
//Właściciel do dodatkowych opłat powinien móc dodać notatkę i zdjęcie np rachunku ile wyszło za prąd, gaz etc.
//Właściciel może ustawić cykliczne generowanie i wysyłanie rachunków do najemców
//Właściciel może wybrać czy do wszystkich wysyła ten rachunek czy do pojedyńczej osoby bo np ktoś kto ma większy pokój płaci więcej etc
//Kolor zielony (wszyscy opłacili), niebieski (w trakcie opłacania), czerwony już jest po terminie na wpłatę
//Zakładka jakaś na to żeby właściciel mógł edytować te oferty które wysyłane są cyklicznie
//Filtrowanie po jednym najemcy
//Dodać max 10 ostatnich rachunków a pod spodem rozwijana lista cyklicznych rachunków żeby właściciel mógł edytować, zatrzymać ten rachunek itd

import React from "react";
import { useState, useEffect } from "react";
import CreatePaymentFormComponent from "../Payments/CreatePaymentFormComponent";
import {
  createPayment,
  getAllPaymentsForPropertyByActiveUserOffers,
  getAllRecurringPaymentsByPropertyId,
  deleteRecurringPaymentById,
  deactivePaymentByPamentId,
} from "../../../api/payment";
import {
  type RecurringPaymentDto,
  type PaymentWithTenantName,
} from "../../../types/Payment";
import { TiDeleteOutline } from "react-icons/ti";

type PaymentOwnerComponentsProps = {
  propertyId: number;
};

const PaymentOwnerComponent = ({ propertyId }: PaymentOwnerComponentsProps) => {
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [payments, setPayments] = useState<PaymentWithTenantName[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<
    RecurringPaymentDto[]
  >([]);

  const handleCreatePayment = () => {
    if (!propertyId) return;
    setIsCreatingPayment(true);
  };
  const handleDeleteRecurringPayment = async (id: number) => {
    try {
      const success = await deleteRecurringPaymentById(id);
      if (success) {
        if (success) {
          setRecurringPayments((prev) => prev.filter((rp) => rp.id !== id));
        }
      } else {
        alert("Nie udało się usunąć recurring payment");
      }
    } catch (error) {
      console.error("Błąd przy usuwaniu recurring payment", error);
    }
  };

  const fetchPayments = async () => {
    try {
      let data = await getAllPaymentsForPropertyByActiveUserOffers(propertyId);
      let recurringPaymentsData = await getAllRecurringPaymentsByPropertyId(
        propertyId
      );
      setPayments(data);
      setRecurringPayments(recurringPaymentsData);
    } catch (err) {
      console.error("Błąd przy ładowaniu rachunków ", err);
    }
  };

  const deactivePaymentByPamentId = async (paymentId: number) => {
    try {
      await deactivePaymentByPamentId(paymentId);
      await fetchPayments();
    } catch (err) {
      console.error("Błąd podczas dezaktywowania rachunku");
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
                    <td>
                      <button
                        onClick={() => deactivePaymentByPamentId(payment.id)}
                        className="transition-colors m-2 bg-transparent border-none p-0"
                      >
                        <TiDeleteOutline
                          size={28}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button
            onClick={handleCreatePayment}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4 mb-2"
          >
            Stwórz rachunek
          </button>
          <div className="mt-6 text-gray-600">
            <h3 className="text-lg font-semibold mb-2">Rachunki cykliczne</h3>
            <div className="space-y-3">
              {recurringPayments.map((rp) => (
                <div
                  key={rp.id}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Rachunek ID:</span> {rp.id}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Pozostałe cykle:</span>{" "}
                      {rp.recurrenceTimes}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRecurringPayment(rp.id)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Usuń
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PaymentOwnerComponent;
