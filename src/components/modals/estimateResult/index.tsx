import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { toggleModalEstimateResult } from "../../../store/numSlice";
import {
  updateInconsistencyRequest,
  fetchItems,
  createCommentInconsistencyRequest,
} from "@api/route";
import { SnackbarType } from "@components/types";
import { useSnackbar } from "@components/snackbar/snackbarContext";
import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesEstimateResultModal = ({ isOpen, onClose }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentInconsistencyNumber } = useSelector((state: RootState) => state.num);
  const addSnackbar = useSnackbar();
  const [estimate, setEstimate] = useState<string>("удовлетворительно");
  const [respPerson, setRespPerson] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");

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
    console.log("Submitting form:", {
      currentInconsistencyNumber,
      estimate,
      respPerson,
      isArchived,
      commentText,
    });

    if (!currentInconsistencyNumber) {
      addSnackbar(SnackbarType.error, "Номер несоответствия не указан");
      return;
    }
    if (!respPerson) {
      addSnackbar(SnackbarType.error, "Выберите ответственное лицо");
      return;
    }

    try {
      // Если оценка "неудовлетворительно", создаём комментарий
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
          `Комментарий успешно добавлен к несоответствию №${currentInconsistencyNumber}`,
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

      await dispatch(fetchItems({ is_archived: false })).unwrap();
      await dispatch(fetchItems({ is_archived: true })).unwrap();

      addSnackbar(
        SnackbarType.success,
        isArchived
          ? `Несоответствие №${currentInconsistencyNumber} успешно перенесено в архив`
          : `Несоответствие №${currentInconsistencyNumber} оставлено в таблице`,
      );

      dispatch(toggleModalEstimateResult(false));
      setEstimate("удовлетворительно");
      setRespPerson("");
      setCommentText("");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при обработке несоответствия";
      console.log("Update error:", errorMessage);
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const isButtonsDisabled = estimate === "неудовлетворительно" && !commentText.trim();

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <form className={styles.modalForm}>
        <h3>Выберите оценку результативности несоответствия {currentInconsistencyNumber}</h3>
        <select
          name="resp_person_nonconf_closure"
          id="resp_person_nonconf_closure"
          value={respPerson}
          onChange={handleRespPersonChange}
        >
          <option value="">...выбрать ответственное лицо</option>
          <option value="Разумнева Н.П.">Разумнева Н.П.</option>
        </select>
        <select name="estimate" id="estimate" value={estimate} onChange={handleEstimateChange}>
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
          />
        )}
        <div className={styles.buttonsBlock}>
          {estimate === "удовлетворительно" ? (
            <button type="button" onClick={() => handleSubmit(true)} disabled={!respPerson}>
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
