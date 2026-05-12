import { api } from "@/app/services/api";

const route = '/user';

export const getProfile = () => api.get(`${route}/profile`);
export const updateProfile = (data: { first_name: string, last_name: string }) =>
  api.put(`${route}/profile`, data);

export const deleteAccount = (data: { password: string }) =>
  api.delete(`${route}/profile`, { data });

export const updateAvatar = (data: FormData)=> api.put(`${route}/profile/update-avatar`, data, {
  headers: { 'Content-Type':'multipart/form-data' }
});

export const changePassword = (data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) => api.post(`${route}/security/password`, data);
export const deactivateAccount = (data: { password: string }) =>
  api.post(`${route}/security/deactivate`, data);


// user sessions
export const getUserSessions = ()=> api.get(`${route}/profile/sessions`);
export const revokeSession = (id:number)=> api.put(`${route}/profile/sessions/${id}`);
export const revokeAllSessions = ()=> api.put(`${route}/profile/sessions`);
export const clearHistory = ()=> api.delete(`${route}/profile/sessions/clear-history`);
export const getProfileActivityLogs = (page:number)=> api.get(`${route}/profile/activity-logs?page=${page}`);