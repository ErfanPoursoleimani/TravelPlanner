import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example API calls
export const apiService = {
  // GET example
  getData: () => api.get('/data/'),
  
  // POST example
  postData: (data: any) => api.post('/data/', data),
};