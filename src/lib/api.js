import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Hardcoded backend URL
  withCredentials: false, // Set to true if using session cookies
});

export default api;
