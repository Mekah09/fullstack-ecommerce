import { useEffect, useState } from "react";
import { readStored, writeStored } from "../utils/storage.jsx";

export function usePersistedState(key, initialValue) {
  const [value, setValue] = useState(() => readStored(key, initialValue));
  useEffect(() => {
    writeStored(key, value);
  }, [key, value]);
  return [value, setValue];
}
