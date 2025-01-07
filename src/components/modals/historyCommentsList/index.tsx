import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesHistoryCommentsModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} additionalClass={styles.modalContentSpec}>
      <h3>История комментариев к несоответствию num_nonconf</h3>
      <div className={styles.commentCard}>
        <div className={styles.authorAndDate}>
          <p>
            Автор: <b>Ткачук Н.С.</b>
          </p>
          <p>
            Дата: <b>ЧЧ.ММ.ГГГГ</b>
          </p>
        </div>
        <p>
          Регистрация сводных результатов операционного контроля по критериям, связанным с браком
          поставщика, осуществляется в Реестре партий до и после ВК. Технологи НПГС ознакомлены с
          требованиями регламента процесса А9.5 по электронной почте.
        </p>
      </div>

      <div className={styles.commentCard}>
        <div className={styles.authorAndDate}>
          <p>
            Автор: <b>Ткачук Н.С.</b>
          </p>
          <p>
            Дата: <b>ЧЧ.ММ.ГГГГ</b>
          </p>
        </div>
        <p>
          Регистрация сводных результатов операционного контроля по критериям, связанным с браком
          поставщика, осуществляется в Реестре партий до и после ВК. Технологи НПГС ознакомлены с
          требованиями регламента процесса А9.5 по электронной почте.
        </p>
      </div>
      <button onClick={onClose}>Закрыть</button>
    </ModalComponent>
  );
};
