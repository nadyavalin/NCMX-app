import styles from "./styles.module.css";
import { RefObject } from "react";
import { CrossCloseButton } from "@components/svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  additionalClass?: string;
  contentRef?: RefObject<HTMLDivElement | null>;
}

export const ModalComponent = ({
  isOpen,
  onClose,
  children,
  additionalClass,
  contentRef,
}: ModalProps) => {
  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.show : styles.animated}`}>
      <div className={`${styles.modalContent} ${additionalClass || ""}`} ref={contentRef}>
        <div className={styles.crossCloseButton} onClick={onClose} role="button" tabIndex={0}>
          <CrossCloseButton />
        </div>
        {children}
      </div>
    </div>
  );
};
