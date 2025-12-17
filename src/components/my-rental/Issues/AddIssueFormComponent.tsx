import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { getAcceptedUserOffer } from "../../../api/offer";

interface IssueDto {
  propertyId: number;
  title: string;
  description: string;
  urgency: number;
}

interface AddIssueFormProps {
  userId?: number;
  onSuccess?: () => void;
}

const AddIssueFormComponent: React.FC<AddIssueFormProps> = ({
  userId,
  onSuccess,
}) => {
  const [title, setTitle] = useState<string>("Przeciekający kran");
  const [description, setDescription] = useState<string>("");
  const [urgency, setUrgency] = useState<number>(1);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [propertyId, setPropertyId] = useState<number | null>(null);

  const issueTypes = [
    "Przeciekający kran",
    "Wilgoć",
    "Uszkodzona instalacja elektryczna",
    "Zepsuta pralka/zmywarka",
    "Problem z ogrzewaniem",
    "Zatkany odpływ",
    "Uszkodzone drzwi/okna",
    "Problem z wentylacją",
    "Inne",
  ];

  const fetchOffer = async () => {
    if (!userId) return;
    const offer = await getAcceptedUserOffer(userId);
    if (offer?.id) {
      setPropertyId(offer.propertyId);
    }
  };
  useEffect(() => {
    fetchOffer();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    const issueDto: IssueDto = {
      propertyId: propertyId!,
      title: title,
      description: description,
      urgency: urgency,
    };

    try {
      await axiosInstance.post("/Issue", issueDto);

      setMessage("Zgłoszenie zostało wysłane pomyślnie!");
      setDescription("");
      setIsError(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      setIsError(true);
      setMessage(error.response?.data?.message || "Błąd wysyłania zgłoszenia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {!propertyId && (
        <p className="text-gray-700 text-2xl p-4 font-semibold">
          Brak dostępnych ofert.
        </p>
      )}

      {propertyId && (
        <div
          style={{
            padding: "20px",
            maxWidth: "100%",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Zgłoś nową usterkę
          </h3>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
              >
                Typ problemu
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-select text-black"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "black",
                  backgroundColor: "white",
                }}
              >
                {issueTypes.map((type) => (
                  <option key={type} value={type} style={{ color: "black" }}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
              >
                Opis problemu
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Opisz dokładnie co się dzieje..."
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  resize: "vertical",
                  color: "black",
                  backgroundColor: "white",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
              >
                Priorytet
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(Number(e.target.value))}
                className="form-select text-black"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "black",
                  backgroundColor: "white",
                }}
              >
                <option value={0} style={{ color: "black" }}>
                  Niski
                </option>
                <option value={1} style={{ color: "black" }}>
                  Średni
                </option>
                <option value={2} style={{ color: "black" }}>
                  Wysoki
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "12px",
                marginTop: "10px",
                background: "#0ea5e9",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {isSubmitting ? "Wysyłanie..." : "Wyślij problem"}
            </button>

            {message && (
              <div
                style={{
                  padding: "10px",
                  marginTop: "10px",
                  borderRadius: "4px",
                  background: isError ? "#ffebee" : "#e8f5e9",
                  color: isError ? "#c62828" : "#2e7d32",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default AddIssueFormComponent;
