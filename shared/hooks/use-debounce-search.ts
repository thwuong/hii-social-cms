import { debounce } from 'lodash';
import { useMemo, useState } from 'react';

export const useDebounceSearch = (callback: (value: string) => void, delay: number = 500) => {
  const [value, setValue] = useState('');

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const debouncedFn = useMemo(() => debounce(callback, delay), []);
  const handleChange = (inputValue: string) => {
    setValue(inputValue);
    debouncedFn(inputValue);
  };

  return { value, handleChange };
};
