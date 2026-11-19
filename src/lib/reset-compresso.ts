// Reset zustand store, local storage, cookies

import useCompressoStore from "./store/compresso-store";

export const resetCompresso = () => {
  const { reset } = useCompressoStore((state) => ({ reset: state.reset }));

  const resetEverything = () => {
    // reset the store
    reset();
    // clear all cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // clear local storage
    localStorage.clear();
  };

  return resetEverything;
};

export const isDev = () => {
  return import.meta.env.DEV;
};
