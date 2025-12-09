import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";

interface Issue {
    id: number;
    title: string;
    description: string;
    urgency: number;
    status: number;
    createdAt: string;
    resolvedAt?: string;
}

const TenantIssuesList = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    // Funkcja pobierająca problemy TYLKO tego najemcy
    // Używamy endpointu: [HttpGet("tenant")]
    const fetchIssues = async () => {
        try {
            const response = await axiosInstance.get('/Issue/tenant');
            setIssues(response.data);
        } catch (error) {
            console.error("Błąd pobierania historii zgłoszeń:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 0: return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Wysłano</span>;
            case 1: return <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">W trakcie</span>;
            case 2: return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Rozwiązano</span>;
            default: return null;
        }
    };

    if (loading) return <div className="text-gray-500 text-sm mt-4">Ładowanie historii...</div>;

    if (issues.length === 0) return null; // Jak nie ma historii, nie pokazujemy nic (albo pusty komunikat)

    return (
        <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Historia Twoich zgłoszeń</h3>
            <div className="space-y-3">
                {issues.map((issue) => (
                    <div key={issue.id} className="bg-gray-50 p-4 rounded border border-gray-200 flex justify-between items-center">
                        <div>
                            <div className="font-semibold text-gray-800">{issue.title}</div>
                            <div className="text-xs text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</div>
                            {issue.status === 2 && issue.resolvedAt && (
                                <div className="text-xs text-green-600 mt-1">Naprawiono: {new Date(issue.resolvedAt).toLocaleDateString()}</div>
                            )}
                        </div>
                        <div>
                            {getStatusBadge(issue.status)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TenantIssuesList;