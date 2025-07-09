import React, { useEffect } from "react";
import { useState } from "react";
import { PaymentStatus, type Payment } from "../../../types/Payment";
import { getPaymentsByActiveUserOffers } from "../../../api/payment";

const PaymentTenantComponent = () => {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let data = await getPaymentsByActiveUserOffers();
      setPayments(data);
    } catch (err) {
      console.error("Błąd przy ładowaniu rachunków ", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <div>Ładowanie...</div>;
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Twoje płatności
      </h2>

      {payments.length === 0 ? (
        <p className="text-gray-500">Brak dostępnych płatności.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Kwota
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Opis
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Termin płatności
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {payment.amount.toFixed(2)} zł
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {payment.description}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {new Date(payment.dueDate).toLocaleDateString("pl-PL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentTenantComponent;
