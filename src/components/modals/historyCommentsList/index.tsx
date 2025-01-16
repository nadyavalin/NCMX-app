import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";
import { useFetchCommentsItems } from "@api/api";

interface ModalProps {
  currentNumConf: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesHistoryCommentsModal = ({
  currentNumConf,
  isOpen,
  onClose,
}: ModalProps) => {
  const { comments, loading, error } = useFetchCommentsItems(currentNumConf);

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
      {comments.map((comment) => (
        <div className={styles.commentCard} key={comment.id}>
          <div className={styles.authorAndDate}>
            <p>
              Автор: <b>{comment.comment_author}</b>
            </p>
            <p>
              Дата: <b>{comment.auto_data}</b>
            </p>
          </div>
          <p>{comment.comment_text}</p>
        </div>
      ))}
      <button onClick={onClose}>Закрыть</button>
    </ModalComponent>
  );
};
