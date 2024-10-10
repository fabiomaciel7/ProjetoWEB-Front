import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import taskmanager from '../assets/taskmanager.png';


const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      {/* Seção de boas-vindas com a logo e a mensagem inicial */}
      <div className="welcome-section">
        <img src={taskmanager} alt="Task Manager Logo" className="homepage-logo" />
        <h1>Task-Manager</h1>
        <p>Organize suas tarefas de maneira eficiente e segura.</p>
      </div>

      {/* Botões de ação para Login e Cadastro */}
      <div className="action-buttons">
        {/* Link para a página de login */}
        <Link to="/login" className="btn btn-primary">Login</Link>
        {/* Link para a página de cadastro */}
        <Link to="/signup" className="btn btn-secondary">Cadastro</Link>
      </div>
    </div>
  );
};

export default HomePage;