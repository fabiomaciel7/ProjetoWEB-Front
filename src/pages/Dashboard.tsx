import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTasks, logout, markTaskAsCompleted, getUserProfile } from '../services/apiService';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Dashboard.css';
import { Task } from '../types/Task';
import taskmanager from '../assets/taskmanager.png';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Adiciona o estado de isAdmin
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData: Task[] = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.log('Erro ao buscar tasks:', error);
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

    fetchTasks();
    fetchUserProfile(); // Busca o perfil do usuário ao montar o componente
  }, []);

  const handleTaskCompletion = async (taskId: number, completed: boolean) => {
    try {
      await markTaskAsCompleted(taskId, completed);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.log('Erro ao marcar task como concluída:', error);
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
            <Link to="/profile" className="profile-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
              <p className="profile-text">Meu Perfil</p>
            </Link>
          </div>

          <div className="menu-options">
            {isAdmin && ( // Condicional para exibir o botão de Lista de Usuários apenas para admins
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
          <h2>Minhas Tarefas</h2>
        </div>
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.completed}
                onChange={() => handleTaskCompletion(task.id, !task.completed)}
              />
              <h5>{task.title}</h5><br />
              <div className="task-dates">
                <small>Criação: {new Date(task.createdAt).toLocaleDateString('pt-BR')}</small><br />
                <small>Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</small><br />
                <small>Ultima Modificação: {new Date(task.updatedAt).toLocaleDateString('pt-BR')}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
