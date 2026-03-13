import axios from 'axios';

// Allows overriding the API host for production deployments.
// Set VITE_API_URL to the backend base URL (e.g. https://my-backend.example.com).
// If unset, defaults to local backend for development.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
