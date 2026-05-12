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

// 2FA
const securityRoute = '/user/security';
export const initTwoFactor = () =>
  api.post(`${securityRoute}/two-factor/init`);

export const enableTwoFactor = (data: { otp: string }) =>
  api.post(`${securityRoute}/two-factor/enable`, data);

export const verifyTwoFactor = (data: { otp: string }) =>
  api.post(`/auth/two-factor/verify`, data);

export const disableTwoFactor = (data: { password: string }) =>
  api.put(`${securityRoute}/two-factor/disable`, { password: data.password });