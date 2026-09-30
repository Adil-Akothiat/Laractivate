import { useQuery } from "@tanstack/react-query";
import { memberKeys } from "./keys";
import { FilterMembersParams } from "../../types";
import { memberApi } from "../../api";

export const useMembersQueries = {
  list: (params:FilterMembersParams) => useQuery({
    queryKey: memberKeys.membersList(params),
    queryFn: ()=> memberApi.list(params)
  })

}