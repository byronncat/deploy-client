import { useCallback, useRef, useState } from 'react';

type useStateWithHistoryReturn<T> = [
  T,
  (v: T | ((prevValue: T) => T)) => void,
  {
    history: T[];
    pointer: number;
    back: () => void;
    forward: () => void;
    go: (index: number) => void;
  },
];

type useStateWithHistoryOptions = {
  capacity?: number;
};

function useStateWithHistory<T>(
  defaultValue: T | (() => T),
  { capacity = 10 }: useStateWithHistoryOptions = {},
): useStateWithHistoryReturn<T> {
  const [value, setValue] = useState(defaultValue);
  const historyRef = useRef([value]);
  const pointerRef = useRef(0);

  const set = useCallback(
    (v: T | ((prevValue: T) => T)) => {
      const resolvedValue =
        typeof v === 'function' ? (v as Function)(value) : v;
      if (historyRef.current[pointerRef.current] !== resolvedValue) {
        if (pointerRef.current < historyRef.current.length - 1) {
          historyRef.current.splice(pointerRef.current + 1);
        }
        historyRef.current.push(resolvedValue);

        while (historyRef.current.length > capacity) {
          historyRef.current.shift();
        }
        pointerRef.current = historyRef.current.length - 1;
      }
      setValue(resolvedValue);
    },
    [capacity, value],
  );

  const back = useCallback(() => {
    if (pointerRef.current <= 0) return;
    pointerRef.current--;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  const forward = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return;
    pointerRef.current++;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  const go = useCallback((index: number) => {
    if (index < 0 || index > historyRef.current.length - 1) return;
    pointerRef.current = index;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  return [
    value,
    set,
    {
      history: historyRef.current,
      pointer: pointerRef.current,
      back,
      forward,
      go,
    },
  ];
}

export default useStateWithHistory;
