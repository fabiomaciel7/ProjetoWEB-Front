import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { createTask, logout, getUserProfile } from '../services/apiService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import taskmanager from '../assets/taskmanager.png';
import '../styles/CreateTask.css';

const CreateTask: React.FC = () => {
  // Gerencia o estado para o título da tarefa
  const [title, setTitle] = useState('');
  // Gerencia o estado para a descrição da tarefa
  const [description, setDescription] = useState('');
  // Gerencia o estado para a data de prazo
  const [dueDate, setDueDate] = useState<Date | null>(null);
  // Verifica se o usuário logado é admin
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // Armazena a mensagem de erro se ocorrer uma falha na criação da tarefa
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Hook para navegação entre rotas
  const navigate = useNavigate();

  /**
   * useEffect que faz a busca do perfil do usuário ao carregar o componente.
   * Define o estado de `isAdmin` conforme a resposta do perfil.
   */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userProfile = await getUserProfile(userId);
          setIsAdmin(userProfile.isAdmin);
        }
      } catch (error) {
        console.log('Erro ao buscar perfil do usuário:', error);
      }
    };

    fetchUserProfile();
  }, []);

  /**
   * Manipulador para o evento de criação de uma tarefa.
   * Verifica se há dados válidos e tenta criar uma nova tarefa usando a função `createTask`.
   * Se a criação for bem-sucedida, redireciona o usuário para o dashboard.
   * Em caso de erro, exibe uma mensagem de erro.
   * 
   * @param e - Evento de submissão do formulário
   */
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      await createTask(title, description, dueDate);
      navigate('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  /**
   * Manipulador para o evento de logout.
   * Envia uma requisição para fazer o logout e redireciona para a tela de login.
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.log('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo-section">
          {/* Link para retornar ao dashboard */}
          <Link to="/dashboard">
            <img src={taskmanager} alt="TaskManager Logo" className="logo" />
          </Link>
        </div>
        <div className="menu-section">
          <div className="profile-section">
            {/* Link para o perfil do usuário logado */}
            <Link to={`/profile/${localStorage.getItem('userId')}`} className="profile-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
              <p className="profile-text">Meu Perfil</p>
            </Link>
          </div>
          <div className="menu-options">
            {/* Exibe a lista de usuários se o usuário for admin */}
            {isAdmin && (
              <Link to="/usersList" className="btn btn-light">
                Lista de Usuários
              </Link>
            )}
            {/* Link para sessões do usuário */}
            <Link to="/sessions" className="btn btn-light">Minhas Sessões</Link>
            {/* Botão para logout */}
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="content-area">
        <div className="content-header">
          <h2>Nova Tarefa</h2>
        </div>

        {/* Formulário para criar uma nova tarefa */}
        <Form className="create-task-form" onSubmit={handleCreateTask}>
          <Form.Group controlId="title">
            <Form.Label className="form-label-task">Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Insira o título da tarefa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="description" className="mt-3">
            <Form.Label className="form-label-task">Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Insira uma descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="dueDate" className="mt-3">
            <Form.Label className="form-label-task">Prazo:</Form.Label>
            <DatePicker
              selected={dueDate}
              onChange={(date: Date | null) => setDueDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control date"
              placeholderText="Selecione uma data"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4">
            Criar Tarefa
          </Button>

          {/* Exibe a mensagem de erro se ocorrer algum problema */}
          {errorMessage && <p className="error-message mt-3">{errorMessage}</p>}
        </Form>
      </div>
    </div>
  );
};

export default CreateTask;