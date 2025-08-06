import styles from "./styles.module.css";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInconsistencyRequest, createCommentInconsistencyRequest } from "@api/route";
import { RootState, AppDispatch } from "@store/store";
import { toggleModalEstimateResult } from "@store/numSlice";
import { useSnackbar } from "@components/snackbar/snackbarContext";
import { ModalComponent } from "../modalComponent";
import { SnackbarType } from "../../types/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InconsistenciesEstimateResultModal = ({ isOpen, onClose }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentInconsistencyNumber } = useSelector((state: RootState) => state.num);
  const addSnackbar = useSnackbar();
  const [estimate, setEstimate] = useState<string>("удовлетворительно");
  const [respPerson, setRespPerson] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleEstimateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEstimate(event.target.value);
    setCommentText(""); // Сбрасываем комментарий при смене оценки
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
      // Если оценка "неудовлетворительно" и есть комментарий, создаём его
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
    } catch (error: unknown) {
      setIsSubmitting(false);
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при обработке несоответствия";
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const isButtonsDisabled =
    (estimate === "неудовлетворительно" && !commentText.trim()) || isSubmitting;

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <form className={styles.modalForm}>
        <h3>Выберите оценку результативности несоответствия № {currentInconsistencyNumber}</h3>
        <select
          name="resp_person_nonconf_closure"
          id="resp_person_nonconf_closure"
          value={respPerson}
          onChange={handleRespPersonChange}
          disabled={isSubmitting}
        >
          <option value="">...выбрать ответственное лицо</option>
          <option value="Разумнева Н.П.">Разумнева Н.П.</option>
        </select>
        <select
          name="estimate"
          id="estimate"
          value={estimate}
          onChange={handleEstimateChange}
          disabled={isSubmitting}
        >
          <option value="удовлетворительно">удовлетворительно</option>
          <option value="неудовлетворительно">неудовлетворительно</option>
        </select>
        {estimate === "неудовлетворительно" && (
          <textarea
            name="comment_text"
            id="comment_text"
            placeholder="Введите комментарий"
            rows={10}
            value={commentText}
            onChange={handleCommentChange}
            className={styles.div_area}
            disabled={isSubmitting}
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

export default React.memo(InconsistenciesEstimateResultModal);
