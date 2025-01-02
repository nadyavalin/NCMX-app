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
          <select name="estimate" id="estimate">
            <option value="">удовлетворительно</option>
            <option value="">неудовлетворительно</option>
          </select>

          <input
            type="date"
            name="nonconf_closure_date"
            id="nonconf_closure_date"
            title="Дата закрытия несоответствия"
          />

          <select name="resp_person_nonconf_closure" id="resp_person_nonconf_closure">
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
