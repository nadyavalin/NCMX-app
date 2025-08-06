import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";
import { FormEvent, useEffect, useState } from "react";
import { ItemCommentRequestPOST, ItemCommentResponseGET, SnackbarType } from "@components/types";
import { createCommentInconsistencyRequest, updateCommentInconsistencyRequest } from "@/api/route";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { useSnackbar } from "@components/snackbar/snackbarContext";

interface ModalProps {
  currentInconsistencyNumber: number | null;
  isOpen: boolean;
  onClose: () => void;
  editComment?: ItemCommentResponseGET | null;
}

const initialCommentFormData: ItemCommentRequestPOST = {
  num_nonconf: null,
  comment_author: "",
  comment_text: "",
};

export const InconsistenciesCommentsModal = ({
  currentInconsistencyNumber,
  isOpen,
  onClose,
  editComment,
}: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const { commentLoading, commentError } = useSelector((state: RootState) => state.num);
  const [formData, setFormData] = useState<ItemCommentRequestPOST>(initialCommentFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (editComment) {
        setFormData({
          num_nonconf: editComment.num_nonconf,
          comment_author: editComment.comment_author,
          comment_text: editComment.comment_text,
        });
      } else {
        setFormData({
          num_nonconf: currentInconsistencyNumber,
          comment_author: "",
          comment_text: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, currentInconsistencyNumber, editComment]);

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
    if (formData.num_nonconf === null) {
      newErrors.num_nonconf = "Номер несоответствия обязателен";
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
          updateCommentInconsistencyRequest({ id: editComment.id, data: formData }),
        ).unwrap();
        setFormData(initialCommentFormData);
        setErrors({});
        onClose();
        addSnackbar(
          SnackbarType.success,
          `Комментарий к несоответствию № ${result.num_nonconf} успешно обновлен`,
        );
      } else {
        const result = await dispatch(createCommentInconsistencyRequest(formData)).unwrap();
        setFormData(initialCommentFormData);
        setErrors({});
        onClose();
        addSnackbar(
          SnackbarType.success,
          `Комментарий успешно добавлен к несоответствию № ${result.num_nonconf}`,
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
            : `Внести комментарий к несоответствию № ${currentInconsistencyNumber}`}
        </h3>
        {errors.submit && <p className={styles.submitError}>{errors.submit}</p>}
        {commentError && <p className={styles.submitError}>{commentError}</p>}
        <select
          name="comment_author"
          id="comment_author"
          value={formData.comment_author}
          onChange={handleChange}
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
