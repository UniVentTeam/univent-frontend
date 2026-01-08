import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminStatsRibbon } from './components/AdminStatsRibbon';
import { AdminRequestsTab } from './components/AdminRequestsTab';
import { AdminHistoryTab } from './components/AdminHistoryTab';

export default function AdminPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'requests' | 'history'>('requests');

    return (
        <div className="min-h-screen bg-gray-50/30 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t('admin.dashboard_title', 'Panou Administrator')}
                    </h1>
                    <p className="text-gray-500">
                        Gestionează cererile de evenimente și vizualizează istoricul activității.
                    </p>
                </div>

                {/* Stats Ribbon */}
                <AdminStatsRibbon />

                {/* Tab Navigation */}
                <div className="flex items-center gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`pb-4 px-2 text-sm font-bold transition border-b-2 ${activeTab === 'requests'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Cereri Noi (Inbox)
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-4 px-2 text-sm font-bold transition border-b-2 ${activeTab === 'history'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Istoric & Jurnal
                    </button>
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in duration-300">
                    {activeTab === 'requests' ? (
                        <AdminRequestsTab />
                    ) : (
                        <AdminHistoryTab />
                    )}
                </div>
            </div>
        </div>
    );
}
