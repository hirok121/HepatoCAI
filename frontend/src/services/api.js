import axios from "axios";
import { API_CONFIG, AUTH_CONFIG, API_ENDPOINTS, ROUTES } from "../config/constants";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;      try {
        const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        const response = await axios.post(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, newAccessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
        localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        window.location.href = ROUTES.SIGN_IN;
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
