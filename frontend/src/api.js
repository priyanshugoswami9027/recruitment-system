
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://recruitment-system-bz0i.onrender.com/api', // Apne backend port ke hisab se set karein
  withCredentials: true,
});

export default API;