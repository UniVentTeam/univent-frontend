import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, MapPin, Users, Type } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createEvent } from '@/api/client';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    title: '',
    type: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    locationType: 'IN_CITY', // Default valid
    maxParticipants: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2670&auto=format&fit=crop', // default mock
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Construct payload
      // startAt = date + startTime
      // endAt = date + endTime (assuming same day for simplicity)

      if (!form.date || !form.startTime || !form.endTime || !form.title || !form.type) {
        throw new Error("Please fill in all required fields.");
      }

      const startAt = new Date(`${form.date}T${form.startTime}`).toISOString();
      const endAt = new Date(`${form.date}T${form.endTime}`).toISOString();

      await createEvent({
        title: form.title,
        description: form.description,
        type: form.type,
        startAt,
        endAt,
        locationName: form.location,
        locationType: form.locationType,
        coverImageUrl: form.coverImage,
        galleryImageUrls: [],
        agenda: [],
      });

      // Success
      navigate('/organize');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('create_event.back_link')}
        </button>

        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('create_event.page_title')}</h1>
          <p className="text-gray-500 mb-10">{t('create_event.page_subtitle')}</p>

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
              {/* Type Selector -> NEW */}
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
                    value={form.date}
                    onChange={e => handleChange('date', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Time Grid (Start & End) -> NEW */}
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
                    placeholder={t('create_event.labels.location_placeholder')}
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
                    value={form.maxParticipants}
                    onChange={e => handleChange('maxParticipants', e.target.value)}
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
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

            {/* Upload Mock - Kept visual for now, using default URL */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">{t('create_event.labels.cover_image')}</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition cursor-pointer bg-gray-50">
                <Upload className="w-8 h-8 mb-2" />
                <span className="font-semibold">{t('create_event.labels.upload_text')}</span>
                <span className="text-xs mt-1">{t('create_event.labels.upload_subtext')}</span>
              </div>
              <p className="text-xs text-blue-500 mt-2 text-center">
                * Using default image for MVP
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-4 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition"
              >
                {t('create_event.buttons.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black shadow-lg shadow-gray-200 transition disabled:opacity-50"
              >
                {loading ? "Publishing..." : t('create_event.buttons.publish')}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
