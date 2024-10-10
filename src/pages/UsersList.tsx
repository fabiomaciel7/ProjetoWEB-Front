import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllUsers, promoteToAdmin, logout } from '../services/apiService';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UsersList.css';
import taskmanager from '../assets/taskmanager.png';
import { User } from '../types/User';
import { BsArrowUpSquareFill, BsPencilSquare } from 'react-icons/bs';

const UsersList: React.FC = () => {
  // Estado que armazena os usuários.
  const [users, setUsers] = useState<User[]>([]);
  // Estado que armazena o ID do usuário atualmente logado.
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  // Hook para navegação entre rotas.
  const navigate = useNavigate();

  // Hook useEffect para buscar os usuários da API assim que o componente é montado.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
        setCurrentUserId(localStorage.getItem('userId'));
      } catch (error) {
        console.log('Erro ao buscar usuários:', error);
      }
    };
    fetchUsers();
  }, []);

  // Função que promove um usuário comum a administrador.
  const handlePromote = async (userId: number) => {
    try {
      await promoteToAdmin(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, isAdmin: true } : user))
      );
    } catch (error) {
      console.log('Erro ao promover usuário a admin:', error);
    }
  };

  // Função que realiza o logout do usuário atual.
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="users-list-container">
      {/* Barra lateral de navegação */}
      <div className="sidebar">
        <div className="logo-section">
          <Link to="/dashboard">
            <img src={taskmanager} alt="TaskManager Logo" className="logo" />
          </Link>
        </div>

        <div className="menu-section">
          {/* Seção de perfil com link para a página do perfil do usuário atual */}
          <div className="profile-section">
            <Link to={`/profile/${currentUserId}`} className="profile-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
              <p className="profile-text">Meu Perfil</p>
            </Link>
          </div>

          <div className="menu-options">
            {/* Link para as sessões do usuário e botão de logout */}
            <Link to="/sessions" className="btn btn-light">Minhas Sessões</Link>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </div>

      {/* Área de conteúdo onde a lista de usuários é exibida */}
      <div className="content-area">
        <div className="content-header">
          <h2>Lista de Usuários</h2>
        </div>

        {/* Grade com a lista de usuários */}
        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className={`user-card ${user.isAdmin ? 'admin' : ''}`}>
              {/* Informações do usuário */}
              <div className="user-info">
                <p>ID: {user.id}</p>
                <p>Nome: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Data de cadastro: {new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
                <p>{user.isAdmin ? 'Administrador' : 'Usuário Comum'}</p>
              </div>
              
              <div className="user-actions">
                {/* Botão para promover usuário a administrador, se ele ainda não for admin */}
                {!user.isAdmin && (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="promote-tooltip">Promover a administrador</Tooltip>}
                  >
                    <Button
                      variant="primary"
                      onClick={() => handlePromote(user.id)}
                      className="promote-btn"
                    >
                      <BsArrowUpSquareFill />
                    </Button>
                  </OverlayTrigger>
                )}

                {/* Botão para editar o usuário */}
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="edit-tooltip">Editar usuário</Tooltip>}
                >
                  <Link to={`/profile/${user.id}`}>
                    <Button variant="secondary" className="edit-btn">
                      <BsPencilSquare />
                    </Button>
                  </Link>
                </OverlayTrigger>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersList;