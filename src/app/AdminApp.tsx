import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';

export default function AdminApp() {
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const navigate = useNavigate();

  const handleLogin = (token: string) => {
    setAdminToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    navigate('/');
  };

  if (!adminToken) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
