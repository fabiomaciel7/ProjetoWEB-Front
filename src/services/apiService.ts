import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import {Task} from '../types/Task'
import {LoginResponse} from '../interfaces/LoginResponse';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers = {
        ...config.headers,
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

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>('http://localhost:3001/api/login', {
      email,
      password,
    });
    const { token } = response.data;

    localStorage.setItem('token', token);

    return response.data;
  } catch (error) {
    throw new Error('Failed to login.');
  }
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('http://localhost:3001/api/tasks');
  return response.data as Task[];
};

export const logout = async () => {
  try {
    await api.post('http://localhost:3001/api/logout');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};