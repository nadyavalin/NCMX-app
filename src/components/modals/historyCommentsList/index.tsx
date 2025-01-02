import { CloseButton } from "@components/svg";
import styles from "./styles.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesHistoryCommentsModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.closeButton} onClick={onClose} role="button" tabIndex={0}>
          <CloseButton />
        </div>
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
      </div>
    </div>
  );
};
