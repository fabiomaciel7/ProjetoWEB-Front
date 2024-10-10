import React, { useState } from 'react';
import { login } from '../services/apiService';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Login: React.FC = () => {
  // Estados para armazenar o email, a senha e mensagens de feedback para o usuário.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook do react-router-dom para redirecionar o usuário após o login.

  /**
   * Função handleSubmit
   * Esta função é chamada quando o formulário é enviado. Ela tenta fazer login com as credenciais inseridas.
   * Se o login for bem-sucedido, redireciona o usuário para o dashboard. Se houver um erro, exibe uma mensagem.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário.

    try {
      // Chama a função de login e redireciona para o dashboard se for bem-sucedido.
      await login(email, password);
      setMessage('Usuário logado com sucesso.');
      navigate('/dashboard');
    } catch (error: any) {
      // Exibe uma mensagem de erro se o login falhar.
      const errorMessage = error.message || 'Falha ao realizar o login do usuário.';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      {/* Link para voltar à página inicial */}
      <Link to="/" className="back-link">
        {/* Ícone de seta para a esquerda */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M15.5 8a.5.5 0 0 0-.5-.5H3.707l3.146-3.146a.5.5 0 0 0-.708-.708l-4.5 4.5a.5.5 0 0 0 0 .708l4.5 4.5a.5.5 0 0 0 .708-.708L3.707 8.5H15a.5.5 0 0 0 .5-.5z"/>
        </svg>
      </Link>

      {/* Título da página de login */}
      <h2>Login</h2>

      {/* Formulário de login */}
      <form onSubmit={handleSubmit}>
        {/* Campo de entrada para o email */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado com o valor inserido.
            required
          />
        </div>

        {/* Campo de entrada para a senha */}
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado com o valor inserido.
            required
          />
        </div>

        {/* Exibe a mensagem de erro ou sucesso, se houver */}
        {message && <p className="message">{message}</p>}

        {/* Botão para submeter o formulário */}
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
    </div>
  );
};

export default Login;