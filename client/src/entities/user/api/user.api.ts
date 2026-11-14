import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { UserSchema } from "../model";
import { userKeys } from "./keys";

const getUser = () => api.get<ApiResponseSchema<UserSchema>>(API_ROUTES.user.base);

export const useGetUser = () =>
    useQuery({
        queryKey: userKeys.user,
        queryFn: getUser,
        select: (res) => res.data.data
    });