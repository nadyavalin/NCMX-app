import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";
import { useFetchCommentsItems } from "@api/api";

interface ModalProps {
  currentInconsistencyNumber: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesHistoryCommentsModal = ({
  currentInconsistencyNumber,
  isOpen,
  onClose,
}: ModalProps) => {
  const { comments, loading, error } = useFetchCommentsItems(currentInconsistencyNumber);

  if (!isOpen) {
    return null;
  }

  if (loading) {
    return (
      <ModalComponent isOpen={isOpen} onClose={onClose} additionalClass={styles.modalContentSpec}>
        <div>Загрузка комментариев...</div>
      </ModalComponent>
    );
  }

  if (error) {
    return (
      <ModalComponent isOpen={isOpen} onClose={onClose} additionalClass={styles.modalContentSpec}>
        <div>Ошибка: {error}</div>
      </ModalComponent>
    );
  }

  const filteredComments = comments.filter(
    (comment) => comment.num_nonconf === currentInconsistencyNumber,
  );

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} additionalClass={styles.modalContentSpec}>
      {filteredComments.length > 0 ? (
        filteredComments.map((comment) => (
          <div className={styles.commentCard} key={comment.id}>
            <h3>История комментариев к несоответствию {comment.num_nonconf}</h3>
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
        ))
      ) : (
        <div>Нет комментариев для отображения.</div>
      )}
      <button onClick={onClose} className={styles.closeButton}>
        Закрыть
      </button>
    </ModalComponent>
  );
};
