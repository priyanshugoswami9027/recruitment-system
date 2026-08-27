// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Apne backend port ke hisab se set karein
  withCredentials: true,
});

export default API;