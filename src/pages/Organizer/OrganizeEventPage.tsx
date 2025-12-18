import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMyAssociations, getEvents } from '@/api/client';

const OrganizeEventPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('My events');
    const navigate = useNavigate();

    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [association, setAssociation] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Get my association
                const assocs = await getMyAssociations() as any;
                if (assocs && assocs.length > 0) {
                    const myAssoc = assocs[0];
                    setAssociation(myAssoc);

                    // 2. Get events for this association
                    // Backend expects associationIds array in query
                    // We must filter by organizerIds
                    const eventsData = await getEvents({
                        associationIds: [myAssoc.id]
                    }) as any;

                    setEvents(eventsData.events || []);
                } else {
                    // No association found
                    setEvents([]);
                }
            } catch (err) {
                console.error("Failed to fetch organizer data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Translate Status
    const mapStatus = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return { label: 'Published', color: 'bg-green-100 text-green-700' };
            case 'PENDING': return { label: 'Pending Approval', color: 'bg-yellow-100 text-yellow-700' };
            case 'DRAFT': return { label: 'Draft', color: 'bg-gray-100 text-gray-700' };
            case 'REJECTED': return { label: 'Rejected', color: 'bg-red-100 text-red-700' };
            default: return { label: status, color: 'bg-gray-100 text-gray-700' };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
            {/* Header Area */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t('organizer_dashboard.title')}</h1>
                        <p className="text-gray-500 mt-1">{t('organizer_dashboard.subtitle')}</p>
                    </div>
                    <button
                        onClick={() => navigate('/events/create')}
                        className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-gray-200 flex items-center gap-2"
                    >
                        {t('organizer_dashboard.create_btn')}
                    </button>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar / Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-sm font-bold text-gray-900 mb-6">{t('organizer_dashboard.tabs.my_events')}</h2>
                            <div className="space-y-2">
                                <button className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'My events' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                    onClick={() => setActiveTab('My events')}
                                >
                                    Toate Evenimentele
                                </button>
                                <button className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'Analytics' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                    onClick={() => setActiveTab('Analytics')}
                                >
                                    Analytics
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main List */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="text-center py-20 text-gray-500">Loading events...</div>
                        ) : events.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                                <p className="text-gray-500 mb-6">Nu ai creat niciun eveniment încă.</p>
                                <button
                                    onClick={() => navigate('/events/create')}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium"
                                >
                                    Creează Primul Eveniment
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {events.map((event) => {
                                    const statusInfo = mapStatus(event.status);
                                    return (
                                        <div key={event.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="w-full md:w-48 h-32 bg-gray-100 rounded-xl overflow-hidden relative">
                                                    <img src={event.coverImageUrl || "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2670"} alt={event.title} className="w-full h-full object-cover" />
                                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                                        {new Date(event.startAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold mb-2 ${statusInfo.color}`}>
                                                                {statusInfo.label}
                                                            </span>
                                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">{event.title}</h3>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-600 transition">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <Users className="w-4 h-4" />
                                                            <span>{event.currentParticipants || 0} enrolled</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{event.locationName}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrganizeEventPage;
