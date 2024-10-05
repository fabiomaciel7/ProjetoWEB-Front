import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import { getUserProfile, updateUser, deleteUser, logout } from '../services/apiService';
import taskmanager from '../assets/taskmanager.png';
import '../styles/Profile.css';
import { BsFillSaveFill, BsFillTrash3Fill } from 'react-icons/bs';
import { UserUpdated } from '../types/UserUpdated';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userProfile, setUserProfile] = useState<UserUpdated>({
    name: '',
    email: '',
  });
  const [editedProfile, setEditedProfile] = useState<UserUpdated>(userProfile);
  const [password, setPassword] = useState('');
  const [isModified, setIsModified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (id) {
          const userProfile = await getUserProfile(id);
          setUserProfile(userProfile);
          setEditedProfile(userProfile);
          setIsAdmin(userProfile.isAdmin);
        }
      } catch (error) {
        console.log('Erro ao buscar perfil do usuário:', error);
      }
    };
  
    fetchUserProfile();
  }, [id]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
    setIsModified(true);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsModified(true);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = { ...editedProfile };
      if (password) {
        updatedData.password = password;
      }
      await updateUser(updatedData);
      setIsModified(false);
      setUserProfile(editedProfile);
      setPassword('');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteUser();
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir perfil:', error);
    }
    setShowModal(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  return (
    <div className="profile-container">
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
              <Link to="/usersList" className="btn btn-light">
                Lista de Usuários
              </Link>
            )}
            <Link to="/sessions" className="btn btn-light">Minhas Sessões</Link>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="content-area">
        <div className="content-header">
          <h2>Meu Perfil</h2>
        </div>

        <Form className="profile-form" onSubmit={handleSaveChanges}>
          <Form.Group controlId="name">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={editedProfile.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="email" className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={editedProfile.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Deixe em branco se não quiser alterar"
            />
          </Form.Group>

          <div className="button-group mt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={!isModified}
              className="save-button"
            >
              <BsFillSaveFill /> Salvar Alterações
            </Button>
            <Button
              variant="danger"
              onClick={openModal}
              className="delete-button"
            >
              <BsFillTrash3Fill /> Excluir Perfil
            </Button>
          </div>
        </Form>

        <Modal show={showModal} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>Tem certeza de que deseja excluir seu perfil? Esta ação não pode ser desfeita.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteProfile}>
              Excluir Perfil
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
