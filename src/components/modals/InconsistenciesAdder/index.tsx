import styles from "./styles.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InconsistenciesModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h4>Заполните форму для внесения несоответствия в Реестр</h4>
        <p>
          Номер несоответствия: <b>1169</b>
        </p>
        <form className={styles.modalForm}>
          <div className={styles.modalInternalBlocks}>
            <p>1. Основная информация о несоответствии</p>
            <select>
              <option value="">...выбрать нормативный документ из базы</option>
              <option value="">А1</option>
              <option value="">А2 </option>
              <option value="">А3</option>
              <option value="">А4</option>
              <option value="">...</option>
              <option value="">А14</option>
            </select>
            <a href="#">Добавить НД</a>
            <input type="text" placeholder="...номер пункта нормативного документа|" name="point" />
            <textarea placeholder="Описание несоответствия|" rows={10} />
            <input type="text" placeholder="Источник информации о несоответствии|" name="point" />
            <input type="date" title="Выберите дату утверждения источника" />
          </div>

          <div className={styles.modalInternalBlocks}>
            <p>2. Анализ причин несоответствия</p>
            <div className={styles.oneLineText}>
              <input type="date" title="Выберите дату начала проведения анализа" />
              <input type="date" title="Выберите дату окончания проведения анализа" />
            </div>

            <select>
              <option value="">...выбрать главного аудитора из базы</option>
              <option value="">Разумнева Н.П.</option>
            </select>

            <select>
              <option value="">...выбрать аудитора из базы</option>
              <option value="">Алтаева О.Ю.</option>
              <option value="">Ткачук Н.С.</option>
              <option value="">Морозова Е.</option>
              <option value="">Зюзева Е.</option>
            </select>
            <a href="#">Добавить аудитора</a>
            <textarea
              placeholder="Причины несоответствия, определенные по результатам анализа|"
              rows={10}
            />
          </div>

          <div className={styles.modalInternalBlocks}>
            <div className={styles.oneLineText}>
              <p>3. Коррекция</p>
              <a href="#">Добавить коррекцию</a>
            </div>
            <textarea placeholder="Описание коррекции|" rows={10} />
            <div className={styles.oneLineText}>
              <input type="date" title="Выберите дату внедрения коррекции" />
              <a href="#">Сменить на текстовое поле</a>
            </div>

            <select>
              <option value="">...выбрать ответственное лицо из базы</option>
              <option value="">Матвеева М.А.</option>
              <option value="">Семенов К.С.</option>
              <option value="">...</option>
              <option value="">Курженков С.А.</option>
            </select>
            <a href="#">Добавить ответственное лицо</a>

            <select>
              <option value="">...выбрать ответственное подразделение из базы</option>
              <option value="">НПО</option>
              <option value="">НПГС</option>
              <option value="">...</option>
              <option value="">ПП ФЭИС</option>
            </select>
            <a href="#">Добавить ответственное подразделение</a>
          </div>

          <div className={styles.modalInternalBlocks}>
            <div className={styles.oneLineText}>
              <p>4. Корректирующее действие</p>
              <a href="#">Добавить кор. действие</a>
            </div>
            <textarea placeholder="Описание корректирующего действия||" rows={10} />
            <div className={styles.oneLineText}>
              <input type="date" title="Выберите дату внедрения корректирующего действия" />
              <a href="#">Сменить на текстовое поле</a>
            </div>

            <select>
              <option value="">...выбрать ответственное лицо из базы</option>
              <option value="">Матвеева М.А.</option>
              <option value="">Семенов К.С.</option>
              <option value="">...</option>
              <option value="">Курженков С.А.</option>
            </select>
            <a href="#">Добавить ответственное лицо</a>

            <select>
              <option value="">...выбрать ответственное подразделение из базы</option>
              <option value="">НПО</option>
              <option value="">НПГС</option>
              <option value="">...</option>
              <option value="">ПП ФЭИС</option>
            </select>
            <a href="#">Добавить ответственное подразделение</a>
          </div>
          <div className={styles.buttonsBlock}>
            <button onClick={onClose}>Сохранить</button>
            <button onClick={onClose}>Закрыть</button>
          </div>
        </form>
      </div>
    </div>
  );
};
