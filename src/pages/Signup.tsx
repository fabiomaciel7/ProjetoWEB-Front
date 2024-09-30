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
      const user = await createUser(name, email, password);
      setMessage(`Usuário criado com sucesso.`);

      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setMessage('Falha na criação do usuário.');
    }
  };

  return (
    <div className="auth-container">
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
