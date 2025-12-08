import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages - Auth
import LoginPage from '@/pages/Auth/Login';
import RegisterPage from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';

// Pages - App
import HomePage from '@/pages/Home/HomePage';
import EventsList from '@/pages/Events/EventsList';
import EventDetails from '@/pages/Events/EventDetails';
import CreateEvent from '@/pages/Events/CreateEvent';
import EventsCalendar from '@/pages/Events/EventsCalendar';
import EventVerefication from '@/pages/Events/EventVerefication';
import OrganizationEvents from '@/pages/Events/OrganizationEvents';

import MyProfile from '@/pages/Profile/MyProfile';
import EditProfile from '@/pages/Profile/EditProfile';

import EventsRaports from '@/pages/Statistics/EventsRaports';
import EventStatistics from '@/pages/Statistics/EventStatistics';

import TicketsList from '@/pages/Tickets/TicketsList';
import TicketDetails from '@/pages/Tickets/TicketDetails';

import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  // 1. Login/Register
  {
    path: '/auth',
    element: <AuthLayout />, // Aici stă containerul gri/centrat
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      // Redirect automat dacă intră cineva doar pe /auth
      { index: true, element: <Navigate to="/auth/login" replace /> }
    ]
  },

  // 2. Aplicația principală
  {
    path: '/',
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'events',
        element: <EventsList />
      },
      {
        path: 'events/calendar',
        element: <EventsCalendar />
      },
      {
        path: 'events/:id',
        element: <EventDetails />
      },

      // --- B. RUTE PROTEJATE (Doar logat) ---
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'events/create',
            element: <CreateEvent />
          },
          {
            path: 'events/verification',
            element: <EventVerefication />
          },
          {
            path: 'events/organization',
            element: <OrganizationEvents />
          },
          {
            path: 'profile',
            element: <MyProfile />
          },
          {
            path: 'profile/edit',
            element: <EditProfile />
          },
          {
            path: 'statistics/raports',
            element: <EventsRaports />
          },
          {
            path: 'statistics/events/:id',
            element: <EventStatistics />
          },
          {
            path: 'tickets',
            element: <TicketsList />
          },
          {
            path: 'tickets/:id',
            element: <TicketDetails />
          }
        ]
      }
    ]
  },

  // 3. Catch-all (Orice altceva duce la 404 sau redirect)
  {
    path: '*',
    element: <NotFound />
  }
]);