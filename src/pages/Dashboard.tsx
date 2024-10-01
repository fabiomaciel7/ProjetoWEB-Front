import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTasks, logout } from '../services/apiService';
import { ListGroup, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Dashboard.css';
import {Task} from '../types/Task';

const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
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
  
      fetchTasks();
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
      <div className="dashboard-container">
        <div className="sidebar">
        <div className="profile-section">
          <Link to="/profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            </svg>
          </Link>
          <p className="profile-text">Meu Perfil</p>
        </div>
  
          <div className="menu-options">
            <Link to="/sessions" className="btn btn-light">Minhas Sessões</Link>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
  
        <div className="task-list-container">
          <h2>Minhas Tarefas</h2>
          <ListGroup>
            {tasks.map((task) => (
              <ListGroup.Item key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div>
                  <h5>{task.title}</h5>
                </div>
                <div className='due-date'>
                  <small>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  };
  
  export default Dashboard;