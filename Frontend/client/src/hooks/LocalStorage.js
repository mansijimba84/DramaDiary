import { useState, useEffect, useRef } from "react";

export default function useLocalStorage(key, initialValue) {
  const isFirstRender = useRef(true);

  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Save to localStorage ONLY when value changes (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("localStorage save error:", error);
    }
  }, [key, value]);

  return [value, setValue];
}