import styles from "./styles.module.css";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInconsistencyRequest, createCommentInconsistencyRequest } from "@/api";
import { RootState, AppDispatch } from "@store/store";
import { toggleModalEstimateResult } from "@store/uiSlice";
import { useSnackbar } from "@components/Snackbars/snackbarContext";
import { ModalComponent } from "../ModalComponent";
import { SnackbarType } from "@appTypes/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EstimateModal = ({ isOpen, onClose }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentInconsistencyNumber } = useSelector((state: RootState) => state.ui);
  const { commentLoading, commentError } = useSelector((state: RootState) => state.comments);
  const { itemsLoading, itemsError } = useSelector((state: RootState) => state.inconsistencies);
  const addSnackbar = useSnackbar();
  const [estimate, setEstimate] = useState<string>("удовлетворительно");
  const [respPerson, setRespPerson] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentFormState, setCurrentFormState] = useState({
    estimate: "удовлетворительно",
    showCommentField: false,
  });

  const handleEstimateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newEstimate = event.target.value;
    setEstimate(newEstimate);
    setCommentText("");
    setCurrentFormState({
      estimate: newEstimate,
      showCommentField: newEstimate === "неудовлетворительно",
    });
  };

  const handleClose = () => {
    setEstimate("удовлетворительно");
    setRespPerson("");
    setCommentText("");
    setIsSubmitting(false);
    onClose();
    setTimeout(() => {
      setCurrentFormState({
        estimate: "удовлетворительно",
        showCommentField: false,
      });
    }, 300);
  };

  const handleRespPersonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRespPerson(event.target.value);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };

  const handleSubmit = async (isArchived: boolean) => {
    if (!currentInconsistencyNumber) {
      addSnackbar(SnackbarType.error, "Номер несоответствия не указан");
      return;
    }
    if (!respPerson) {
      addSnackbar(SnackbarType.error, "Выберите ответственное лицо");
      return;
    }

    setIsSubmitting(true);
    try {
      if (estimate === "неудовлетворительно" && commentText.trim()) {
        await dispatch(
          createCommentInconsistencyRequest({
            num_nonconf: currentInconsistencyNumber,
            comment_author: respPerson,
            comment_text: commentText,
          }),
        ).unwrap();
        addSnackbar(
          SnackbarType.success,
          `Комментарий успешно добавлен к несоответствию № ${currentInconsistencyNumber}`,
        );
      }

      const closureDate = new Date().toISOString();
      await dispatch(
        updateInconsistencyRequest({
          num_nonconf: currentInconsistencyNumber,
          data: {
            estimate: estimate === "удовлетворительно" ? 1 : 0,
            resp_person_nonconf_closure: respPerson,
            is_archived: isArchived,
            nonconf_closure_date: closureDate,
          },
        }),
      ).unwrap();

      addSnackbar(
        SnackbarType.success,
        isArchived
          ? `Несоответствие № ${currentInconsistencyNumber} успешно перенесено в архив`
          : `Несоответствие № ${currentInconsistencyNumber} оставлено в таблице`,
      );

      setTimeout(() => {
        dispatch(toggleModalEstimateResult(false));
        setEstimate("удовлетворительно");
        setRespPerson("");
        setCommentText("");
        setIsSubmitting(false);
        onClose();
      }, 300);
      handleClose();
    } catch (error: unknown) {
      setIsSubmitting(false);
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при обработке несоответствия";
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const isButtonsDisabled =
    (estimate === "неудовлетворительно" && !commentText.trim()) ||
    isSubmitting ||
    commentLoading ||
    itemsLoading;

  return (
    <ModalComponent isOpen={isOpen} onClose={handleClose}>
      <form className={styles.modalForm}>
        <h3>Выберите оценку результативности несоответствия № {currentInconsistencyNumber}</h3>
        {commentError && <p className={styles.submitError}>{commentError}</p>}
        {itemsError && <p className={styles.submitError}>{itemsError}</p>}
        <select
          name="resp_person_nonconf_closure"
          id="resp_person_nonconf_closure"
          value={respPerson}
          onChange={handleRespPersonChange}
          disabled={isSubmitting || commentLoading || itemsLoading}
        >
          <option value="">...выбрать ответственное лицо</option>
          <option value="Разумнева Н.П.">Разумнева Н.П.</option>
        </select>
        <select
          name="estimate"
          id="estimate"
          value={estimate}
          onChange={handleEstimateChange}
          disabled={isSubmitting || commentLoading || itemsLoading}
        >
          <option value="удовлетворительно">удовлетворительно</option>
          <option value="неудовлетворительно">неудовлетворительно</option>
        </select>
        {currentFormState.showCommentField && (
          <textarea
            name="comment_text"
            id="comment_text"
            placeholder="Введите комментарий"
            rows={10}
            value={commentText}
            onChange={handleCommentChange}
            className={styles.div_area}
            disabled={isSubmitting || commentLoading || itemsLoading}
          />
        )}
        <div className={styles.buttonsBlock}>
          {estimate === "удовлетворительно" ? (
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isButtonsDisabled || !respPerson}
            >
              Перенести в архив
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={isButtonsDisabled || !respPerson}
              >
                Не отправлять в архив
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isButtonsDisabled || !respPerson}
              >
                Перенести в архив
              </button>
            </>
          )}
        </div>
      </form>
    </ModalComponent>
  );
};

export default React.memo(EstimateModal);
