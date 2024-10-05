import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { createTask, logout, getUserProfile } from '../services/apiService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import taskmanager from '../assets/taskmanager.png';
import '../styles/CreateTask.css';

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(title, description, dueDate);
      navigate('/dashboard');
    } catch (error) {
      console.log('Erro ao criar task:', error);
    }
  };

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

      <div className="content-area">
        <div className="content-header">
          <h2>Nova Tarefa</h2>
        </div>

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
        </Form>
      </div>
    </div>
  );
};

export default CreateTask;
