import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api";

export const useMe = () =>
    useQuery({
        queryKey: ["authenticated", "user"],
        queryFn: () => getMe(),
        retry: false,
});