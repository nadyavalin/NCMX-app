import { CrossCloseButton } from "@components/svg";
import styles from "./styles.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  additionalClass?: string;
}

export const ModalComponent = ({ isOpen, onClose, children, additionalClass }: ModalProps) => {
  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.show : styles.animated}`}>
      <div className={`${styles.modalContent} ${additionalClass}`}>
        <div className={styles.crossCloseButton} onClick={onClose} role="button" tabIndex={0}>
          <CrossCloseButton />
        </div>
        {children}
      </div>
    </div>
  );
};
