import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    const publicRoutes = ['/auth/register', '/auth/login', '/auth/refresh-token'];
    const isPublic = publicRoutes.some(route => config.url?.includes(route));
     if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If token refresh is in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const response = await api.post('/auth/refresh-token');
        const { accessToken } = response.data;

        if (accessToken) {
          // Store the new token
          localStorage.setItem('accessToken', accessToken);
          
          // Update the Authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          // Process any queued requests
          processQueue(null, accessToken);
          
          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error('No access token received from refresh');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // If refresh token fails, clear everything
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common['Authorization'];
        
        // Only redirect to login if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
