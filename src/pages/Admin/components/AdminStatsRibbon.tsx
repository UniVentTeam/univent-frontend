import React, { useEffect, useState } from "react";
import { getEvents } from "@/api/client";
import { Copy, AlertCircle, BarChart3 } from 'lucide-react';

export const AdminStatsRibbon = (): React.JSX.Element => {
    const [stats, setStats] = useState({
        pending: 0,
        active: 0,
        total_history: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Parallel fetching for counts
                const [pendingData, activeData, historyData] = await Promise.all([
                    getEvents({ status: ['PENDING'], limit: 1 }),
                    getEvents({ status: ['PUBLISHED'], limit: 1 }),
                    getEvents({ status: ['PUBLISHED', 'REJECTED', 'ENDED'], limit: 1 })
                ]) as any[];

                setStats({
                    pending: pendingData.total || 0,
                    active: activeData.total || 0,
                    total_history: historyData.total || 0
                });
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="h-24 bg-gray-100 rounded-2xl animate-pulse mb-8"></div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-black">
            {/* Pending Requests */}
            <div className={`p-6 rounded-2xl border transition hover:shadow-md flex items-center gap-4 ${stats.pending > 0 ? 'bg-orange-50 border-orange-100' : 'bg-white border-gray-100'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stats.pending > 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Cereri Noi</h3>
                    <p className={`text-2xl font-bold ${stats.pending > 0 ? 'text-orange-900' : 'text-gray-900'}`}>{stats.pending}</p>
                </div>
            </div>

            {/* Active Events */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-green-50 text-green-600">
                    <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Acum</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
            </div>

            {/* Total History */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-blue-50 text-blue-600">
                    <Copy className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Istoric Evenimente</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_history}</p>
                </div>
            </div>
        </div>
    );
};
