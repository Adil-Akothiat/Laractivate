import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true
});

// Variables to manage the "Refresh Queue"
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.
use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const code = error.response?.data?.code;
    const status = error.response?.status;
    const url = originalRequest.url?.toLowerCase() || '';
   
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/refresh-token'
    ];
    const isPublicRoute = publicRoutes.some(route => url.includes(route));

    if (isPublicRoute) {
      return Promise.reject(error);
    }

    // Tenant Access Denied
    if(status === 403 && code === 'UNAUTHORIZED_TENANT_ACCESS'){
      window.location.href = '/workspaces';
      return Promise.reject(error);
    }

    // Refresh Token Mechanism
    const shouldRefresh = code === "TOKEN_MISSING" || code === "EXPIRED_TOKEN";
    if (status === 401 && shouldRefresh && !originalRequest._retry) {
      // If we are already refreshing, push this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        api.post('/auth/refresh-token')
          .then(() => {
            processQueue(null);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            triggerLogoutToast();
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    if (code === "INVALID_TOKEN" && status === 401) {
      triggerLogoutToast();
    }

    return Promise.reject(error);
  }
);

function triggerLogoutToast () {
  window.dispatchEvent(new Event('session-expired'));
};