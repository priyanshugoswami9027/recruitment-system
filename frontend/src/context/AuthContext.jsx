
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
       
        setUser({ username: 'Admin Test', email: 'test@gmail.com', role: 'ADMIN' });
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);
 
  const login = async (email, password) => {
   
    if (email === 'test@gmail.com' && password === '123456') {
      const dummyToken = 'dummy-test-token-123';
      const dummyUser = { username: 'Admin Test', email: 'test@gmail.com', role: 'ADMIN' };
      
      localStorage.setItem('token', dummyToken);
      setToken(dummyToken);
      setUser(dummyUser);
      return { success: true };
    }

    
    try {
      const response = await API.post('/v1/auth/login', { email, password });
      const { token: authToken, ...userData } = response.data;
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      
        const response = await API.post('/v1/auth/register', { username, email, password });
      const { token: authToken, ...userData } = response.data;
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};