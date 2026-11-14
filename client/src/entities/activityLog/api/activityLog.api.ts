import { api } from "@/app/services/api";
import { PaginatedResponseSchema } from "@/app/types";
import { LogSchema } from "@/features/shared";
import { useQuery } from "@tanstack/react-query";
import { activityLogKeys } from "./keys";

const getActivityLogs = () => api.get<PaginatedResponseSchema<LogSchema>>('/user/security/activity-logs');

export const useGetActivityLogs = () => useQuery({
    queryKey: activityLogKeys.all,
    queryFn: getActivityLogs,
    select: (res) => res.data
});