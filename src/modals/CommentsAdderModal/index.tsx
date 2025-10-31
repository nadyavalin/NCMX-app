import styles from "./styles.module.css";
import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommentRequest, updateCommentRequest } from "@/api";
import {
  ItemCommentRequestPOST,
  ItemCommentResponseGET,
  SnackbarType,
  CommentContentType,
} from "@appTypes/types";
import { RootState, AppDispatch } from "@store/store";
import { useSnackbar } from "@components/Snackbar/snackbarContext";
import { ModalComponent } from "@modals/ModalComponent";

interface ModalProps {
  content_type: CommentContentType;
  object_id: number | null;
  isOpen: boolean;
  onClose: () => void;
  editComment?: ItemCommentResponseGET | null;
  entityTitle?: string; // Необязательное поле для кастомного заголовка
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
  const { commentLoading, commentError } = useSelector((state: RootState) => state.comments);
  const [formData, setFormData] = useState<ItemCommentRequestPOST>(initialCommentFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  useEffect(() => {
    if (isOpen) {
      if (editComment) {
        setFormData({
          content_type: editComment.content_type,
          object_id: editComment.object_id,
          comment_author: editComment.comment_author,
          comment_text: editComment.comment_text,
        });
      } else {
        setFormData({
          content_type,
          object_id: object_id || 0,
          comment_author: "",
          comment_text: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, content_type, object_id, editComment]);

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
        const result = await dispatch(createCommentRequest(formData)).unwrap();
        setFormData(initialCommentFormData);
        setErrors({});
        onClose();
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

  const handleClose = () => {
    setFormData(initialCommentFormData);
    setErrors({});
    onClose();
  };

  return (
    <ModalComponent isOpen={isOpen} onClose={handleClose}>
      <form className={styles.modalForm} onSubmit={handleSubmit}>
        <h3>
          {editComment
            ? "Редактировать комментарий"
            : `Добавить комментарий к ${getEntityName()} № ${object_id}`}
        </h3>
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
        </div>
      </form>
    </ModalComponent>
  );
};

export default React.memo(CommentsAdderModal);
