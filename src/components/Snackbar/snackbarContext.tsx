import styles from "./styles.module.css";
import React, { createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from ".";
import { RootState, AppDispatch } from "@store/store";
import { addSnackbar, removeSnackbar } from "@store/snackbarSlice";
import { SnackbarType } from "@appTypes/types";

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
  const dispatch = useDispatch<AppDispatch>();
  const snackbars = useSelector((state: RootState) => state.snackbar.snackbars);

  const handleAddSnackbar = (type: SnackbarType, text: string) => {
    dispatch(addSnackbar({ type, text }));
  };

  const handleRemoveSnackbar = (id: string) => {
    dispatch(removeSnackbar(id));
  };

  return (
    <SnackbarContext.Provider value={{ addSnackbar: handleAddSnackbar }}>
      {children}
      <div className={styles.snackbarContainer}>
        {snackbars.map((snackbar) => (
          <Snackbar
            key={snackbar.id}
            type={snackbar.type}
            text={snackbar.text}
            onClose={() => handleRemoveSnackbar(snackbar.id)}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};

export { SnackbarType };
