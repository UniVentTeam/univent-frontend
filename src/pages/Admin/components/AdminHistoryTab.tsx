import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { getEvents } from "@/api/client";
import { Search, Filter, Calendar } from 'lucide-react';

export const AdminHistoryTab = (): React.JSX.Element => {
    const { t } = useTranslation();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchHistory = async () => {
        try {
            setLoading(true);
            // Fetch PUBLISHED, REJECTED, ENDED (though ENDED is virtual, usually PUBLISHED + time check)
            // We perform the time check in frontend for "ENDED" label usually, but let's fetch 'PUBLISHED', 'REJECTED'
            const data = await getEvents({ status: ['PUBLISHED', 'REJECTED'] }) as any;
            setEvents(data.events || []);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Helper for status badge
    const getStatusBadge = (event: any) => {
        let status = event.status;
        let label = status;
        let style = "bg-gray-100 text-gray-800";

        // Check for ENDED
        if (status === 'PUBLISHED') {
            const now = new Date();
            const endAt = event.endAt ? new Date(event.endAt) : new Date(event.startAt);
            if (endAt < now) {
                status = 'ENDED';
            }
        }

        switch (status) {
            case 'PUBLISHED':
                label = 'Publicat';
                style = "bg-green-100 text-green-700 border border-green-200";
                break;
            case 'REJECTED':
                label = 'Respins';
                style = "bg-red-100 text-red-700 border border-red-200";
                break;
            case 'ENDED':
                label = 'Încheiat';
                style = "bg-gray-100 text-gray-600 border border-gray-200";
                break;
            default:
                label = status;
        }

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${style}`}>
                {label}
            </span>
        );
    };

    const filteredEvents = events.filter(ev =>
        ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.organizers?.[0]?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-10 text-gray-500">Loading history...</div>;

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex gap-4 items-center bg-gray-50/50">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Caută după titlu sau organizator..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
                    <Filter className="w-4 h-4" />
                    <span>{filteredEvents.length} evenimente</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-bold text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Eveniment</th>
                            <th className="px-6 py-4">Organizator</th>
                            <th className="px-6 py-4">Data</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredEvents.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                                    Nu a fost găsit niciun eveniment.
                                </td>
                            </tr>
                        ) : filteredEvents.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50/50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {event.title}
                                </td>
                                <td className="px-6 py-4">
                                    {event.organizers?.[0]?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                        {new Date(event.startAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(event)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
