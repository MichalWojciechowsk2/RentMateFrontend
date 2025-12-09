import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";

interface Issue {
    id: number;
    propertyId: number;
    title: string;
    description: string;
    urgency: number;
    status: number; // 0: Nowe, 1: W toku, 2: Rozwiązane
    createdAt: string;
    resolvedAt?: string; // Backend może zwracać null
}

interface PropertyIssuesComponentProps {
    propertyId: number;
}

const PropertyIssuesComponent = ({ propertyId }: PropertyIssuesComponentProps) => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    // Stan do obsługi ładowania podczas klikania przycisku (żeby nie klikać 2 razy)
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchIssues = async () => {
        try {
            const response = await axiosInstance.get(`/Issue/property/${propertyId}`);
            setIssues(response.data);
        } catch (error) {
            console.error("Błąd pobierania problemów:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (propertyId) fetchIssues();
    }, [propertyId]);


    // --- TUTAJ JEST KLUCZOWA ZMIANA ---
    const handleStatusChange = async (issue: Issue, newStatus: number) => {
        setActionLoading(issue.id);
        try {
            // Backend oczekuje: [HttpPatch("{issueId}/status")]
            // URL: /api/Issue/5/status
            // Body: sama liczba (int)
            await axiosInstance.patch(
                `/Issue/${issue.id}/status`,
                newStatus,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            // Po sukcesie odświeżamy listę, żeby zaktualizować widok
            await fetchIssues();
        } catch (error) {
            console.error("Błąd aktualizacji statusu:", error);
            alert("Nie udało się zmienić statusu. Sprawdź konsolę (F12).");
        } finally {
            setActionLoading(null);
        }
    };

    const getUrgencyLabel = (urgency: number) => {
        switch (urgency) {
            case 0: return <span className="text-green-600 font-bold">Niski</span>;
            case 1: return <span className="text-orange-500 font-bold">Średni</span>;
            case 2: return <span className="text-red-600 font-bold">Wysoki</span>;
            default: return "Nieznany";
        }
    };

    if (loading) return <div className="p-4 text-gray-500">Ładowanie zgłoszeń...</div>;

    if (issues.length === 0) {
        return (
            <div className="p-8 text-center bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-lg">Brak zgłoszonych problemów.</h3>
                <p className="text-gray-400 text-sm">Czysto i spokojnie!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {issues.map((issue) => (
                <div key={issue.id} className={`bg-white p-5 rounded-lg shadow-sm border-l-4 transition-all ${issue.status === 2 ? 'border-green-500 opacity-75' : 'border-blue-500'}`}>
                    <div className="flex justify-between items-start border-b border-gray-100 pb-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{issue.title}</h3>
                        <div className="text-right">
                            <span className="block text-xs text-gray-400">Zgłoszono: {new Date(issue.createdAt).toLocaleDateString()}</span>
                            {issue.status === 2 && issue.resolvedAt && (
                                <span className="block text-xs text-green-600 font-bold">Rozwiązano: {new Date(issue.resolvedAt).toLocaleDateString()}</span>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{issue.description}</p>

                    <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-50 p-3 rounded">
                        <div className="flex gap-4 text-sm">
                            <div>Priorytet: {getUrgencyLabel(issue.urgency)}</div>
                            <div>
                                Status:
                                <span className={`ml-1 font-bold ${issue.status === 0 ? 'text-blue-600' : issue.status === 1 ? 'text-orange-500' : 'text-green-600'}`}>
                                    {issue.status === 0 ? "Nowe" : issue.status === 1 ? "W trakcie" : "Rozwiązane"}
                                </span>
                            </div>
                        </div>

                        {/* SEKCJA PRZYCISKÓW AKCJI */}
                        <div className="flex gap-2">
                            {issue.status === 0 && (
                                <button
                                    onClick={() => handleStatusChange(issue, 1)}
                                    disabled={actionLoading === issue.id}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {actionLoading === issue.id ? "Zapisywanie..." : "Przyjmij zgłoszenie"}
                                </button>
                            )}

                            {issue.status === 1 && (
                                <button
                                    onClick={() => handleStatusChange(issue, 2)}
                                    disabled={actionLoading === issue.id}
                                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                    {actionLoading === issue.id ? "Zapisywanie..." : "Oznacz jako rozwiązane"}
                                </button>
                            )}

                            {issue.status === 2 && (
                                <span className="text-sm text-green-700 font-semibold px-3 py-1 border border-green-200 rounded bg-green-50">
                                    ✓ Problem zamknięty
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PropertyIssuesComponent;