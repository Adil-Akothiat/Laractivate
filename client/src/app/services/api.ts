import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true, // MUST be here for cookies
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
    const status = error.response?.status === 401;
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
      return Promise.reject(error); // Just return the error for the UI to handle (e.g., "Wrong Email")
    }
    // 1. Check if it's an expired token and we haven't retried yet
    const shouldRefresh = code === "TOKEN_MISSING" || code === "EXPIRED_TOKEN";
    if (status && shouldRefresh && !originalRequest._retry) {
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
            processQueue(null); // Resolve all pending requests in queue
            resolve(api(originalRequest)); // Retry the original request
          })
          .catch((err) => {
            processQueue(err, null); // Reject all pending requests
            // Force Logout logic
            triggerLogoutToast();
            // setTimeout(() => {
            //   alert('test')
            //     window.location.href = '/login';
            // }, 4000);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // 2. Handle INVALID_TOKEN or other critical auth failures
    if (code === "INVALID_TOKEN") {
      triggerLogoutToast();
      setTimeout(() => {
          window.location.href = '/login';
      }, 4000);
    }

    return Promise.reject(error);
  }
);

function triggerLogoutToast () {
  window.dispatchEvent(new Event('session-expired'));
};