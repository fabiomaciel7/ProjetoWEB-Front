import React, { useState } from 'react';
import { login } from '../services/apiService';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Login: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      await login(email, password);
      setMessage('Usuário logado com sucesso.');
  
      navigate('/dashboard');
    } catch (error) {
      setMessage('Falha ao realizar o login do usuário.');
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="back-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M15.5 8a.5.5 0 0 0-.5-.5H3.707l3.146-3.146a.5.5 0 0 0-.708-.708l-4.5 4.5a.5.5 0 0 0 0 .708l4.5 4.5a.5.5 0 0 0 .708-.708L3.707 8.5H15a.5.5 0 0 0 .5-.5z"/>
      </svg>
      </Link>

      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
