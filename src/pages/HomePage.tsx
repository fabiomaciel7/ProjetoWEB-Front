import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import taskmanager from '../assets/taskmanager.png';


const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      <div className="welcome-section">
        <img src={taskmanager} alt="Task Manager Logo" className="homepage-logo" />
        <h1>Task-Manager</h1>
        <p>
          Organize suas tarefas de maneira eficiente e segura.
        </p>
      </div>

      <div className="action-buttons">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/signup" className="btn btn-secondary">Cadastro</Link>
      </div>
    </div>
  );
};

export default HomePage;
