
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://recruitment-system-bz0i.o', // Apne backend port ke hisab se set karein
  withCredentials: true,
});

export default API;