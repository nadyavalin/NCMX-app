import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";
import { useFetchCommentsItems } from "@/api/route";
import { useEffect, useRef } from "react";

interface ModalProps {
  currentInconsistencyNumber: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const InconsistenciesHistoryCommentsModal = ({
  currentInconsistencyNumber,
  isOpen,
  onClose,
}: ModalProps) => {
  const { comments, loading, error } = useFetchCommentsItems(currentInconsistencyNumber);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (isOpen && !hasFetched.current && currentInconsistencyNumber) {
      console.log("Fetching comments for num_nonconf:", currentInconsistencyNumber);
      hasFetched.current = true;
    }
    if (!isOpen) {
      hasFetched.current = false;
    }
  }, [isOpen, currentInconsistencyNumber]);

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
                Дата: <b>{formatDate(comment.created_at)}</b>
              </p>
            </div>
            <p>{comment.comment_text}</p>
          </div>
        ))
      ) : (
        <div>Нет комментариев для отображения.</div>
      )}
      <div className={styles.buttonsBlock}>
        <button onClick={onClose} className={styles.closeButton}>
          Закрыть
        </button>
      </div>
    </ModalComponent>
  );
};
