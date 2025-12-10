import styles from "./styles.module.css";
import React, { FormEvent, useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommentRequest, updateCommentRequest, deleteCommentRequest } from "@/api";
import {
  ItemCommentRequestPOST,
  ItemCommentResponseGET,
  SnackbarType,
  CommentContentType,
} from "@appTypes/types";
import { RootState, AppDispatch } from "@store/store";
import { useSnackbar } from "@components/Snackbar/snackbarContext";
import { ModalComponent } from "@modals/ModalComponent";
import { formatDateTime } from "@utils/formatDateTime";

interface ModalProps {
  content_type: CommentContentType;
  object_id: number | null;
  isOpen: boolean;
  onClose: () => void;
  editComment?: ItemCommentResponseGET | null;
  entityTitle?: string;
}

const initialCommentFormData: ItemCommentRequestPOST = {
  content_type: "inconsistency" as CommentContentType,
  object_id: 0,
  comment_author: "",
  comment_text: "",
};

const CommentsAdderModal = ({
  content_type,
  object_id,
  isOpen,
  onClose,
  editComment,
  entityTitle,
}: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const { comments, commentLoading, commentError } = useSelector(
    (state: RootState) => state.comments,
  );

  // Состояния для формы комментария
  const [formData, setFormData] = useState<ItemCommentRequestPOST>(initialCommentFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Состояния для редактирования комментария
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<ItemCommentResponseGET | null>(null);

  const modalContentRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Функция для получения названия сущности
  const getEntityName = () => {
    const names = {
      inconsistency: "несоответствию",
      observation: "наблюдению",
      improvement: "возможности улучшения",
    };
    return names[content_type] || "сущности";
  };

  // Функция для получения заголовка
  const getTitle = () => {
    if (entityTitle) return entityTitle;

    const titles = {
      inconsistency: "несоответствия",
      observation: "наблюдения",
      improvement: "возможности улучшения",
    };
    return titles[content_type] || "сущности";
  };

  // Функция для прокрутки к форме
  const scrollToForm = () => {
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  // Функция для фокуса на текстовом поле
  const focusOnTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Эффект для прокрутки к форме при открытии модального окна
  useEffect(() => {
    if (isOpen && !editComment) {
      // Небольшая задержка для гарантии, что DOM полностью отрендерен
      setTimeout(() => {
        scrollToForm();
        focusOnTextarea();
      }, 100);
    }
  }, [isOpen, editComment]);

  // Эффект для инициализации формы
  useEffect(() => {
    if (isOpen) {
      setFormData({
        content_type,
        object_id: object_id || 0,
        comment_author: "",
        comment_text: "",
      });
      setErrors({});
    }
  }, [isOpen, content_type, object_id]);

  // Эффект для формы редактирования
  useEffect(() => {
    if (editComment) {
      setFormData({
        content_type: editComment.content_type,
        object_id: editComment.object_id,
        comment_author: editComment.comment_author,
        comment_text: editComment.comment_text,
      });
    }
  }, [editComment]);

  // Эффект для прокрутки к форме после добавления комментария
  useEffect(() => {
    if (!commentLoading && formData.comment_text === "" && isOpen && !editComment) {
      // Прокручиваем к форме после успешного добавления комментария
      setTimeout(() => {
        scrollToForm();
        focusOnTextarea();
      }, 100);
    }
  }, [commentLoading, formData.comment_text, isOpen, editComment]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.comment_author) {
      newErrors.comment_author = "Выберите автора комментария";
    }
    if (!formData.comment_text.trim()) {
      newErrors.comment_text = "Введите текст комментария";
    }
    if (!formData.object_id) {
      newErrors.object_id = `Номер ${getTitle()} обязателен`;
    }
    return newErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editComment) {
        // Режим редактирования (отдельное модальное окно)
        const result = await dispatch(
          updateCommentRequest({ id: editComment.id, data: formData }),
        ).unwrap();
        setFormData(initialCommentFormData);
        setErrors({});
        onClose();
        addSnackbar(
          SnackbarType.success,
          `Комментарий к ${getEntityName()} № ${result.object_id} успешно обновлен`,
        );
      } else {
        // Режим добавления нового комментария
        const result = await dispatch(createCommentRequest(formData)).unwrap();
        setFormData({
          ...initialCommentFormData,
          content_type,
          object_id: object_id || 0,
        });
        setErrors({});
        addSnackbar(
          SnackbarType.success,
          `Комментарий успешно добавлен к ${getEntityName()} № ${result.object_id}`,
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при отправке комментария";
      setErrors({ submit: errorMessage });
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const handleEditClick = (comment: ItemCommentResponseGET) => {
    setEditingComment(comment);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (commentId: number) => {
    try {
      await dispatch(deleteCommentRequest(commentId)).unwrap();
      addSnackbar(SnackbarType.success, `Комментарий успешно удалён`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при удалении комментария";
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const handleClose = () => {
    setFormData(initialCommentFormData);
    setErrors({});
    onClose();
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingComment(null);
  };

  // Фильтруем комментарии по object_id и content_type
  const filteredComments = useMemo(() => {
    return comments.filter(
      (comment) => comment.object_id === object_id && comment.content_type === content_type,
    );
  }, [comments, object_id, content_type]);

  const sortedComments = useMemo(
    () =>
      [...filteredComments].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      ),
    [filteredComments],
  );

  const isEditing = !!editComment;

  // Если это отдельное модальное окно для редактирования
  if (isEditing) {
    return (
      <ModalComponent isOpen={isOpen} onClose={handleClose}>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <h3>Редактировать комментарий</h3>
          {errors.submit && <p className={styles.submitError}>{errors.submit}</p>}
          {commentError && <p className={styles.submitError}>{commentError}</p>}

          <select
            name="comment_author"
            id="comment_author"
            value={formData.comment_author}
            onChange={handleChange}
            disabled={commentLoading}
          >
            <option value="">...выбрать автора комментария из базы</option>
            <option value="Разумнева Н.П.">Разумнева Н.П.</option>
            <option value="Алтаева О.Ю.">Алтаева О.Ю.</option>
            <option value="Ткачук Н.С.">Ткачук Н.С.</option>
          </select>
          {errors.comment_author && <p className={styles.submitError}>{errors.comment_author}</p>}

          <textarea
            ref={textareaRef}
            name="comment_text"
            id="comment_text"
            placeholder="Оставить комментарий"
            rows={10}
            value={formData.comment_text}
            onChange={handleChange}
            className={styles.div_area}
            disabled={commentLoading}
          />
          {errors.comment_text && <p className={styles.submitError}>{errors.comment_text}</p>}

          <div className={styles.buttonsBlock}>
            <button type="submit" disabled={commentLoading}>
              {commentLoading ? "Сохранение..." : "Сохранить и закрыть"}
            </button>
            <button type="button" onClick={handleClose}>
              Закрыть
            </button>
          </div>
        </form>
      </ModalComponent>
    );
  }

  return (
    <>
      <ModalComponent
        isOpen={isOpen}
        onClose={handleClose}
        additionalClass={styles.modalContentSpec}
        contentRef={modalContentRef}
      >
        <div className={styles.combinedModal}>
          <div>
            <h3>
              Комментарии к {getEntityName()} № {object_id}
            </h3>

            {commentLoading ? (
              <div className="loader"></div>
            ) : commentError ? (
              <div className={styles.error}>Ошибка: {commentError}</div>
            ) : sortedComments.length > 0 ? (
              <div className={styles.commentsList}>
                {sortedComments.map((comment) => (
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
                ))}
              </div>
            ) : (
              <div className={styles.noComments}>Нет комментариев для отображения.</div>
            )}
          </div>

          <div ref={formSectionRef} className={styles.formSection}>
            <form className={styles.modalForm} onSubmit={handleSubmit}>
              {errors.submit && <p className={styles.submitError}>{errors.submit}</p>}
              {commentError && <p className={styles.submitError}>{commentError}</p>}

              <select
                name="comment_author"
                id="comment_author"
                value={formData.comment_author}
                onChange={handleChange}
                disabled={commentLoading}
              >
                <option value="">...выбрать автора комментария из базы</option>
                <option value="Разумнева Н.П.">Разумнева Н.П.</option>
                <option value="Алтаева О.Ю.">Алтаева О.Ю.</option>
                <option value="Ткачук Н.С.">Ткачук Н.С.</option>
              </select>
              {errors.comment_author && (
                <p className={styles.submitError}>{errors.comment_author}</p>
              )}

              <textarea
                ref={textareaRef}
                name="comment_text"
                id="comment_text"
                placeholder="Оставить комментарий"
                rows={6}
                value={formData.comment_text}
                onChange={handleChange}
                className={styles.div_area}
                disabled={commentLoading}
              />
              {errors.comment_text && <p className={styles.submitError}>{errors.comment_text}</p>}

              <div className={styles.buttonsBlock}>
                <button type="submit" disabled={commentLoading}>
                  {commentLoading ? "Сохранение..." : "Добавить комментарий"}
                </button>
                <button type="button" onClick={handleClose}>
                  Закрыть
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalComponent>

      {isEditModalOpen && editingComment && (
        <CommentsAdderModal
          content_type={content_type}
          object_id={object_id}
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          editComment={editingComment}
        />
      )}
    </>
  );
};

export default React.memo(CommentsAdderModal);
