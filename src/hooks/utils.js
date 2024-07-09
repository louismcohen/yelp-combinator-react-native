import { useMemo, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

export const useDebouncedState = (initialState, delay = 300) => {
    const [actualState, setActualState] = useState(initialState);
    const [debouncedState, setDebouncedState] = useState(initialState);
  
    const debounceCommitState = useMemo(
      () =>
        debounce((value) => {
          setDebouncedState(value);
        }, delay),
      [delay],
    );
  
    const handleChangeState = useCallback(
      (value) => {
        setActualState(value);
        debounceCommitState(value);
      },
      [debounceCommitState],
    );
  
    return [[actualState, debouncedState], handleChangeState];
  }