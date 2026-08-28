
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Apne backend port ke hisab se set karein
  withCredentials: true,
});

export default API;