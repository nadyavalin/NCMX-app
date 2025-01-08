import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";
import { FormEvent, useState } from "react";
import { ItemCommentRequestPOST } from "@components/types";
import { sendCommentInconsistencyRequest } from "@api/api";

interface ModalProps {
  currentID: number;
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesCommentsModal = ({ currentID, isOpen, onClose }: ModalProps) => {
  const [formData, setFormData] = useState<ItemCommentRequestPOST>({
    id: currentID,
    comment_date: "0000-00-00",
    comment_author: "",
    comment_text: "",
  });

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
        <input type="date" name="comment_date" id="comment_date" onChange={handleChange} />

        <select name="comment_author" id="comment_author" onChange={handleChange}>
          <option value="">...выбрать автора комментария из базы</option>
          <option value="Алтаева О.Ю.">Алтаева О.Ю.</option>
          <option value="Ткачук Н.С.">Ткачук Н.С.</option>
        </select>

        <textarea
          name="comment_text"
          id="comment_text"
          placeholder="Оставить комментарий|"
          rows={10}
          onChange={handleChange}
        />

        <div className={styles.buttonsBlock}>
          <button type="submit">Сохранить и закрыть</button>
        </div>
      </form>
    </ModalComponent>
  );
};
