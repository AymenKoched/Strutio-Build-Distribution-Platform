import { AttributeType } from '@strutio/models';
import axios from 'axios';
import { useQuery } from 'react-query';

export function useAttributes() {
  const searchAttributes = async (): Promise<AttributeType[]> => {
    const { data } = await axios.get<AttributeType[]>('/api/attributes');
    return data;
  };

  const {
    data: attributes,
    isError,
    error,
    isLoading,
  } = useQuery<AttributeType[]>(['attributes'], searchAttributes, {
    enabled: true,
  });

  return {
    attributes,
    isError,
    error,
    isLoading,
  };
}
