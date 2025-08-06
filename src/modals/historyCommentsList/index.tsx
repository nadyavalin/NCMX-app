import styles from "./styles.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useFetchCommentsItems } from "@/api/route";
import { ModalComponent } from "../modalComponent";
import InconsistenciesCommentsModal from "../commentsAdder";
import { ItemCommentResponseGET } from "../../types/types";

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

const InconsistenciesHistoryCommentsModal = ({
  currentInconsistencyNumber,
  isOpen,
  onClose,
}: ModalProps) => {
  const { comments, loading, error, refetch } = useFetchCommentsItems(currentInconsistencyNumber);
  const hasFetched = useRef(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<ItemCommentResponseGET | null>(null);

  const scrollToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (isOpen && !hasFetched.current && currentInconsistencyNumber) {
      hasFetched.current = true;
      refetch();
      setTimeout(() => {
        scrollToTop();
      }, 0);
    }
    if (!isOpen) {
      hasFetched.current = false;
      setIsEditModalOpen(false);
      setEditingComment(null);
    }
  }, [isOpen, currentInconsistencyNumber, refetch]);

  const handleEditClick = (comment: ItemCommentResponseGET) => {
    setEditingComment(comment);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setTimeout(() => {
      setIsEditModalOpen(false);
      setEditingComment(null);
      refetch();
    }, 300);
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  if (loading) {
    return (
      <ModalComponent
        isOpen={isOpen}
        onClose={onClose}
        additionalClass={styles.modalContentSpec}
        contentRef={modalContentRef}
      >
        <div>Загрузка комментариев...</div>
      </ModalComponent>
    );
  }

  if (error) {
    return (
      <ModalComponent
        isOpen={isOpen}
        onClose={onClose}
        additionalClass={styles.modalContentSpec}
        contentRef={modalContentRef}
      >
        <div>Ошибка: {error}</div>
      </ModalComponent>
    );
  }

  return (
    <>
      <ModalComponent
        isOpen={isOpen}
        onClose={onClose}
        additionalClass={styles.modalContentSpec}
        contentRef={modalContentRef}
      >
        {sortedComments.length > 0 && (
          <h3>История комментариев к несоответствию № {currentInconsistencyNumber}</h3>
        )}
        {sortedComments.length > 0 ? (
          sortedComments.map((comment) => (
            <div className={styles.commentCard} key={comment.id}>
              <div className={styles.authorAndDate}>
                <p>
                  Автор: <b>{comment.comment_author}</b>
                </p>
                <p>
                  Дата: <b>{formatDate(comment.created_at)}</b>
                </p>
              </div>
              <p>{comment.comment_text}</p>
              <div className={styles.comment_change}>
                <a href="#" onClick={() => handleEditClick(comment)}>
                  Изменить
                </a>
              </div>
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
      {isEditModalOpen && editingComment && (
        <InconsistenciesCommentsModal
          currentInconsistencyNumber={currentInconsistencyNumber}
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          editComment={editingComment}
        />
      )}
    </>
  );
};

export default React.memo(InconsistenciesHistoryCommentsModal);
