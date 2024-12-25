import styles from "./styles.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h4>Заполните форму для внесения несоответствия в Реестр</h4>
        <p>
          Номер несоответствия: <b>1169</b>
        </p>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};
