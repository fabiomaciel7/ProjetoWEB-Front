import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import { getUserProfile, updateUser, deleteUser, logout } from '../services/apiService';
import taskmanager from '../assets/taskmanager.png';
import '../styles/Profile.css';
import {BsFillTrash3Fill, BsFloppy2Fill } from 'react-icons/bs';
import { UserUpdated } from '../types/UserUpdated';

const Profile: React.FC = () => {
  // Extrai o id do usuário da URL
  const { id } = useParams<{ id: string }>();

  // Define os estados para armazenar o perfil do usuário, perfil editado, senha, etc.
  const [userProfile, setUserProfile] = useState<UserUpdated>({
    name: '',
    email: '',
  });
  const [editedProfile, setEditedProfile] = useState<UserUpdated>(userProfile);
  const [password, setPassword] = useState('');
  const [isModified, setIsModified] = useState(false); // Indica se houve modificação no perfil
  const [showModal, setShowModal] = useState(false); // Controla a exibição do modal de exclusão
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Indica se o usuário é admin
  const navigate = useNavigate();

  // Hook que busca o perfil do usuário ao carregar o componente ou quando o ID do usuário mudar
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (id) {
          const userProfile = await getUserProfile(id); // Busca o perfil do usuário pelo id
          setUserProfile(userProfile);
          setEditedProfile(userProfile);
          setIsAdmin(userProfile.isAdmin); // Verifica se o usuário é admin
        }
      } catch (error) {
        console.log('Erro ao buscar perfil do usuário:', error);
      }
    };
  
    fetchUserProfile();
  }, [id]);

  // Função que atualiza os campos de nome e email ao editar o perfil
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
    setIsModified(true); // Indica que houve alteração
  };

  // Função que atualiza o campo de senha ao editar o perfil
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsModified(true);
  };

  // Função que salva as alterações no perfil do usuário
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = { ...editedProfile };
      if (password) {
        updatedData.password = password; // Atualiza a senha se estiver preenchida
      }
      await updateUser(updatedData, id); // Atualiza o usuário
      setIsModified(false); // Indica que as alterações foram salvas
      setUserProfile(editedProfile);
      setPassword(''); // Limpa o campo de senha
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };  

  // Função que exclui o perfil do usuário
  const handleDeleteProfile = async () => {
    try {
      await deleteUser(id); // Exclui o usuário pelo id
      if (id === localStorage.getItem('userId')) {
        navigate('/'); // Se o usuário estiver logado, redireciona para a página inicial
      } else {
        navigate('/usersList'); // Caso contrário, redireciona para a lista de usuários (admin)
      }
    } catch (error) {
      console.error('Erro ao excluir perfil:', error);
    }
    setShowModal(false); // Fecha o modal após exclusão
  };

  // Função que realiza o logout do usuário
  const handleLogout = async () => {
    try {
      await logout(); // Faz logout do sistema
      navigate('/login'); // Redireciona para a página de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Funções para abrir e fechar o modal de confirmação de exclusão
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="profile-container">
      {/* Sidebar com o menu de navegação */}
      <div className="sidebar">
        <div className="logo-section">
          <Link to="/dashboard">
            <img src={taskmanager} alt="TaskManager Logo" className="logo" />
          </Link>
        </div>

        <div className="menu-section">
          <div className="profile-section">
            <Link to={`/profile/${localStorage.getItem('userId')}`} className="profile-link">
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

      {/* Área de conteúdo principal */}
      <div className="content-area">
        <div className="content-header">
          <h2>Ver Perfil</h2>
        </div>

        {/* Formulário de edição do perfil */}
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
              disabled={!isModified} // Botão desabilitado se não houve alterações
              className="save-button"
            >
              <BsFloppy2Fill /> Salvar Alterações
            </Button>
            <Button
              variant="danger"
              onClick={openModal} // Abre modal de confirmação
              className="delete-button"
            >
              <BsFillTrash3Fill /> Excluir Perfil
            </Button>
          </div>
        </Form>

        {/* Modal de confirmação de exclusão de perfil */}
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