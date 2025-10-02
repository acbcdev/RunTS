import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from "react";

export function useToggle(
  defaultValue?: boolean
): [boolean, VoidFunction, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState(!!defaultValue);

  const toggle = useCallback(() => {
    setValue((x) => !x);
  }, []);

  return [value, toggle, setValue];
}
