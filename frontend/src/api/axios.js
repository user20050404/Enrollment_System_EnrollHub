import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');

        const response = await axios.post(
          `${API_URL}/token/refresh/`,
          {
            refresh,
          }
        );

        localStorage.setItem(
          'access_token',
          response.data.access
        );

        api.defaults.headers.common.Authorization =
          `Bearer ${response.data.access}`;

        originalRequest.headers.Authorization =
          `Bearer ${response.data.access}`;

        return api(originalRequest);

      } catch (refreshError) {
        localStorage.clear();

        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;