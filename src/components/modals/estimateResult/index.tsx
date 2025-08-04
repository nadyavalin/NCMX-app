import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { toggleModalComments } from "../../../store/numSlice";

import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";
import { InconsistenciesCommentsModal } from "../commentsAdder";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesEstimateResultModal = ({ isOpen, onClose }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentInconsistencyNumber, isModalCommentsOpen } = useSelector(
    (state: RootState) => state.num,
  );
  const [estimate, setEstimate] = useState<string>("");

  const handleEstimateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEstimate(event.target.value);
  };

  const handleOpenCommentsModal = () => {
    if (currentInconsistencyNumber !== null) {
      dispatch(toggleModalComments(true));
    }
  };

  const handleCloseCommentsModal = () => {
    dispatch(toggleModalComments(false));
  };

  return (
    <>
      <ModalComponent isOpen={isOpen} onClose={onClose}>
        <form className={styles.modalForm}>
          <h3>Выберите оценку результативности несоответствия</h3>
          <select name="resp_person_nonconf_closure" id="resp_person_nonconf_closure">
            <option value="">Разумнева Н.П.</option>
          </select>
          <select name="estimate" id="estimate" value={estimate} onChange={handleEstimateChange}>
            <option value="удовлетворительно">удовлетворительно</option>
            <option value="неудовлетворительно">неудовлетворительно</option>
          </select>
          {estimate === "неудовлетворительно" && (
            <div className={styles.inconsistenciesActions}>
              <a href="#" onClick={handleOpenCommentsModal}>
                Добавить комментарий
              </a>
            </div>
          )}
          <div className={styles.buttonsBlock}>
            <button onClick={onClose}>Сохранить и закрыть</button>
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
