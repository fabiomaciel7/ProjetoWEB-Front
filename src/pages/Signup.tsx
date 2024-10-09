import React, { useState } from 'react';
import { createUser } from '../services/apiService';
import '../styles/Auth.css';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createUser(name, email, password);
      setMessage(`Usuário criado com sucesso.`);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      const errorMessage = error.message || 'Falha na criação do usuário.';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="back-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M15.5 8a.5.5 0 0 0-.5-.5H3.707l3.146-3.146a.5.5 0 0 0-.708-.708l-4.5 4.5a.5.5 0 0 0 0 .708l4.5 4.5a.5.5 0 0 0 .708-.708L3.707 8.5H15a.5.5 0 0 0 .5-.5z"/>
      </svg>
      </Link>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {message && <p className="message">{message}</p>}
        <button type="submit" className="btn btn-secondary">Cadastrar</button>
      </form>
    </div>
  );
};

export default Signup;
