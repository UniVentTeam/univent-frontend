import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, MapPin, Users, Type } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getEventById, updateEvent } from '@/api/client';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [form, setForm] = useState({
        title: '',
        type: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        locationType: 'IN_CITY',
        maxParticipants: '',
        description: '',
        coverImage: null as File | null,
        existingCoverUrl: '', // To show preview of existing image
    });

    const [loading, setLoading] = useState(true); // Loading initial data
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Event Data
    useEffect(() => {
        if (!id) return;
        const fetchEvent = async () => {
            try {
                const event = await getEventById(id) as any;

                // Parse dates logic corrected for Drafts
                let dateStr = '';
                let startTimeStr = '';
                let endTimeStr = '';

                if (event.startAt) {
                    const start = new Date(event.startAt);
                    dateStr = start.toISOString().split('T')[0];
                    startTimeStr = start.toTimeString().slice(0, 5);
                }

                if (event.endAt) {
                    const end = new Date(event.endAt);
                    endTimeStr = end.toTimeString().slice(0, 5);
                }

                setForm({
                    title: event.title || '',
                    type: event.type || '',
                    date: dateStr,
                    startTime: startTimeStr,
                    endTime: endTimeStr,
                    location: event.locationName || '',
                    locationType: event.locationType || 'IN_CITY',
                    maxParticipants: event.maxParticipants ? String(event.maxParticipants) : '',
                    description: event.description || '',
                    coverImage: null,
                    existingCoverUrl: event.coverImageUrl || '',
                });
            } catch (err) {
                console.error("Failed to load event", err);
                setError("Nu am putut încărca datele evenimentului.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setForm(prev => ({ ...prev, coverImage: e.target.files![0] }));
        }
    };

    // Updated handleSubmit to accept status (default PENDING for 'Publish')
    const handleSubmit = async (e: React.FormEvent, status: 'PENDING' | 'DRAFT' = 'PENDING') => {
        e.preventDefault();
        if (!id) return;

        setError(null);
        setSubmitting(true);

        try {
            // Logic similar to Create: if PENDING (Publishing), validate all.
            if (status === 'PENDING') {
                if (!form.date || !form.startTime || !form.endTime || !form.title || !form.type || !form.location) {
                    throw new Error("Vă rugăm să completați toate câmpurile pentru a publica.");
                }

                // ... add other strict validations here if needed ...
            }

            if (!form.title) {
                throw new Error("Titlul este obligatoriu.");
            }

            // Construct dates properly
            let startAt = '', endAt = '';
            if (form.date && form.startTime && form.endTime) {
                const startDate = new Date(`${form.date}T${form.startTime}`);
                const endDate = new Date(`${form.date}T${form.endTime}`);

                if (startDate >= endDate && status === 'PENDING') {
                    throw new Error("Ora de început trebuie să fie înaintea orei de final.");
                }

                startAt = startDate.toISOString();
                endAt = endDate.toISOString();
            }

            // Build FormData
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('status', status); // Explicitly send status!

            if (form.type) formData.append('type', form.type);
            if (form.description) formData.append('description', form.description);
            if (startAt) formData.append('startAt', startAt);
            if (endAt) formData.append('endAt', endAt);
            if (form.location) formData.append('locationName', form.location);
            if (form.locationType) formData.append('locationType', form.locationType);

            if (form.locationType !== 'ONLINE' && form.maxParticipants) {
                formData.append('maxParticipants', form.maxParticipants);
            }



            if (form.coverImage) {
                formData.append('coverImage', form.coverImage);
            }

            await updateEvent(id, formData);

            navigate('/organize');
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Eroare la actualizarea evenimentului");
        } finally {
            setSubmitting(false);
        }
    };

    const getLocationPlaceholder = () => {
        switch (form.locationType) {
            case 'IN_CAMPUS': return 'ex: Corp A, sala 101';
            case 'ONLINE': return 'ex: https://meet.google.com/abc-defg-hij';
            case 'IN_CITY': return 'ex: Teatrul Matei Vișniec';
            case 'OUTSIDE_CITY': return 'ex: Cabana Rarău, Jud. Suceava';
            default: return 'Introduceți locația';
        }
    };

    if (loading) return <div className='min-h-screen flex items-center justify-center'>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    {t('create_event.back_link', 'Înapoi')}
                </button>

                <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Editează Eveniment</h1>
                    <p className="text-gray-500 mb-10">Modifică detaliile evenimentului tău.</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold">
                            {error}
                        </div>
                    )}

                    <form className="space-y-8" onSubmit={handleSubmit}>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">{t('create_event.labels.title')}</label>
                            <div className="relative">
                                <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => handleChange('title', e.target.value)}
                                    placeholder={t('create_event.labels.title_placeholder')}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium"
                                />
                            </div>
                        </div>

                        {/* Type & Date Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">{t('create_event.labels.type')}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        value={form.type}
                                        onChange={e => handleChange('type', e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium appearance-none text-gray-600"
                                    >
                                        <option value="">{t('create_event.labels.type_placeholder')}</option>
                                        <option value="ACADEMIC">{t('event_types.ACADEMIC')}</option>
                                        <option value="SOCIAL">{t('event_types.SOCIAL')}</option>
                                        <option value="SPORTS">{t('event_types.SPORTS')}</option>
                                        <option value="CAREER">{t('event_types.CAREER')}</option>
                                        <option value="VOLUNTEERING">{t('event_types.VOLUNTEERING')}</option>
                                        <option value="WORKSHOP">{t('event_types.WORKSHOP')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">{t('create_event.labels.date')}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="date"
                                        // min={new Date().toISOString().split('T')[0]} // Allow past dates for editing? Maybe not.
                                        value={form.date}
                                        onChange={e => handleChange('date', e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Time Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">{t('create_event.labels.start_time')}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="time"
                                        value={form.startTime}
                                        onChange={e => handleChange('startTime', e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-600"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">{t('create_event.labels.end_time')}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="time"
                                        value={form.endTime}
                                        onChange={e => handleChange('endTime', e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location & Capacity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">{t('create_event.labels.location_type')}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        value={form.locationType}
                                        onChange={e => handleChange('locationType', e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium appearance-none text-gray-600"
                                    >
                                        <option value="IN_CITY">{t('location_types.IN_CITY')}</option>
                                        <option value="IN_CAMPUS">{t('location_types.IN_CAMPUS')}</option>
                                        <option value="OUTSIDE_CITY">{t('location_types.OUTSIDE_CITY')}</option>
                                        <option value="ONLINE">{t('location_types.ONLINE')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">{t('create_event.labels.location')}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={e => handleChange('location', e.target.value)}
                                        placeholder={getLocationPlaceholder()}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">{t('create_event.labels.max_participants')}</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        value={form.locationType === 'ONLINE' ? '' : form.maxParticipants}
                                        disabled={form.locationType === 'ONLINE'}
                                        onChange={e => handleChange('maxParticipants', e.target.value)}
                                        placeholder={form.locationType === 'ONLINE' ? "Nelimitat" : "0"}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">{t('create_event.labels.description')}</label>
                            <textarea
                                rows={4}
                                value={form.description}
                                onChange={e => handleChange('description', e.target.value)}
                                placeholder={t('create_event.labels.description_placeholder')}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium resize-none"
                            ></textarea>
                        </div>



                        {/* Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">{t('create_event.labels.cover_image')}</label>

                            {/* Existing Image Preview */}
                            {form.existingCoverUrl && !form.coverImage && (
                                <div className="mb-4 relative h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                    <img src={form.existingCoverUrl} alt="Cover" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-medium">Imaginea Curentă</div>
                                </div>
                            )}

                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition bg-gray-50 group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition" />
                                <span className="font-semibold">
                                    {form.coverImage ? form.coverImage.name : (form.existingCoverUrl ? "Încarcă alta imagine (opțional)" : t('create_event.labels.upload_text'))}
                                </span>
                                <span className="text-xs mt-1">
                                    {form.coverImage ? "Click to change" : t('create_event.labels.upload_subtext')}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 py-4 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition"
                            >
                                Anulează
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black shadow-lg shadow-gray-200 transition disabled:opacity-50"
                            >
                                {submitting ? "Se actualizează..." : "Salvează Modificările"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;
