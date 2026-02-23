import axios from 'axios';

// Create axios instance
// Using relative path to leverage Vite proxy
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // For HttpOnly Cookies
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
        // Redirect to login or clear storage logic
        console.warn('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// Auth verification
export const verifyAuth = () => api.get('/auth/verify-auth');
export const logout = () => api.post('/auth/logout');