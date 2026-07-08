import React, { createContext, useContext, useState, useEffect } from "react";

const CrtContext = createContext();

export function CrtProvider({ children }) {
  const [isCrtActive, setIsCrtActive] = useState(true);

  // Load user preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem("crt-preference");
    if (savedPreference !== null) {
      setIsCrtActive(savedPreference === "true");
    }
  }, []);

  const toggleCrt = () => {
    setIsCrtActive((prev) => {
      const next = !prev;
      localStorage.setItem("crt-preference", String(next));
      return next;
    });
  };

  return (
    <CrtContext.Provider value={{ isCrtActive, toggleCrt }}>
      {/* Visual screen layout effects when CRT active */}
      {isCrtActive && <div className="crt-overlay crt-active" />}
      {isCrtActive && <div className="crt-vignette" />}
      {children}
    </CrtContext.Provider>
  );
}

export function useCrt() {
  return useContext(CrtContext);
}
