import { StudentDashboard } from '../Student/StudentDashboard';
// import { useAuthStore } from '@/stores/authStore';
// import { Navigate } from 'react-router-dom';

export default function HomePage() {
  // const { isAuthenticated } = useAuthStore();

  // Dacă nu e logat → trimite la login
  // if (!isAuthenticated) {
  //   return <Navigate to="/auth/login" replace />;
  // }

  // Dacă e logat → arată pagina ta de student
  return <StudentDashboard />;
}
