import { useState } from "react";

export default function useLocalStorage(key, initialValue) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userKey = user?._id ? `${key}_${user._id}` : key;

  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(userKey);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setAndSync = (newValue) => {
    setValue((prev) => {
      const resolved =
        typeof newValue === "function" ? newValue(prev) : newValue;

      localStorage.setItem(userKey, JSON.stringify(resolved));

      window.dispatchEvent(new Event("storage-update"));

      return resolved;
    });
  };

  return [value, setAndSync];
}