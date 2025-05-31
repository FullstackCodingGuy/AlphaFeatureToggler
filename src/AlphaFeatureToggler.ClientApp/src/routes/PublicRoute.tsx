import { Navigate, Outlet } from 'react-router-dom';

export default function PublicRoute() {
  const isAuthenticated = localStorage.getItem('auth') === 'true';
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;
}
