import { useState, useEffect } from "react";

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setAndSync = (newValue) => {
    setValue((prev) => {
      const resolved =
        typeof newValue === "function" ? newValue(prev) : newValue;

      localStorage.setItem(key, JSON.stringify(resolved));

      // 🔥 GLOBAL SYNC EVENT
      window.dispatchEvent(new Event("storage-update"));

      return resolved;
    });
  };

  return [value, setAndSync];
}