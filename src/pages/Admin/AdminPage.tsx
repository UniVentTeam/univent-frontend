import { useState } from 'react';
import EventsList from '../Events/EventsList';
import { EventLogSection } from '../Events/components/EventLogSection';
import { NotificationsSection } from '../Events/components/NotificationsSection';

export default function AdminPage() {
    return (
        <div className="flex flex-col w-full h-full">
            {/* Header / Title might be needed? Or just the content. 
                NotificationsSection contains its own headers usually.
            */}
            <div className="flex-1 w-full container px-4 py-8 mx-auto space-y-8 animate-in fade-in duration-300">
                <NotificationsSection />
                <EventLogSection />
            </div>
        </div>
    );
}
