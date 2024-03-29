import "../../../woby/dist/index.es.mjs";
import { useEventListener } from "../useEventListener/useEventListener.mjs";
<<<<<<< HEAD
import { p as observable, h as effect, g as get } from "../../../woby/dist/use_microtask-e694cf95.mjs";
=======
import { z as observable, h as effect, g as get } from "../../../woby/dist/use_microtask-10cd6273.mjs";
>>>>>>> 570648add711297d611963e7cf51162b828a8b0b
const localStoreDic = {};
function useLocalStorage(key, initialValue) {
  if (localStoreDic[key])
    return localStoreDic[key];
  const readValue = () => {
    if (typeof window === "undefined") {
      return get(initialValue);
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? parseJSON(item) : get(initialValue);
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return get(initialValue);
    }
  };
  const storedValue = observable(readValue());
  localStoreDic[key] = storedValue;
  effect(() => {
    if (typeof window === "undefined") {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }
    try {
      const newValue = storedValue();
      window.localStorage.setItem(key, JSON.stringify(newValue));
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  });
  const handleStorageChange = (event) => {
    if ((event == null ? void 0 : event.key) && event.key !== key) {
      return;
    }
    storedValue(readValue());
  };
  useEventListener("storage", handleStorageChange);
  useEventListener("local-storage", handleStorageChange);
  return storedValue;
}
function parseJSON(value) {
  try {
    return value === "undefined" ? void 0 : JSON.parse(value ?? "");
  } catch {
    console.log("parsing error on", { value });
    return void 0;
  }
}
export {
  localStoreDic,
  useLocalStorage
};
