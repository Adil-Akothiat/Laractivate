import { api } from '../../../../app/services/api';
import type { CreateUserPayload, FilterAccountsParams, UpdateUserPayload } from '../types';

const route = '/user/accounts';
export const getAccounts = ({ page, search, role, status }: FilterAccountsParams) => {
  const params = new URLSearchParams();

  params.set('page', String(page));
  if (search) params.set('search', search);
  if (role)   params.set('role',   role);
  if (status) params.set('status', status);
  return api.get(`${route}?${params.toString()}`);
};
export const getAccount = (id:string) => api.get(`${route}/${id}`);

export const createAccount = (data: CreateUserPayload) =>
  api.post(`${route}`, data);

export const updateAccount = (id: string, data: UpdateUserPayload) =>
  api.put(`${route}/${id}`, data);


export const updateAccountAvatar = (id:string, data: FormData)=> api.put(`${route}/${id}/update-avatar`, data, {
  headers: { 'Content-Type':'multipart/form-data' }
});

export const changeAccountPassword = (id:string, data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) => api.put(`${route}/${id}/security/password`, data);

export const disableAccountTwoFactor = (id:string, data: { password: string }) =>
  api.delete(`${route}/${id}/security/two-factor`, { data });


export const deleteAccount = (id: string) =>
  api.delete(`${route}/${id}`);

// session management
export const revokeAccountSession = (accountId:string, sessionId:number)=> api.put(`${route}/${accountId}/sessions/${sessionId}`);
export const revokeAllAccountSession = (id:string)=> api.put(`${route}/${id}/sessions`);
export const clearAccountSessionHistory = (id:string)=> api.delete(`${route}/${id}/sessions/clear-history`);

// activity logs
export const getAccountActivityLogs = (page:number, userId:string)=> api.get(`${route}/${userId}/activity-logs?page=${page}`);