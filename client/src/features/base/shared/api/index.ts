// import { api } from "@/app/services/api";

// const securityRoute = '/user/security';

// export const initTwoFactor = () =>
//     api.post(`${securityRoute}/two-factor/init`);

// export const enableTwoFactor = (data: { otp: string }) =>
//     api.post(`${securityRoute}/two-factor/enable`, data);

// export const verifyTwoFactor = (data: { code: string, token:string }) =>
//     api.post(`/auth/two-factor/verify`, { code:data.code }, {
//         headers: {
//             Authorization: 'Bearer '+data.token
//         }
//     });

// export const disableTwoFactor = (data: { password: string }) =>
//     api.put(`${securityRoute}/two-factor/disable`, { password: data.password });

// export const regenerateRecoveryCodes = () =>
//     api.post(`${securityRoute}/two-factor/regenerate-codes`);