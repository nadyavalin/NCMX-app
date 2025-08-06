"use client";

import styles from "./styles.module.css";
import React, { createContext, useState, useCallback, useContext } from "react";
import Snackbar from "./snackbar";
import { SnackbarType } from "../../types/types";

interface SnackbarItem {
  id: string;
  type: SnackbarType;
  text: string;
}

interface SnackbarContextType {
  addSnackbar: (type: SnackbarType, text: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context.addSnackbar;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

  const addSnackbar = useCallback((type: SnackbarType, text: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setSnackbars([{ id, type, text }]);
  }, []);

  const removeSnackbar = useCallback((id: string) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider value={{ addSnackbar }}>
      {children}
      <div className={styles.snackbarContainer}>
        {snackbars.map((snackbar) => (
          <Snackbar
            key={snackbar.id}
            type={snackbar.type}
            text={snackbar.text}
            onClose={() => removeSnackbar(snackbar.id)}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};

export { SnackbarType };
