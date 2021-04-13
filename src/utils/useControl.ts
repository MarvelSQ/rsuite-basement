import { useCallback, useState } from 'react';

export function useControl<C, R = C>(
  defaultState: C,
  callback: (next: R, prev: C) => C = (val: R) => (val as unknown) as C
) {
  const [state, setState] = useState(defaultState);

  const handleChange = useCallback((next: R) => {
    setState(callback(next, state));
  }, []);

  return {
    value: state,
    setValue: setState,
    change: handleChange,
  };
}
