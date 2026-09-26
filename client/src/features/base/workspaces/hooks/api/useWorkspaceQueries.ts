import { useQuery } from "@tanstack/react-query";
import { workspaceApi } from "../../api";
import { clientKeys } from "./keys";

export const useWorkspacesQueries = {
  list: () => useQuery({
    queryKey: clientKeys.workspaces,
    queryFn: workspaceApi.list
  })

}