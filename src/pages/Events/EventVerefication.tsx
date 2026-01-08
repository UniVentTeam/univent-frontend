import { EventLogSection } from "./components/EventLogSection";
import { NotificationsSection } from "./components/NotificationsSection";

const EventVerefication = () => {
  return (
     <main
       className="w-full min-h-screen flex flex-col bg-gradient-to-b from-[#dfdfdf33] to-[#3fbff63f] p-4 md:p-8 lg:p-12"
       role="main"
       aria-label="Dashboard"
     >
     <EventLogSection />
     <NotificationsSection />
     
     </main>
   );
};

export default EventVerefication;
