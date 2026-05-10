import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markAllRead, markAsRead } from "../api/index";


export const useGetNotifications = ()=> useQuery({
  queryKey:['notifications'],
  queryFn: ()=> fetchNotifications(),
  refetchInterval: 30_000
})

export const useMarkAsRead = ()=> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id:string)=> markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "mark-as-read"] });
    },
  });
}

export const useMarkAllRead = ()=> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ()=> markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}