import styles from "./styles.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesEstimateResultModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <form className={styles.modalForm}>
          <select>
            <option value="">удовлетворительно</option>
            <option value="">неудовлетворительно</option>
          </select>

          <input type="date" title="Дата закрытия несоответствия" />

          <select>
            <option value="">...выбрать ответственное лицо</option>
            <option value="">Разумнева Н.П.</option>
          </select>

          <div className={styles.buttonsBlock}>
            <button onClick={onClose}>Сохранить и закрыть</button>
          </div>
        </form>
      </div>
    </div>
  );
};
