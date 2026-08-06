import { useQuery } from "@tanstack/react-query";
import { billingKeys } from "./keys";
import type { FilterInvoicesParams } from "../../types";
import { billingApi } from "../../api";

export const usePricingQuery = () =>
  useQuery({
    queryKey: billingKeys.pricing(),
    queryFn: async () => billingApi.listPricing(),
    select: (data)=> data.data?.data||[],
    staleTime: 1000 * 60 * 60, // Pricing structures rarely shift dynamically
  });

export const useUserPricingQuery = () =>
  useQuery({
    queryKey: billingKeys.pricing(),
    queryFn:  () =>  billingApi.listUserPricing(),
    select: (data)=> data.data.data,
    staleTime: 1000 * 60 * 60, // Pricing structures rarely shift dynamically
  });

export const useInvoicesQuery = (filters: FilterInvoicesParams = {}) =>
  useQuery({
    queryKey: billingKeys.invoiceLists(filters),
    queryFn: async () => billingApi.listInvoices(filters),
    select: (data) => data?.data,
    placeholderData: (previousData) => previousData,
  });

export const useSubscriptionQuery = () =>
  useQuery({
    queryKey: billingKeys.subscription(),
    queryFn: async () => billingApi.getSubscription(),
    select: data=> data?.data
  });