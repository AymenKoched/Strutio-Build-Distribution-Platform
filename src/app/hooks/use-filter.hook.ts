import { FilterDTO, FilterGroupType, FilterType } from '@strutio/models';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type getFilterType = {
  filter: FilterType;
  filterGroups: FilterGroupType[];
};

export function useFilters(name?: string) {
  const searchFilters = async (): Promise<FilterType[]> => {
    const { data } = await axios.get<FilterType[]>('/api/filters', {
      params: name ? { name } : {},
    });
    return data;
  };

  const {
    data: filters,
    isError,
    error,
    isLoading,
  } = useQuery<FilterType[]>(['filters', name], searchFilters, {
    enabled: true,
  });

  return {
    filters,
    isError,
    error,
    isLoading,
  };
}

export function useFilter(id: string) {
  const searchFilters = async () => {
    const { data } = await axios.get<getFilterType>(`/api/filters/${id}`);
    return data;
  };

  const {
    data: filter,
    isError,
    error,
    isLoading,
  } = useQuery(['filter', id], searchFilters, {
    enabled: true,
  });

  return {
    filter,
    isError,
    error,
    isLoading,
  };
}

export function useDeleteFilter() {
  const queryClient = useQueryClient();

  const deleteFilter = async (id: string) => {
    const { data } = await axios.delete(`/api/filters/${id}`);
    return data;
  };

  return useMutation<void, unknown, string>({
    mutationFn: deleteFilter,
    onSuccess: () => Promise.all([queryClient.invalidateQueries(['filters'])]),
  });
}

export function useCreateFilter() {
  const queryClient = useQueryClient();

  const createFilter = async (payload: FilterDTO) => {
    const { data } = await axios.post(`/api/filters`, payload);
    return data;
  };

  return useMutation<FilterType, unknown, FilterDTO>({
    mutationFn: createFilter,
    onSuccess: () => Promise.all([queryClient.invalidateQueries(['filters'])]),
  });
}

export function useUpdateFilter() {
  const queryClient = useQueryClient();

  const updateFilter = async (id: string, payload: FilterDTO) => {
    const { data } = await axios.put(`/api/filters/${id}`, payload);
    return data;
  };

  return useMutation<FilterType, unknown, { id: string; payload: FilterDTO }>({
    mutationFn: ({ id, payload }) => updateFilter(id, payload),
    onSuccess: (data) =>
      Promise.all([
        queryClient.invalidateQueries(['filters']),
        queryClient.invalidateQueries(['filter', data.id]),
      ]),
  });
}
