import styles from "./styles.module.css";
import React, { FormEvent, useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createRescheduleCommentRequest,
  updateRescheduleCommentRequest,
  deleteRescheduleCommentRequest,
  fetchInconsistencyRescheduleComments,
} from "@/api/rescheduleCommentsApi";
import {
  RescheduleCommentRequestPOST,
  RescheduleCommentResponseGET,
  SnackbarType,
  RescheduleCommentContentType,
} from "@appTypes/types";
import { RootState, AppDispatch } from "@store/store";
import { useSnackbar } from "@components/Snackbar/snackbarContext";
import { ModalComponent } from "@modals/ModalComponent";
import { formatDateTime } from "@utils/formatDateTime";

interface ModalProps {
  content_type: RescheduleCommentContentType;
  object_id: number | null;
  isOpen: boolean;
  onClose: () => void;
  editComment?: RescheduleCommentResponseGET | null;
  entityTitle?: string;
}

const initialCommentFormData: RescheduleCommentRequestPOST = {
  content_type: "inconsistency" as RescheduleCommentContentType,
  object_id: 0,
  comment_author: "",
  comment_text: "",
  old_date: null,
  new_date: null,
  action_type: null,
  action_index: null,
};

const RescheduleCommentsAdderModal = ({
  content_type,
  object_id,
  isOpen,
  onClose,
  editComment,
  entityTitle,
}: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();

  const { rescheduleComments, rescheduleCommentLoading, rescheduleCommentError } = useSelector(
    (state: RootState) => state.rescheduleComments,
  );

  // Состояния для формы комментария
  const [formData, setFormData] = useState<RescheduleCommentRequestPOST>(initialCommentFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Состояния для редактирования комментария
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<RescheduleCommentResponseGET | null>(null);

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

  // Эффект для загрузки комментариев при открытии модального окна
  useEffect(() => {
    if (isOpen && object_id) {
      dispatch(fetchInconsistencyRescheduleComments(object_id));
    }
  }, [isOpen, object_id, dispatch]);

  // Эффект для инициализации формы
  useEffect(() => {
    if (isOpen) {
      setFormData({
        content_type,
        object_id: object_id || 0,
        comment_author: "",
        comment_text: "",
        old_date: null,
        new_date: null,
        action_type: null,
        action_index: null,
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
        old_date: editComment.old_date,
        new_date: editComment.new_date,
        action_type: editComment.action_type,
        action_index: editComment.action_index,
      });
    }
  }, [editComment]);

  // Фильтруем комментарии по object_id и content_type
  const filteredComments = useMemo(() => {
    return rescheduleComments.filter(
      (comment) => comment.object_id === object_id && comment.content_type === content_type,
    );
  }, [rescheduleComments, object_id, content_type]);

  const sortedComments = useMemo(
    () =>
      [...filteredComments].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      ),
    [filteredComments],
  );

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
        // Режим редактирования
        const result = await dispatch(
          updateRescheduleCommentRequest({ id: editComment.id, data: formData }),
        ).unwrap();
        setFormData(initialCommentFormData);
        setErrors({});
        onClose();
        addSnackbar(
          SnackbarType.success,
          `Комментарий о переносе срока к ${getEntityName()} № ${result.object_id} успешно обновлен`,
        );
      } else {
        // Режим добавления нового комментария
        const result = await dispatch(createRescheduleCommentRequest(formData)).unwrap();

        // Обновляем список комментариев после успешного создания
        if (object_id) {
          dispatch(fetchInconsistencyRescheduleComments(object_id));
        }

        setFormData({
          ...initialCommentFormData,
          content_type,
          object_id: object_id || 0,
        });
        setErrors({});
        addSnackbar(
          SnackbarType.success,
          `Комментарий о переносе срока успешно добавлен к ${getEntityName()} № ${result.object_id}`,
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при отправке комментария";
      setErrors({ submit: errorMessage });
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const handleEditClick = (comment: RescheduleCommentResponseGET) => {
    setEditingComment(comment);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (commentId: number) => {
    try {
      await dispatch(deleteRescheduleCommentRequest(commentId)).unwrap();
      addSnackbar(SnackbarType.success, `Комментарий о переносе срока успешно удалён`);
      // Перезагружаем комментарии после удаления
      if (object_id) {
        dispatch(fetchInconsistencyRescheduleComments(object_id));
      }
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

  const isEditing = !!editComment;

  // Если это отдельное модальное окно для редактирования
  if (isEditing) {
    return (
      <ModalComponent isOpen={isOpen} onClose={handleClose}>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <h3>Редактировать комментарий о переносе срока</h3>
          {errors.submit && <p className={styles.submitError}>{errors.submit}</p>}
          {rescheduleCommentError && <p className={styles.submitError}>{rescheduleCommentError}</p>}

          <select
            name="comment_author"
            id="comment_author"
            value={formData.comment_author}
            onChange={handleChange}
            disabled={rescheduleCommentLoading}
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
            placeholder="Причина переноса срока"
            rows={10}
            value={formData.comment_text}
            onChange={handleChange}
            className={styles.div_area}
            disabled={rescheduleCommentLoading}
          />
          {errors.comment_text && <p className={styles.submitError}>{errors.comment_text}</p>}

          {/* Дополнительные поля для дат */}
          {formData.old_date && (
            <div>
              <p>Предыдущая дата: {formatDateTime(formData.old_date)}</p>
            </div>
          )}
          {formData.new_date && (
            <div>
              <p>Новая дата: {formatDateTime(formData.new_date)}</p>
            </div>
          )}

          <div className={styles.buttonsBlock}>
            <button type="submit" disabled={rescheduleCommentLoading}>
              {rescheduleCommentLoading ? "Сохранение..." : "Сохранить и закрыть"}
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
              История переноса сроков для {getEntityName()} № {object_id}
            </h3>

            {rescheduleCommentLoading ? (
              <div className="loader"></div>
            ) : rescheduleCommentError ? (
              <div className={styles.error}>Ошибка: {rescheduleCommentError}</div>
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
                      {comment.old_date && comment.new_date && (
                        <p className={styles.dateChange}>
                          <b>Изменение даты:</b> с {formatDateTime(comment.old_date)} на{" "}
                          {formatDateTime(comment.new_date)}
                        </p>
                      )}
                      {comment.action_type && (
                        <p>
                          <b>Действие:</b>{" "}
                          {comment.action_type === "correction"
                            ? "Коррекция"
                            : comment.action_type === "corrective_action"
                              ? "Корректирующее действие"
                              : "Решение"}
                          {comment.action_index !== null && ` #${comment.action_index + 1}`}
                        </p>
                      )}
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
              <div className={styles.noComments}>
                Нет комментариев о переносе сроков для отображения.
              </div>
            )}
          </div>

          <div ref={formSectionRef} className={styles.formSection}>
            <form className={styles.modalForm} onSubmit={handleSubmit}>
              {errors.submit && <p className={styles.submitError}>{errors.submit}</p>}
              {rescheduleCommentError && (
                <p className={styles.submitError}>{rescheduleCommentError}</p>
              )}

              <select
                name="comment_author"
                id="comment_author"
                value={formData.comment_author}
                onChange={handleChange}
                disabled={rescheduleCommentLoading}
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
                placeholder="Причина переноса срока"
                rows={6}
                value={formData.comment_text}
                onChange={handleChange}
                className={styles.div_area}
                disabled={rescheduleCommentLoading}
              />
              {errors.comment_text && <p className={styles.submitError}>{errors.comment_text}</p>}

              <div className={styles.buttonsBlock}>
                <button type="submit" disabled={rescheduleCommentLoading}>
                  {rescheduleCommentLoading ? "Сохранение..." : "Добавить комментарий о переносе"}
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
        <RescheduleCommentsAdderModal
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

export default React.memo(RescheduleCommentsAdderModal);
