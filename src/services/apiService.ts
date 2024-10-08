import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { Task } from '../types/Task';
import { User } from '../types/User';
import { LoginResponse } from '../types/LoginResponse';
import { Session } from '../types/Session';
import { UserUpdated } from '../types/UserUpdated';
import { TaskUpdated } from '../types/TaskUpdated';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const extractErrorMessage = (error: any): string => {
  if (error.response && error.response.data) {
    const { message, details } = error.response.data;
    return details ? `${message}: ${details.join(', ')}` : message;
  }
  return 'Erro desconhecido.';
};

export const createUser = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:3001/api/user/create', {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateUser = async (data: UserUpdated, userId: string | undefined) => {
  try {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }

    const updatedData: UserUpdated = {
      name: data.name,
      email: data.email
    };

    if (data.password) {
      updatedData.password = data.password;
    }

    const response = await api.put(`http://localhost:3001/api/user/update/${userId}`, updatedData);
    
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>('http://localhost:3001/api/login', {
      email,
      password,
    });
    const { token, id } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('userId', id.toString());

    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get('http://localhost:3001/api/tasks');
    return response.data as Task[];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const logout = async () => {
  try {
    await api.post('http://localhost:3001/api/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw new Error(extractErrorMessage(error));
  }
};

export const markTaskAsCompleted = async (taskId: number, completed: boolean) => {
  try {
    await api.patch(`http://localhost:3001/api/task/complete/${taskId}`, { completed });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const createTask = async (title: string, description?: string, dueDate?: Date | null) => {
  try {
    const data: { title: string; description?: string; dueDate?: Date | null } = {
      title,
    };

    if (description) {
      data.description = description;
    }

    if (dueDate) {
      data.dueDate = dueDate;
    }

    const response = await api.post('http://localhost:3001/api/task/create', data);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getSessions = async (): Promise<Session[]> => {
  try {
    const response = await api.get(`http://localhost:3001/api/sessions`);
    return response.data as Session[];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const deleteUser = async (userId: string | undefined) => {
  try {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }
    await api.delete(`http://localhost:3001/api/user/delete/${userId}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getUserProfile = async (userId: string): Promise<User> => {
  try {
    const response = await api.get(`http://localhost:3001/api/user/${userId}`);
    return response.data as User;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get(`http://localhost:3001/api/users`);
    return response.data as User[];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const promoteToAdmin = async (userId: number) => {
  try {
    await api.post(`http://localhost:3001/api/users/promote/${userId}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getTaskById = async (taskId: string): Promise<Task> => {
  try {
    const response = await api.get(`http://localhost:3001/api/task/${taskId}`);
    return response.data as Task;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateTask = async (taskId: string, taskData: TaskUpdated) => {
  try {
    const response = await api.put(`http://localhost:3001/api/task/update/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    await api.delete(`http://localhost:3001/api/task/delete/${taskId}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getCompletedTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get(`http://localhost:3001/api/tasks/completed`);
    return response.data as Task[];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getPendingTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get(`http://localhost:3001/api/tasks/pending`);
    return response.data as Task[];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};


export const getTasksGroupedByUser = async (): Promise<Task[]> => {
  try {
    const response = await api.get<{ [key: number]: Task[] }>(`http://localhost:3001/api/tasks/byuser`);
    return response.data ? Object.values(response.data).flat() : [];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};