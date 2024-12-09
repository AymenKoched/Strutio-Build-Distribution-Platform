import { FilterType } from '@strutio/models';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';

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
