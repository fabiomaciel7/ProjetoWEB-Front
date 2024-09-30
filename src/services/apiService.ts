import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    // Obtém o token do localStorage
    const token = localStorage.getItem('token');
    
    // Se o token estiver presente, adiciona o header Authorization
    if (token) {
      config.headers = {
        ...config.headers, // Mantém outros headers, se existirem
        'Authorization': `Bearer ${token}`
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const createUser = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3001/api/user/create', {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create user');
    }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:3001/api/login', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to login.');
  }
};