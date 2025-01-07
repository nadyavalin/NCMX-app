import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesEstimateResultModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <form className={styles.modalForm}>
        <h3>Заполните форму для оценки результативности и закрытия несоответствия</h3>
        <input
          type="date"
          name="nonconf_closure_date"
          id="nonconf_closure_date"
          title="Дата закрытия несоответствия"
        />
        <select name="estimate" id="estimate">
          <option value="">удовлетворительно</option>
          <option value="">неудовлетворительно</option>
        </select>
        <select name="resp_person_nonconf_closure" id="resp_person_nonconf_closure">
          <option value="">...выбрать ответственное лицо</option>
          <option value="">Разумнева Н.П.</option>
        </select>

        <div className={styles.buttonsBlock}>
          <button onClick={onClose}>Сохранить и закрыть</button>
        </div>
      </form>
    </ModalComponent>
  );
};
