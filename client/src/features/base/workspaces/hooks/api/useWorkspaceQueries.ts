import { useQuery } from "@tanstack/react-query";
import { workspaceApi } from "../../api";
import { clientKeys } from "./keys";

export const useWorkspacesQueries = {
  list: () => useQuery({
    queryKey: clientKeys.workspaces,
    queryFn: workspaceApi.list
  }),
  verifySlug: (slug: string)=> useQuery({
    queryKey: clientKeys.slug(slug),
    queryFn: ()=> workspaceApi.verifySlug.call(this, slug),
    select: (res)=> res?.data?.data 
  })

}