import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";
import { useFetchItems } from "@api/api";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesHistoryCommentsModal = ({ isOpen, onClose }: ModalProps) => {
  const { items, loading, error } = useFetchItems();

  if (!isOpen) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} additionalClass={styles.modalContentSpec}>
      <h3>История комментариев к несоответствию num_nonconf</h3>
      {items.map((item) => (
        <div className={styles.commentCard} key={item.id}>
          <div className={styles.authorAndDate}>
            <p>
              Автор: <b>{item.comment_author}</b>
            </p>
            <p>
              Дата: <b>{item.comment_date}</b>
            </p>
          </div>
          <p>{item.comment_text}</p>
        </div>
      ))}
      <button onClick={onClose}>Закрыть</button>
    </ModalComponent>
  );
};
