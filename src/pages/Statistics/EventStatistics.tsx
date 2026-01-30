import React, { useMemo, useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, Calendar, Star, TrendingUp } from 'lucide-react';
import type { components } from '@/types/schema';
import { eventService } from '@/api/eventService';

type EventPreview = components['schemas']['EventPreview'] & {
  currentParticipants?: number;
};

interface EventStatisticsProps {
  events: EventPreview[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const EventStatistics: React.FC<EventStatisticsProps> = ({ events }) => {
  const [averageRating, setAverageRating] = useState<number>(0);

  // Fetch reviews and calculate average
  useEffect(() => {
    const fetchRatings = async () => {
      if (events.length === 0) return;

      let totalSum = 0;
      let totalCount = 0;

      // Fetch reviews for all events in parallel
      // Note: In production with many events, this should be paginated or aggregated by backend
      const promises = events.map(event => eventService.getEventReviews(event.id!));
      const results = await Promise.all(promises);

      results.forEach(reviews => {
        if (reviews && Array.isArray(reviews)) {
          reviews.forEach((r: any) => {
            if (r.rating) {
              totalSum += r.rating;
              totalCount++;
            }
          });
        }
      });

      setAverageRating(totalCount > 0 ? Number((totalSum / totalCount).toFixed(1)) : 0);
    };

    fetchRatings();
  }, [events]);

  // 1. Calculare Metrici KPI
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const totalParticipants = events.reduce((acc, curr) => acc + (curr.currentParticipants || 0), 0);
    // EnumPublicStatus: UPCOMING | ONGOING | ENDED | CANCELLED
    const activeEvents = events.filter(e => e.status === 'ONGOING' || e.status === 'UPCOMING').length;

    // Folosim rating-ul real calculat mai sus
    return { totalEvents, totalParticipants, activeEvents, averageRating };
  }, [events, averageRating]);

  // 2. Pregătire Date pentru Grafice

  // Grafic A: Participanți per Eveniment (Top 5)
  const participationData = useMemo(() => {
    return events
      .map(e => ({
        name: e.title?.substring(0, 15) + (e.title && e.title.length > 15 ? '...' : ''),
        participants: e.currentParticipants || 0
      }))
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 5);
  }, [events]);

  const STATUS_MAP: Record<string, string> = {
    'PUBLISHED': 'Publicat',
    'DRAFT': 'Ciornă',
    'PENDING': 'În Așteptare',
    'REJECTED': 'Respins',
    'ENDED': 'Încheiat',
    'CANCELLED': 'Anulat',
    'UPCOMING': 'Viitor',
    'ONGOING': 'În Desfășurare'
  };

  // Grafic B: Distribuția Statusurilor
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach(e => {
      const rawStatus = e.status || 'UNKNOWN';
      // Use mapped Romanian label or fallback to raw status
      const label = STATUS_MAP[rawStatus] || rawStatus;
      counts[label] = (counts[label] || 0) + 1;
    });

    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [events]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Evenimente</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalEvents}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Participanți</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Evenimente Active</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeEvents}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Rating Mediu</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.averageRating}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Participare</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="participants" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Status Evenimente</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventStatistics;
