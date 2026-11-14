import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "./keys";
import { useToastContext } from "@/app/hooks/common";
import { getErrorsMessagesStr } from "@/app/utils";
import { notificationApi } from "../api";

export function useNotificationMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToastContext();

  return {
    // --- Read Single Item ---
    markAsRead: useMutation({
      mutationFn: (id: string) => notificationApi.markAsRead(id),
      onSuccess: () => {
        // FIXED: Invalidates the base list query key to correctly refresh live notification counts
        queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      },
      onError: (err) => {
        toast.error(getErrorsMessagesStr(err)||"Failed to update notification.");
      }
    }),

    // --- Read All Items ---
    markAllRead: useMutation({
      mutationFn: () => notificationApi.markAllRead(),
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
        toast.success(res.message||'Done!');
      },
      onError: (err) => {
        toast.error(getErrorsMessagesStr(err)||"Failed to update notifications.");
      }
    }),
  };
}