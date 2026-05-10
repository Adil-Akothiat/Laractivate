// import axios from "axios";

// export const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
//     withCredentials: true,
// })

// let isRefreshing = false;
// let failedQueue: any[] = [];

// // for token is optional, in our case we don't need to attach the new token to the request headers because we're using cookies, but this function can be adapted if you need to handle token in headers (localStorage, etc)
// const processQueue = (error:any, token = null)=> {
//     failedQueue.forEach(promise=> {
//         if(error) {
//             promise.reject(error);
//         } else {
//             // no need to attach token to request headers in our case, the refresh endpoint will set the new token in the cookie, so we just resolve the promise to retry the original request
//             promise.resolve();
//         }
//     });
//     failedQueue = [];
// }

// // middleware interceptor to handle token refresh logic
// api.interceptors.response.use(
//     response=> response,
//     async error=> {
//         // the first request that fails with 401 and EXPIRED_TOKEN will trigger the refresh logic
//         const originalRequest = error.config;
//         // check if the error is due to an expired token and we haven't already tried to refresh
//         const isTokenExpired = error.response?.data?.code === 'EXPIRED_TOKEN';
//         if(isTokenExpired && !originalRequest._retry) {
//             // if we're already refreshing, queue this request to be retried once the refresh is done
//             if(isRefreshing) {
//                 return new Promise((resolve, reject)=> {
//                     failedQueue.push({resolve, reject});
//                 }).then(()=> api(originalRequest)).catch(err=> Promise.reject(err));
//             }
            
//             isRefreshing = true; // set the refreshing flag
//             originalRequest._retry = true; // mark the request as already tried
//             return new Promise((resolve, reject)=> {
//                 api.post('/auth/refresh-token')
//                     .then(()=> {
//                         processQueue(null);
//                         resolve(api(originalRequest)); // retry the original request
//                     })
//                     .catch(err=> {
//                         processQueue(err); // reject all queued requests
//                         alert('Your session has expired. Please log in again.');
//                         window.location.href = '/login'; // redirect to login
//                         reject(err);
//                     })
//                     .finally(()=> {
//                         isRefreshing = false; // reset the refreshing flag
//                     })
//             })
//         }
//         if(error.response?.data?.code === 'INVALID_TOKEN') {
//             alert('Your token is invalid. Please log in again.');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// )