import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ti054a04.agussbn.my.id/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
