import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://localhost:7281/api';

const AdminPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [view, setView] = useState<'users' | 'reports'>('users');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const getAuthHeader = () => {
        let token = localStorage.getItem("token");
        if (token) token = token.replace(/^"|"$/g, '');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const config = getAuthHeader();

            try {
                const resUsers = await axios.get(`${API_URL}/Admin/users`, config);
                setUsers(Array.isArray(resUsers.data) ? resUsers.data : []);
            } catch (e) { console.error("Błąd pobierania userów", e); }

            try {
                const resReports = await axios.get(`${API_URL}/Report/all`, config);
                setReports(Array.isArray(resReports.data) ? resReports.data : []);
            } catch (e) { console.error("Błąd pobierania zgłoszeń", e); }

        } catch (err: any) {
            console.error("Główny błąd pobierania:", err);
            setError("Wystąpił błąd podczas ładowania danych. Sprawdź konsolę.");
        } finally {
            setLoading(false);
        }
    };

    const toggleBan = async (userId: string, isBanned: boolean) => {
        if (!window.confirm(`Potwierdź zmianę statusu bana.`)) return;
        try {
            const url = `${API_URL}/Admin/users/${userId}/${isBanned ? 'unban' : 'ban'}`;
            await axios.post(url, null, getAuthHeader());
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !isBanned } : u));
        } catch (err) { alert("Błąd zmiany statusu użytkownika."); }
    };

    const resolveReport = async (reportId: number) => {
        if (!window.confirm("Czy na pewno chcesz oznaczyć to zgłoszenie jako rozwiązane?")) return;

        try {

            await axios.post(`${API_URL}/Report/${reportId}/resolve`, null, getAuthHeader());

            setReports(prev => prev.map(r =>
                r.id === reportId
                    ? { ...r, isResolved: true, resolvedAt: new Date().toISOString() }
                    : r
            ));

        } catch (err: any) {
            console.error("Błąd rozwiązywania zgłoszenia:", err);
            alert("Nie udało się zaktualizować zgłoszenia. Sprawdź czy masz uprawnienia administratora.");
        }
    };


    const getUserEmail = (userId: number) => {
        if (!userId) return <span style={{ color: '#ccc' }}>Nieznany</span>;
        const user = users.find(u => u.id === userId);

        return user ?
            <span style={{ fontWeight: '500' }}>{user.email}</span> :
            <span style={{ color: '#999', fontSize: '0.9em' }}>ID: {userId}</span>;
    };

    if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'white' }}>Ładowanie danych...</div>;
    if (error) return <div style={{ padding: 60, color: '#ff5252', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: '#e0e0e0' }}>
            <h1 style={{ marginBottom: '30px', fontWeight: '300' }}>Panel Administratora</h1>

            {/* Menu */}
            <div style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
                <button onClick={() => setView('users')} style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: view === 'users' ? '#007bff' : '#2c2c2c', color: 'white', border: 'none', borderRadius: '8px' }}>Użytkownicy</button>
                <button onClick={() => setView('reports')} style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: view === 'reports' ? '#007bff' : '#2c2c2c', color: 'white', border: 'none', borderRadius: '8px' }}>Zgłoszenia</button>
            </div>

            {/* Tabela Użytkowników */}
            {view === 'users' && (
                <div style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#333' }}>
                        <thead style={{ backgroundColor: '#343a40', color: 'white' }}>
                            <tr><th style={{ padding: 15 }}>Email</th><th style={{ padding: 15 }}>Status</th><th style={{ padding: 15 }}>Akcja</th></tr>
                        </thead>
                        <tbody>
                            {users.map((u: any) => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #eee', backgroundColor: u.isBanned ? '#ffebee' : 'white' }}>
                                    <td style={{ padding: 15 }}>{u.email}</td>
                                    <td style={{ padding: 15, textAlign: 'center' }}>{u.isBanned ? <b style={{ color: 'red' }}>ZBANOWANY</b> : <span style={{ color: 'green' }}>Aktywny</span>}</td>
                                    <td style={{ padding: 15, textAlign: 'center' }}>
                                        <button onClick={() => toggleBan(u.id, u.isBanned)} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: u.isBanned ? 'green' : '#d32f2f', color: 'white', border: 'none', borderRadius: 4 }}>
                                            {u.isBanned ? 'Odbanuj' : 'Zbanuj'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Tabela Zgłoszeń */}
            {view === 'reports' && (
                <div style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#333' }}>
                        <thead style={{ backgroundColor: '#343a40', color: 'white' }}>
                            <tr>
                                <th style={{ padding: 15, textAlign: 'left' }}>ID</th>
                                <th style={{ padding: 15, textAlign: 'left' }}>Od kogo</th>
                                <th style={{ padding: 15, textAlign: 'left' }}>Na kogo</th>
                                <th style={{ padding: 15, textAlign: 'left' }}>Powód</th>
                                <th style={{ padding: 15, textAlign: 'center' }}>Status</th>
                                <th style={{ padding: 15, textAlign: 'center' }}>Akcja</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? reports.map((r: any) => (
                                <tr key={r.id} style={{ borderBottom: '1px solid #eee', backgroundColor: r.isResolved ? '#f1f8e9' : 'white' }}>
                                    <td style={{ padding: 15, fontWeight: 'bold' }}>{r.id}</td>
                                    <td style={{ padding: 15 }}>{getUserEmail(r.reporterId)}</td>
                                    <td style={{ padding: 15 }}>{getUserEmail(r.reportedUserId)}</td>
                                    <td style={{ padding: 15, maxWidth: '300px' }}>{r.reason}</td>

                                    <td style={{ padding: 15, textAlign: 'center' }}>
                                        {r.isResolved ?
                                            <span style={{ color: 'green', fontWeight: 'bold', border: '1px solid green', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8em' }}>ROZWIĄZANE</span> :
                                            <span style={{ color: 'orange', fontWeight: 'bold', border: '1px solid orange', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8em' }}>NOWE</span>
                                        }
                                    </td>

                                    <td style={{ padding: 15, textAlign: 'center' }}>
                                        {!r.isResolved && (
                                            <button
                                                onClick={() => resolveReport(r.id)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: 4,
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Rozwiąż
                                            </button>
                                        )}
                                        {r.isResolved && <span style={{ color: '#aaa' }}>—</span>}
                                    </td>
                                </tr>
                            )) : <tr><td colSpan={6} style={{ padding: 30, textAlign: 'center', color: '#666' }}>Brak zgłoszeń w systemie.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPage;