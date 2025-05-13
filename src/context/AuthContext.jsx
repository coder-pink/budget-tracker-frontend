import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        console.log('Verifying token:', token ? 'Token exists' : 'No token found');
        
        if (!token) {
          console.log('No token found, setting loading to false');
          setLoading(false);
          return;
        }

        // Set the token in the Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Set Authorization header');
        
        try {
          const response = await api.get('/auth/verify');
          console.log('Token verification response:', response.data);
          
          if (response.data) {
            const userData = response.data;
            const userInfo = {
              name: userData.name,
              email: userData.email,
              userId: userData.userId,
              token: token
            };
            console.log('Setting user data:', userInfo);
            setUser(userInfo);
          } else {
            console.log('No user data in response');
            throw new Error('No user data received');
          }
        } catch (verifyError) {
          console.error('Token verification request failed:', verifyError);
          throw verifyError;
        }
      } catch (error) {
        console.error('Token verification process failed:', error);
        // Only clear token if it's an authentication error
        if (error.response?.status === 401) {
          console.log('401 error received, clearing token');
          localStorage.removeItem('accessToken');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      
      if (!response.data.accessToken) {
        throw new Error('No access token received from server');
      }

      const { accessToken, user: userData } = response.data;
      console.log('Login successful, received token and user data');
      
      // Store token
      localStorage.setItem('accessToken', accessToken);
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const userInfo = {
        name: userData.name,
        email: userData.email,
        userId: userData.userId,
        token: accessToken
      };
      
      console.log('Setting user data after login:', userInfo);
      setUser(userInfo);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('accessToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      throw error.response?.data || error;
    }
  };

  // const register = async (userData) => {
  //   try {
  //     const response = await api.post('/auth/register', userData);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error;
  //   }
  // };


const register = async (credentials) => {
  try {
    console.log('Attempting registration with:', credentials.email);
    const response = await api.post('/auth/register', credentials);

    if (!response.data.accessToken) {
      throw new Error('No access token received from server during registration');
    }

    const { accessToken, user: userData } = response.data;
    console.log('Registration successful, received token and user data');

    // Store token
    localStorage.setItem('accessToken', accessToken);

    // Set token in axios headers
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    const userInfo = {
      name: userData.name,
      email: userData.email,
      userId: userData.userId,
      token: accessToken
    };

    console.log('Setting user data after registration:', userInfo);
    setUser(userInfo);
    return response.data;

  } catch (error) {
    console.error('Registration failed:', error);
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    throw error.response?.data || error;
  }
};


  const logout = async () => {
    try {
      console.log('Attempting logout');
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      console.log('Clearing user data and token');
      localStorage.removeItem('accessToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 