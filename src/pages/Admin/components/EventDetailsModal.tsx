import React, { useEffect, useState } from "react";
import { eventService } from "@/api/eventService";
import { X, Calendar, MapPin, Users, Clock, Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface EventDetailsModalProps {
    eventId: string | null;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export const EventDetailsModal = ({ eventId, onClose, onApprove, onReject }: EventDetailsModalProps) => {
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!eventId) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const data = await eventService.getEventById(eventId);
                setEvent(data);
            } catch (err) {
                console.error("Failed to load event details", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [eventId]);

    if (!eventId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header / Actions */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide px-2">Detalii Eveniment</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content Scrollable */}
                <div className="flex-1 overflow-y-auto p-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : !event ? (
                        <div className="p-8 text-center text-gray-500">Evenimentul nu a putut fi încărcat.</div>
                    ) : (
                        <div className="flex flex-col md:flex-row">
                            {/* Left: Image & Quick Info */}
                            <div className="md:w-1/3 bg-gray-50 p-6 border-r border-gray-100">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 mb-6 shadow-sm relative">
                                    {event.coverImageUrl ? (
                                        <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-lg border border-yellow-200">
                                        {event.status}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 text-sm">
                                        <Calendar className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900">Perioada</p>
                                            <p className="text-gray-600">
                                                {new Date(event.startAt).toLocaleDateString()} {new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                <br />
                                                <span className="text-gray-400 text-xs">până la</span>
                                                <br />
                                                {new Date(event.endAt).toLocaleDateString()} {new Date(event.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900">Locație</p>
                                            <p className="text-gray-600 truncate">{event.locationName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm">
                                        <Users className="w-4 h-4 text-purple-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900">Organizator</p>
                                            <p className="text-gray-600">{event.organizers?.[0]?.name || 'Unknown'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Description & Agenda */}
                            <div className="flex-1 p-8">
                                <h1 className="text-2xl font-bold text-gray-900 mb-6">{event.title}</h1>

                                <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
                                    <h3 className="text-gray-900 font-semibold mb-2">Descriere</h3>
                                    <p className="whitespace-pre-line">{event.description || "Fără descriere."}</p>
                                </div>

                                {event.agenda && event.agenda.length > 0 && (
                                    <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                                        <h3 className="text-blue-900 font-semibold mb-4 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Agenda
                                        </h3>
                                        <ul className="space-y-2">
                                            {event.agenda.map((item: string, idx: number) => (
                                                <li key={idx} className="flex gap-3 text-sm text-blue-800">
                                                    <span className="font-bold opacity-50">{idx + 1}.</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}


                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
                    <button
                        onClick={() => eventId && onReject(eventId)}
                        className="px-6 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Respinge
                    </button>
                    <button
                        onClick={() => eventId && onApprove(eventId)}
                        className="px-6 py-2.5 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 shadow-lg shadow-green-200 transition flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Aprobă și Publică
                    </button>
                </div>

            </div>
        </div >
    );
};
