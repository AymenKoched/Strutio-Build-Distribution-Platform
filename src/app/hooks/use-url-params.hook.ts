'use client';

import { useSearchParams } from 'next/navigation';

export function useUrlParam() {
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(key, value);

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${newSearchParams.toString()}`,
    );
  };

  const getParam = (key: string) => {
    return searchParams.get(key);
  };

  const clearParam = (key: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(key);

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${newSearchParams.toString()}`,
    );
  };

  return {
    getParam,
    updateParam,
    clearParam,
  };
}
