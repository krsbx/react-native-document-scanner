import {useEffect, useRef} from 'react';

const usePrevious = <T,>(value: T) => {
  const previous = useRef<T>(value);

  useEffect(() => {
    previous.current = value;
  }, [value]);

  return previous.current;
};

export default usePrevious;
