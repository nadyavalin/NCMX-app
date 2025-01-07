import { CloseButton } from "@components/svg";
import styles from "./styles.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  additionalClass?: string;
}

export const ModalComponent = ({ isOpen, onClose, children, additionalClass }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${additionalClass}`}>
        <div className={styles.closeButton} onClick={onClose} role="button" tabIndex={0}>
          <CloseButton />
        </div>
        {children}
      </div>
    </div>
  );
};
