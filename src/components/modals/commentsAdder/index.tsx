import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";
import { FormEvent, useEffect, useState } from "react";
import { ItemCommentRequestPOST } from "@components/types";
import { sendCommentInconsistencyRequest } from "@api/api";

interface ModalProps {
  currentInconsistencyNumber: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesCommentsModal = ({
  currentInconsistencyNumber,
  isOpen,
  onClose,
}: ModalProps) => {
  const [formData, setFormData] = useState<ItemCommentRequestPOST>({
    num_nonconf: null,
    comment_author: "",
    comment_text: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData((prevData) => ({
        ...prevData,
        num_nonconf: currentInconsistencyNumber,
      }));
    }
  }, [isOpen, currentInconsistencyNumber]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.num_nonconf === null) {
      console.error("Inconsistency number should not be null");
      return;
    }

    try {
      const result = await sendCommentInconsistencyRequest(formData);
      console.log("Success: ", result);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error during API call: ", error);
    }
  };

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <form className={styles.modalForm} onSubmit={handleSubmit}>
        <h3>Заполните форму для внесения комментария к несоответствию</h3>
        <select
          name="comment_author"
          id="comment_author"
          value={formData.comment_author}
          onChange={handleChange}
        >
          <option value="">...выбрать автора комментария из базы</option>
          <option value="Алтаева О.Ю.">Алтаева О.Ю.</option>
          <option value="Ткачук Н.С.">Ткачук Н.С.</option>
        </select>

        <textarea
          name="comment_text"
          id="comment_text"
          placeholder="Оставить комментарий|"
          rows={10}
          value={formData.comment_text}
          onChange={handleChange}
        />

        <div className={styles.buttonsBlock}>
          <button type="submit">Сохранить и закрыть</button>
        </div>
      </form>
    </ModalComponent>
  );
};
