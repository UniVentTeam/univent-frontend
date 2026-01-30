import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { getEvents, updateEventStatus } from '@/api/client';
import { Check, X, MapPin, Calendar, Clock, User } from 'lucide-react';
import { EventDetailsModal } from "./EventDetailsModal";
import { RejectionModal } from "./RejectionModal";

export const AdminRequestsTab = (): React.JSX.Element => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null); // Track which event we are rejecting

    // Fetch PENDING events
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await getEvents({ status: ['PENDING'] }) as any;
            setRequests(data.events || []);
        } catch (error) {
            console.error("Failed to fetch pending requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id: string) => {
        if (!confirm('Ești sigur că vrei să aprobi acest eveniment?')) return;
        try {
            await updateEventStatus(id, 'PUBLISHED');
            setSelectedEventId(null); // Close detail modal
            fetchRequests();
        } catch (error) {
            console.error("Failed to approve", error);
            alert("Failed to approve event");
        }
    };

    // Open rejection modal
    const startRejection = (id: string) => {
        setRejectingId(id);
    };

    // Confirm rejection API call
    const confirmRejection = async (reason: string) => {
        if (!rejectingId) return;

        try {
            await updateEventStatus(rejectingId, 'REJECTED', reason);
            setRejectingId(null);
            setSelectedEventId(null); // Close detail modal too
            fetchRequests();
        } catch (error) {
            console.error("Failed to decline", error);
            alert("Failed to reject event");
        }
    };

    // Wrapper for card button clicks to prevent detail modal opening via parent onClick
    const onCardAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
            ))}
        </div>
    );

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
                    {t('events.Requests')} ({requests.length})
                </h2>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Toate cererile au fost procesate!</h3>
                    <p className="text-gray-500">Nu există evenimente noi care așteaptă aprobare.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {requests.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => setSelectedEventId(event.id)}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col h-full cursor-pointer ring-offset-2 hover:ring-2 hover:ring-blue-500/20"
                        >

                            {/* Cover Image */}
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                <img
                                    src={event.coverImageUrl || "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2670"}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 text-orange-600">
                                    <Clock className="w-3 h-3" />
                                    În Așteptare
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    {/* Organizer Logo/Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                        {event.organizers?.[0]?.logoUrl ? (
                                            <img src={event.organizers[0].logoUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-bold">
                                                {event.organizers?.[0]?.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 truncate">
                                        {event.organizers?.[0]?.name || 'Unknown Organizer'}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 md:h-14">
                                    {event.title}
                                </h3>

                                <div className="space-y-2 text-sm text-gray-500 mb-6 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <div className="flex flex-col">
                                            <span>{new Date(event.startAt).toLocaleDateString()} {new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="text-xs text-gray-400">
                                                - {new Date(event.endAt).toLocaleDateString()} {new Date(event.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{event.locationName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span>{event.organizers?.[0]?.type || 'ORGANIZER'}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-gray-50 mt-auto">
                                    <button
                                        onClick={(e) => onCardAction(e, () => startRejection(event.id))}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
                                    >
                                        <X className="w-4 h-4" />
                                        Respinge
                                    </button>
                                    <button
                                        onClick={(e) => onCardAction(e, () => handleApprove(event.id))}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 rounded-xl font-semibold hover:bg-green-100 transition"
                                    >
                                        <Check className="w-4 h-4" />
                                        Aprobă
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* QUICK VIEW MODAL */}
            <EventDetailsModal
                eventId={selectedEventId}
                onClose={() => setSelectedEventId(null)}
                onApprove={handleApprove}
                onReject={startRejection}
            />

            {/* REJECTION MODAL */}
            <RejectionModal
                isOpen={!!rejectingId}
                onClose={() => setRejectingId(null)}
                onConfirm={confirmRejection}
                loading={loading && !!rejectingId}
            />
        </div>
    );
};
