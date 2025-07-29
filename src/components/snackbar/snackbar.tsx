import React, { useEffect } from "react";
import { SnackbarType } from "@components/types";
import styles from "./styles.module.css";

interface SnackbarProps {
  type: SnackbarType;
  text: string;
  onClose: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({ type, text, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3900);

    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className={`${styles.snackbar} ${styles[`snackbar_${type}`]}`}>{text}</div>;
};

export default Snackbar;
