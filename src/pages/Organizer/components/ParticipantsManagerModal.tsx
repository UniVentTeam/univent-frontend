import React, { useState, useEffect } from 'react';
import { X, Users, Download, ArrowLeft, Search, FileText } from 'lucide-react';
import { eventService } from '@/api/eventService';
import type { components } from '@/types/schema';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

type EventPreview = components['schemas']['EventPreview'] & {
    currentParticipants?: number;
};
type UserProfile = components['schemas']['UserProfile'];

interface ParticipantsManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: EventPreview[];
}

const ParticipantsManagerModal: React.FC<ParticipantsManagerModalProps> = ({
    isOpen,
    onClose,
    events,
}) => {
    const [selectedEvent, setSelectedEvent] = useState<EventPreview | null>(null);
    const [participants, setParticipants] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedEvent(null);
            setParticipants([]);
            setSearchTerm('');
        }
    }, [isOpen]);

    // Fetch participants when an event is selected
    useEffect(() => {
        if (selectedEvent && selectedEvent.id) {
            fetchParticipants(selectedEvent.id);
        }
    }, [selectedEvent]);

    const fetchParticipants = async (eventId: string) => {
        try {
            setLoading(true);
            const data = await eventService.getParticipants(eventId, 'json');
            if (Array.isArray(data)) {
                setParticipants(data);
            } else {
                setParticipants([]);
            }
        } catch (err) {
            toast.error('Eroare la încărcarea participanților');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (format: 'csv' | 'pdf') => {
        if (!selectedEvent?.id) return;
        try {
            toast.loading(`Se generează ${format.toUpperCase()}...`);

            // Get token from store
            const token = useAuthStore.getState().token;

            // Use correct API URL from environment
            const baseUrl = import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:4001';
            // If in production, use the production URL
            const finalBaseUrl = import.meta.env.MODE === 'production'
                ? import.meta.env.VITE_API_BASE_URL_PRODUCTION
                : baseUrl;

            const url = `${finalBaseUrl}/events/${selectedEvent.id}/participants?format=${format}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${(selectedEvent?.title || 'eveniment').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_lista_participanti.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.dismiss();
            toast.success(`${format.toUpperCase()} descărcat cu succes!`);

        } catch (err) {
            toast.error('Export eșuat');
            console.error(err);
        }
    };

    if (!isOpen) return null;

    const filteredParticipants = participants.filter(p =>
        p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        {selectedEvent ? (
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </button>
                        ) : (
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {selectedEvent ? selectedEvent.title : 'Administrează Participanți'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {selectedEvent
                                    ? `${participants.length} persoane înscrise`
                                    : 'Selectează un eveniment pentru a vedea lista'
                                }
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!selectedEvent ? (
                        // VIEW 1: SELECT EVENT
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {events.filter(e => (e.status as string) !== 'DRAFT').map(event => (
                                <button
                                    key={event.id}
                                    onClick={() => setSelectedEvent(event)}
                                    className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:shadow-md transition text-left group bg-white dark:bg-gray-800"
                                >
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition">
                                        <FileText className="w-6 h-6 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {event.startAt ? new Date(event.startAt).toLocaleDateString('ro-RO') : 'Dată necunoscută'} • {event.currentParticipants || 0} Participanți
                                        </p>
                                    </div>
                                </button>
                            ))}
                            {events.length === 0 && (
                                <p className="text-center text-gray-500 col-span-2">Nu ai evenimente eligibile.</p>
                            )}
                        </div>
                    ) : (
                        // VIEW 2: PARTICIPANTS TABLE
                        <div className="space-y-4">
                            {/* Toolbar */}
                            <div className="flex flex-col md:flex-row gap-4 justify-between">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Caută după nume sau email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleExport('csv')}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition border border-green-200"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export CSV
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-medium">
                                        <tr>
                                            <th className="px-4 py-3">Nume</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Rol</th>
                                            <th className="px-4 py-3">Facultate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                        {loading ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">Se încarcă lista...</td></tr>
                                        ) : filteredParticipants.length === 0 ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">Niciun participant găsit.</td></tr>
                                        ) : (
                                            filteredParticipants.map((p, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.fullName || 'N/A'}</td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.email}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">{p.role}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.faculty || '-'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default ParticipantsManagerModal;
