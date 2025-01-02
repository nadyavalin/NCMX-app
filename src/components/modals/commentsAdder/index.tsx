import styles from "./styles.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesCommentsModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <form className={styles.modalForm}>
          <input type="date" name="comment_date" id="comment_date" />

          <select name="comment_author" id="comment_author">
            <option value="">...выбрать автора комментария из базы</option>
            <option value="">Алтаева О.Ю.</option>
            <option value="">Ткачук Н.С.</option>
          </select>

          <textarea
            name="comment_text"
            id="comment_text"
            placeholder="Оставить комментарий|"
            rows={10}
          />

          <div className={styles.buttonsBlock}>
            <button onClick={onClose}>Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};
