import { api } from "../../services/api";

export const getMe = async ()=> {
    const response = api.get('/auth/me');
    return (await response).data;
};

export const checkResetToken = async (email:string|null, token:string|null)=> {
    const response = await api.get(`/auth/reset-password/validate-token`, {
        params: {
            email,
            token
        }
    });
    return response;
} 