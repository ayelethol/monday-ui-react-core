import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import NOOP from "lodash/noop";
import debounce from "lodash/debounce";

export default function useDebounceEvent({
  delay = 0,
  onChange,
  initialStateValue,
  trim
}) {
  const [inputValue, setValue] = useState(initialStateValue);
  const previousValue = useRef(null);

  useEffect(() => {
    previousValue.current = initialStateValue;
  });

  const debounceCallback = useMemo(() => {
    if (!delay) {
      return onChange;
    }
    return debounce(onChange, delay);
  }, [onChange, delay]);

  const onEventChanged = useCallback(
    event => {
      const { value } = event.target;
      if (trim) {
        setValue(value.trim());
        debounceCallback(value.trim());
        return;
      }
      setValue(value);
      debounceCallback(value);
    },
    [debounceCallback, setValue, trim]
  );

  const clearValue = useCallback(() => {
    setValue("");
    onChange("");
  }, [setValue, onChange]);

  if (
    initialStateValue !== previousValue.current &&
    initialStateValue !== inputValue
  ) {
    setValue(initialStateValue);
  }

  return { inputValue, onEventChanged, clearValue, updateValue: setValue };
}
