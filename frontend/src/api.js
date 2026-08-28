import axios from 'axios';

const API = axios.create({
  // Agar aapke backend routes '/api/v1' se hain, toh ise '/api/v1' hi rakhein
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true,
});

// Request Interceptor: Har request se pehle localStorage se token nikal kar header mein dalne ke liye
API.interceptors.request.use((req) => {
  // Dhyan rakhein ki login form mein token set karte waqt aapne 'token' key hi use ki ho
  const token = localStorage.getItem('token'); 
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  
  return req;
}, (error) => {
  return Promise.reject(error);
});

export default API;