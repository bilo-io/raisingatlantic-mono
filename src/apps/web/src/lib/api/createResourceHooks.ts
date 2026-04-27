'use client';

import {
  QueryKey,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { AxiosInstance } from 'axios';
import { ApiError } from './errors';
import { useToastBridge } from './toast-bridge';

export type ResourceCopy = {
  create?: { success?: string; error?: string };
  update?: { success?: string; error?: string };
  delete?: { success?: string; error?: string };
};

export type ResourceConfig<
  T,
  ListParams = void,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
  ListResult = T[],
> = {
  resource: string;
  baseUrl: string;
  client: AxiosInstance;
  copy?: ResourceCopy;
  optimisticDelete?: boolean;
  listPath?: (params?: ListParams) => string;
  unwrapList?: (raw: unknown) => ListResult;
  detailPath?: (id: string) => string;
  createPath?: () => string;
  updatePath?: (id: string) => string;
  deletePath?: (id: string) => string;
};

export type ResourceHooks<
  T,
  ListParams,
  CreateDto,
  UpdateDto,
  ListResult,
> = {
  keys: {
    all: QueryKey;
    list: (params?: ListParams) => QueryKey;
    detail: (id: string) => QueryKey;
  };
  useList: (
    params?: ListParams,
    opts?: Omit<UseQueryOptions<ListResult, ApiError>, 'queryKey' | 'queryFn'>,
  ) => UseQueryResult<ListResult, ApiError>;
  useGet: (
    id: string | undefined | null,
    opts?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>,
  ) => UseQueryResult<T, ApiError>;
  useCreate: () => UseMutationResult<T, ApiError, CreateDto>;
  useUpdate: () => UseMutationResult<T, ApiError, { id: string; patch: UpdateDto }>;
  useDelete: () => UseMutationResult<void, ApiError, string>;
};

export function createResourceHooks<
  T,
  ListParams = void,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
  ListResult = T[],
>(
  cfg: ResourceConfig<T, ListParams, CreateDto, UpdateDto, ListResult>,
): ResourceHooks<T, ListParams, CreateDto, UpdateDto, ListResult> {
  const {
    resource,
    baseUrl,
    client,
    copy,
    optimisticDelete = true,
    listPath = () => baseUrl,
    detailPath = (id) => `${baseUrl}/${id}`,
    createPath = () => baseUrl,
    updatePath = (id) => `${baseUrl}/${id}`,
    deletePath = (id) => `${baseUrl}/${id}`,
    unwrapList,
  } = cfg;

  const keys = {
    all: [resource] as QueryKey,
    list: (params?: ListParams): QueryKey =>
      params === undefined ? [resource, 'list'] : [resource, 'list', params],
    detail: (id: string): QueryKey => [resource, 'detail', id],
  };

  const titleCase = resource.charAt(0).toUpperCase() + resource.slice(1);

  function useList(
    params?: ListParams,
    opts?: Omit<UseQueryOptions<ListResult, ApiError>, 'queryKey' | 'queryFn'>,
  ): UseQueryResult<ListResult, ApiError> {
    return useQuery<ListResult, ApiError>({
      queryKey: keys.list(params),
      queryFn: async () => {
        const res = await client.get(listPath(params));
        return unwrapList ? unwrapList(res.data) : (res.data as ListResult);
      },
      ...opts,
    });
  }

  function useGet(
    id: string | undefined | null,
    opts?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>,
  ): UseQueryResult<T, ApiError> {
    return useQuery<T, ApiError>({
      queryKey: keys.detail(id ?? ''),
      queryFn: async () => {
        if (!id) throw new ApiError('Missing id', 400, null);
        const res = await client.get<T>(detailPath(id));
        return res.data;
      },
      enabled: !!id,
      ...opts,
    });
  }

  function useCreate(): UseMutationResult<T, ApiError, CreateDto> {
    const qc = useQueryClient();
    const toast = useToastBridge();
    return useMutation<T, ApiError, CreateDto>({
      mutationFn: async (dto) => {
        const res = await client.post<T>(createPath(), dto);
        return res.data;
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: keys.all });
        toast.success(copy?.create?.success ?? `${titleCase} created`);
      },
      onError: (err) => {
        toast.error(copy?.create?.error ?? `Could not create ${resource}`, err.message);
      },
    });
  }

  function useUpdate(): UseMutationResult<T, ApiError, { id: string; patch: UpdateDto }> {
    const qc = useQueryClient();
    const toast = useToastBridge();
    return useMutation<T, ApiError, { id: string; patch: UpdateDto }>({
      mutationFn: async ({ id, patch }) => {
        const res = await client.patch<T>(updatePath(id), patch);
        return res.data;
      },
      onSuccess: (_data, variables) => {
        qc.invalidateQueries({ queryKey: keys.all });
        qc.invalidateQueries({ queryKey: keys.detail(variables.id) });
        toast.success(copy?.update?.success ?? `${titleCase} updated`);
      },
      onError: (err) => {
        toast.error(copy?.update?.error ?? `Could not update ${resource}`, err.message);
      },
    });
  }

  type DeleteContext = { previousLists?: Array<[QueryKey, unknown]> };

  function useDelete(): UseMutationResult<void, ApiError, string> {
    const qc = useQueryClient();
    const toast = useToastBridge();
    return useMutation<void, ApiError, string, DeleteContext>({
      mutationFn: async (id) => {
        await client.delete(deletePath(id));
      },
      onMutate: async (id): Promise<DeleteContext> => {
        if (!optimisticDelete) return {};
        await qc.cancelQueries({ queryKey: keys.all });
        const previousLists = qc.getQueriesData({ queryKey: keys.all });
        qc.setQueriesData({ queryKey: keys.all }, (oldData: unknown) => {
          if (Array.isArray(oldData)) {
            return (oldData as Array<{ id?: string }>).filter((item) => item?.id !== id);
          }
          return oldData;
        });
        return { previousLists };
      },
      onError: (err, _id, ctx) => {
        if (optimisticDelete && ctx?.previousLists) {
          for (const [key, data] of ctx.previousLists) {
            qc.setQueryData(key, data);
          }
        }
        toast.error(copy?.delete?.error ?? `Could not delete ${resource}`, err.message);
      },
      onSuccess: () => {
        toast.success(copy?.delete?.success ?? `${titleCase} deleted`);
      },
      onSettled: () => {
        qc.invalidateQueries({ queryKey: keys.all });
      },
    });
  }

  return { keys, useList, useGet, useCreate, useUpdate, useDelete };
}
