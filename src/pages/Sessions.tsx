import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSessions, logout, getUserProfile } from '../services/apiService';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Sessions.css';
import taskmanager from '../assets/taskmanager.png';
import { Session } from '../types/Session';

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessionsData = await getSessions();
        // Ordena as sessões pela data de expiração (mais recentes no topo)
        const sortedSessions = sessionsData.sort(
          (a: Session, b: Session) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime()
        );
        setSessions(sortedSessions);
      } catch (error) {
        console.log('Erro ao buscar sessões:', error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        setIsAdmin(userProfile.isAdmin);
      } catch (error) {
        console.log('Erro ao buscar perfil do usuário:', error);
      }
    };

    fetchSessions();
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.log('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="sessions-container">
      <div className="sidebar">
        <div className="logo-section">
          <Link to="/dashboard">
            <img src={taskmanager} alt="TaskManager Logo" className="logo" />
          </Link>
        </div>

        <div className="menu-section">
          <div className="profile-section">
            <Link to="/profile" className="profile-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
              <p className="profile-text">Meu Perfil</p>
            </Link>
          </div>

          <div className="menu-options">
            {isAdmin && (
              <Link to="/usersList" className="btn btn-light">Lista de Usuários</Link>
            )}
            <Link to="/sessions" className="btn btn-light">Minhas Sessões</Link>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="content-area">
        <div className="content-header">
          <h2>Minhas Sessões</h2>
        </div>

        <ul className="session-list">
          {sessions.map((session) => (
            <li key={session.id} className="session-item">
              <h5>Token: {session.token}</h5>
              <p>Expira em: {new Date(session.expiresAt).toLocaleString('pt-BR')}</p>
              {isAdmin && <p>ID do Usuário: {session.userId}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sessions;
