// Kontrolowanie rachunków, dodać w encji za co jest to rachunek (Kaucja, Szkody, dodatkowe opłaty).
//Właściciel do dodatkowych opłat powinien móc dodać notatkę i zdjęcie np rachunku ile wyszło za prąd, gaz etc.
//Właściciel może ustawić cykliczne generowanie i wysyłanie rachunków do najemców
//Właściciel może wybrać czy do wszystkich wysyła ten rachunek czy do pojedyńczej osoby bo np ktoś kto ma większy pokój płaci więcej etc
//Kolor zielony (wszyscy opłacili), niebieski (w trakcie opłacania), czerwony już jest po terminie na wpłatę
//Zakładka jakaś na to żeby właściciel mógł edytować te oferty które wysyłane są cyklicznie
//Filtrowanie po jednym najemcy

import React from "react";
import { useState } from "react";
import CreatePaymentFormComponent from "../Payments/CreatePaymentFormComponent";
import { createPayment } from "../../../api/payment";

type PaymentOwnerComponentsProps = {
  propertyId: number;
};

const PaymentOwnerComponent = ({ propertyId }: PaymentOwnerComponentsProps) => {
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  const handleCreatePayment = () => {
    if (!propertyId) return;
    setIsCreatingPayment(true);
  };
  return (
    <div>
      {isCreatingPayment ? (
        <CreatePaymentFormComponent
          onCancel={() => setIsCreatingPayment(false)}
          onSubmit={async (data) => {
            try {
              await createPayment(data);
              setIsCreatingPayment(false);
            } catch (err) {
              console.error("Błąd tworzenia płatności:", err);
            }
          }}
          propertyId={propertyId}
        />
      ) : (
        <button
          onClick={handleCreatePayment}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
        >
          Stwórz rachunek
        </button>
      )}
    </div>
  );
};
export default PaymentOwnerComponent;
