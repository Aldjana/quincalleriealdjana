import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_UNAUTHORIZED_EVENT, adminSession, authAPI } from '../config/api';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { PageLoader } from './components/PageLoader';

type SessionState = 'checking' | 'authenticated' | 'anonymous';

export default function AdminApp() {
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionState>(() => (adminSession.getToken() ? 'checking' : 'anonymous'));

  // Vérifie auprès du serveur qu'un jeton stocké est toujours valide
  useEffect(() => {
    if (session !== 'checking') return;
    authAPI
      .verify()
      .then(() => setSession('authenticated'))
      .catch(() => {
        adminSession.clear();
        setSession('anonymous');
      });
  }, [session]);

  // Toute réponse 401 de l'API renvoie vers l'écran de connexion
  useEffect(() => {
    const onUnauthorized = () => setSession('anonymous');
    window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const handleLogout = () => {
    adminSession.clear();
    setSession('anonymous');
    navigate('/');
  };

  if (session === 'checking') {
    return (
      <div className="min-h-screen bg-slate-950">
        <PageLoader label="Vérification de la session..." />
      </div>
    );
  }

  if (session === 'anonymous') {
    return <LoginPage onLogin={() => setSession('authenticated')} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
