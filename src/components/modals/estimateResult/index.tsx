import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { toggleModalComments, toggleModalEstimateResult } from "../../../store/numSlice";
import { updateInconsistencyRequest } from "@api/route";
import { InconsistenciesCommentsModal } from "../commentsAdder";
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
  const { currentInconsistencyNumber, isModalCommentsOpen } = useSelector(
    (state: RootState) => state.num,
  );
  const addSnackbar = useSnackbar();
  const [estimate, setEstimate] = useState<string>("удовлетворительно");
  const [respPerson, setRespPerson] = useState<string>("");

  const handleEstimateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEstimate(event.target.value);
  };

  const handleRespPersonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRespPerson(event.target.value);
  };

  const handleOpenCommentsModal = () => {
    if (currentInconsistencyNumber !== null) {
      dispatch(toggleModalComments(true));
      dispatch(toggleModalEstimateResult(false));
    }
  };

  const handleCloseCommentsModal = () => {
    dispatch(toggleModalComments(false));
    setEstimate("удовлетворительно");
    setRespPerson("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting form:", { currentInconsistencyNumber, estimate, respPerson }); // Лог для отладки
    if (!currentInconsistencyNumber) {
      addSnackbar(SnackbarType.error, "Номер несоответствия не указан");
      return;
    }
    if (!respPerson) {
      addSnackbar(SnackbarType.error, "Выберите ответственное лицо");
      return;
    }

    if (estimate === "удовлетворительно") {
      try {
        await dispatch(
          updateInconsistencyRequest({
            num_nonconf: currentInconsistencyNumber,
            data: {
              estimate: 1,
              resp_person_nonconf_closure: respPerson,
              is_archived: true,
            },
          }),
        ).unwrap();
        addSnackbar(
          SnackbarType.success,
          `Несоответствие №${currentInconsistencyNumber} успешно перенесено в архив`,
        );
        dispatch(toggleModalEstimateResult(false));
        setEstimate("удовлетворительно");
        setRespPerson("");
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка при переносе в архив";
        addSnackbar(SnackbarType.error, errorMessage);
      }
    } else {
      handleOpenCommentsModal();
    }
  };

  return (
    <>
      <ModalComponent isOpen={isOpen} onClose={onClose}>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
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
          <div className={styles.buttonsBlock}>
            <button type="submit">
              {estimate === "неудовлетворительно" ? "Оставить комментарий" : "Сохранить и закрыть"}
            </button>
          </div>
        </form>
      </ModalComponent>
      <InconsistenciesCommentsModal
        currentInconsistencyNumber={currentInconsistencyNumber}
        isOpen={isModalCommentsOpen}
        onClose={handleCloseCommentsModal}
      />
    </>
  );
};
