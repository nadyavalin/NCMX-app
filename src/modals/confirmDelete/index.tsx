import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import { ModalComponent } from "../modalComponent";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const [localMessage, setLocalMessage] = useState(message);

  useEffect(() => {
    if (open) {
      setLocalMessage(message);
    }
  }, [open, message]);

  return (
    <ModalComponent isOpen={open} onClose={onClose} additionalClass={styles.confirmModal}>
      <div className={styles.deleteContainer}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{localMessage}</p>
        <div className={styles.actions}>
          <button onClick={onClose}>Отмена</button>
          <button onClick={onConfirm} autoFocus>
            Удалить
          </button>
        </div>
      </div>
    </ModalComponent>
  );
};
