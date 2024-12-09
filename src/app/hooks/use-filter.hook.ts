import { FilterType } from '@strutio/models';
import axios from 'axios';
import { useQuery } from 'react-query';

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
