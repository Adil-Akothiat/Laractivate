import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { SessionResponseSchema } from "@/features/shared";
import { useQuery } from "@tanstack/react-query";
import { sessionKeys } from "./keys";

export const getSessions = () => api.get<ApiResponseSchema<SessionResponseSchema>>(API_ROUTES.user.security.sessions);

export const useGetSessions = () =>
    useQuery({
        queryKey: sessionKeys.list(),
        queryFn: getSessions,
    });