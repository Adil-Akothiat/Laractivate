import { api } from '@/app/services/api';
import type { RegisterPayloadType } from '../types';

export const login = (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const register = (data:RegisterPayloadType) => {
  return api.post('/auth/register', data);
};

export const forgotPassword = (email: string) => {
  return api.post('/auth/forgot-password', { email });
};

export const resetPassword = (data: {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}) => {
  return api.post('/auth/reset-password', data);
};


export const logout = () => {
  return api.post('/auth/logout');
}