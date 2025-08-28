import "@/globals.css";
import styles from "./styles.module.css";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { deleteCommentInconsistencyRequest } from "@/api";
import { AppDispatch } from "@store/store";
import { ItemCommentResponseGET } from "@appTypes/types";
import { useFetchCommentsItems } from "@hooks/useComments";
import { formatDateTime } from "@utils/formatDateTime";
import { useSnackbar, SnackbarType } from "@components/Snackbar/snackbarContext";
import { ModalComponent } from "@modals/modalComponent";
import CommentsAdderModal from "../CommentsAdderModal";

interface ModalProps {
  currentInconsistencyNumber: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const HistoryCommentsListModal = ({ currentInconsistencyNumber, isOpen, onClose }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading, error, refetch } = useFetchCommentsItems(currentInconsistencyNumber);
  const addSnackbar = useSnackbar();
  const hasFetched = useRef(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<ItemCommentResponseGET | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
      setIsInitialLoad(true);
      refetch().finally(() => setIsInitialLoad(false));
      setTimeout(() => {
        scrollToTop();
      }, 0);
    }
    if (!isOpen) {
      hasFetched.current = false;
      setIsEditModalOpen(false);
      setEditingComment(null);
      setIsInitialLoad(true);
    }
  }, [isOpen, currentInconsistencyNumber, refetch]);

  const handleEditClick = (comment: ItemCommentResponseGET) => {
    setEditingComment(comment);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (commentId: number) => {
    try {
      await dispatch(deleteCommentInconsistencyRequest(commentId)).unwrap();
      addSnackbar(SnackbarType.success, `Комментарий успешно удалён`);
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при удалении комментария";
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingComment(null);
    refetch();
  };

  const sortedComments = useMemo(
    () =>
      [...comments].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [comments],
  );

  if (loading && isInitialLoad) {
    return (
      <ModalComponent
        isOpen={isOpen}
        onClose={onClose}
        additionalClass={styles.modalContentSpec}
        contentRef={modalContentRef}
      >
        <div className="loader"></div>
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
                  Дата: <b>{formatDateTime(comment.created_at)}</b>
                </p>
              </div>
              <p>{comment.comment_text}</p>
              <div className={styles.commentChange}>
                <a href="#" onClick={() => handleEditClick(comment)}>
                  Изменить
                </a>
                <a
                  href="#"
                  className={styles.redText}
                  onClick={() => handleDeleteClick(comment.id)}
                >
                  Удалить
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
        <CommentsAdderModal
          currentInconsistencyNumber={currentInconsistencyNumber}
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          editComment={editingComment}
        />
      )}
    </>
  );
};

export default React.memo(HistoryCommentsListModal);
