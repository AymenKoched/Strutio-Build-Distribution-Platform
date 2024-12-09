import { BuildType } from '@strutio/models';
import axios from 'axios';
import { useQuery } from 'react-query';

export function useBuilds(filterId?: string) {
  const searchBuilds = async () => {
    const { data } = await axios.get<BuildType[]>(
      `/api/builds?filterId=${filterId}`,
    );
    return data;
  };

  const {
    data: builds,
    isError,
    error,
    isLoading,
  } = useQuery<BuildType[]>(['builds', filterId], searchBuilds, {
    enabled: true,
  });

  return {
    builds,
    isError,
    error,
    isLoading,
  };
}
