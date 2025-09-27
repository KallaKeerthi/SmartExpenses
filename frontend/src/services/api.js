import axios from 'axios';

const API_BASE_URL = 'https://smart-expenses-ibv1.onrender.com/api'; // Adjust this to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Expense API
export const expenseAPI = {
  getExpenses: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },
  
  addExpense: async (expense) => {
    const response = await api.post('/expenses', expense);
    return response.data;
  },
  
  updateExpense: async (id, expense) => {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  },
  
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
  
  getInsights: async () => {
    const response = await api.get('/expenses/insights');
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  updateProfile: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
};

export default api;