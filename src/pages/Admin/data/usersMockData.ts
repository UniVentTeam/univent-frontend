// src/pages/Admin/data/usersMockData.ts
import type { AdminUser } from '@/api/userService';

export const usersMockData: AdminUser[] = [
  {
    id: 'user-1-uuid',
    fullName: 'Ion Popescu',
    email: 'ion.popescu@example.com',
    role: 'STUDENT',
    faculty: 'FII',
    department: 'Computer Science',
    preferences: ['ACADEMIC', 'SOCIAL'],
  },
  {
    id: 'user-2-uuid',
    fullName: 'Ana Maria',
    email: 'ana.maria@example.com',
    role: 'ORGANIZER',
    faculty: 'FSEAP',
    department: 'Management',
    preferences: ['VOLUNTEERING'],
  },
  {
    id: 'user-3-uuid',
    fullName: 'Mihai Admin',
    email: 'mihai.admin@example.com',
    role: 'ADMIN',
    faculty: undefined,
    department: undefined,
    preferences: ['CAREER'],
  },
  {
    id: 'user-4-uuid',
    fullName: 'Elena Student',
    email: 'elena.student@example.com',
    role: 'STUDENT',
    faculty: 'FEAA',
    department: 'Marketing',
    preferences: ['SPORTS', 'WORKSHOP'],
  },
  {
    id: 'user-5-uuid',
    fullName: 'George Organizer',
    email: 'george.organizer@example.com',
    role: 'ORGANIZER',
    faculty: 'FIM',
    department: 'Electrotehnica',
    preferences: ['SOCIAL'],
  },
];
