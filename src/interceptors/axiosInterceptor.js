// Updating axiosInterceptor.js to handle token expiry and logout

import axios from 'axios';

const getToken = () => {
  return localStorage.getItem('token'); // Retrieve token from localStorage
};

const removeToken = () => {
  localStorage.removeItem('token'); // Remove token from localStorage
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token has expired, handle logout
      removeToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
