import React, { useState } from 'react';
import { login } from '../services/apiService';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

const Login: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        const user = await login(email, password);
        setMessage(`Usuário logado com sucesso.`);
      } catch (error) {
        setMessage('Falha ao realizar o login do usuário.');
      }
    };

  return (
    <div className="auth-container">
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