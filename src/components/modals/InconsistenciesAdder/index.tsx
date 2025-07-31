import { FormEvent, useEffect, useRef, useState } from "react";
import { ItemRequestPOST, ItemResponseGET, SnackbarType } from "@components/types";
import { createInconsistencyRequest, updateInconsistencyRequest } from "@/api/route";
import styles from "./styles.module.css";
import { ModalComponent } from "../modalComponent";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "@components/snackbar/snackbarContext";
import { isAxiosError } from "axios";
import { AppDispatch, RootState } from "../../../store/store";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem: ItemResponseGET | null;
}

const initialFormData: ItemRequestPOST = {
  num_nonconf: 0,
  norm_doc: "",
  point: "",
  nonconf: "",
  report: "",
  report_date: null,
  analysis_start_date: null,
  analysis_finish_date: null,
  head_auditor: "",
  auditor: "",
  reason: "",
  correction: "",
  correction_date: null,
  resp_person_correction: "",
  department_correction: "",
  corrective_action: "",
  corrective_action_date: null,
  resp_person_corrective_action: "",
  department_corrective_action: "",
  estimate: null,
  nonconf_closure_date: null,
  resp_person_nonconf_closure: "",
};

export const InconsistenciesModal = ({ isOpen, onClose, editItem }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const { createLoading, createError } = useSelector((state: RootState) => state.num);
  const [formData, setFormData] = useState<ItemRequestPOST>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const numNonconfRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormData({
          num_nonconf: editItem.num_nonconf,
          norm_doc: editItem.norm_doc || "",
          point: editItem.point || "",
          nonconf: editItem.nonconf || "",
          report: editItem.report || "",
          report_date: editItem.report_date || null,
          analysis_start_date: editItem.analysis_start_date || null,
          analysis_finish_date: editItem.analysis_finish_date || null,
          head_auditor: editItem.head_auditor || "",
          auditor: editItem.auditor || "",
          reason: editItem.reason || "",
          correction: editItem.correction || "",
          correction_date: editItem.correction_date || null,
          resp_person_correction: editItem.resp_person_correction || "",
          department_correction: editItem.department_correction || "",
          corrective_action: editItem.corrective_action || "",
          corrective_action_date: editItem.corrective_action_date || null,
          resp_person_corrective_action: editItem.resp_person_corrective_action || "",
          department_corrective_action: editItem.department_corrective_action || "",
          estimate: editItem.estimate || null,
          nonconf_closure_date: editItem.nonconf_closure_date || null,
          resp_person_nonconf_closure: editItem.resp_person_nonconf_closure || "",
        });
      } else {
        setFormData(initialFormData);
      }
      // Сбрасываем прокрутку в начало модального окна
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, editItem]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    let updatedValue: string | number | null = value;
    if (name === "num_nonconf" || name === "estimate") {
      updatedValue = value ? parseInt(value, 10) : null;
    } else if (
      [
        "report_date",
        "analysis_start_date",
        "analysis_finish_date",
        "correction_date",
        "corrective_action_date",
        "nonconf_closure_date",
      ].includes(name)
    ) {
      updatedValue = value || null;
    }
    setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.num_nonconf || formData.num_nonconf <= 0) {
      newErrors.num_nonconf = "Укажите номер несоответствия (положительное число)";
      if (numNonconfRef.current) {
        numNonconfRef.current.focus();
        numNonconfRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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

    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value === "" || value === 0 ? null : value,
      ]),
    ) as ItemRequestPOST;

    try {
      if (editItem) {
        // Режим редактирования
        const result = await dispatch(
          updateInconsistencyRequest({ num_nonconf: editItem.num_nonconf, data: payload }),
        ).unwrap();
        addSnackbar(
          SnackbarType.success,
          `Несоответствие №${result.num_nonconf} успешно обновлено`,
        );
      } else {
        // Режим создания
        const result = await dispatch(createInconsistencyRequest(payload)).unwrap();
        addSnackbar(SnackbarType.success, `Несоответствие №${result.num_nonconf} успешно создано`);
      }
      setFormData(initialFormData); // Сбрасываем форму после успешной отправки
      onClose();
    } catch (error: unknown) {
      let errorMessage = "Ошибка при сохранении";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.detail || error.message || "Ошибка сервера";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setErrors({ submit: errorMessage });
      addSnackbar(SnackbarType.error, errorMessage);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData); // Сбрасываем форму при закрытии
    setErrors({});
    onClose();
  };

  return (
    <ModalComponent isOpen={isOpen} onClose={handleClose} additionalClass={styles.modalContentSpec}>
      <div ref={modalContentRef}>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          {errors.submit && <p className={styles.submitError}>{errors.submit}</p>}
          {createError && <p className={styles.submitError}>{createError}</p>}
          <div className={styles.nonConfNumberBlock}>
            <h4>{editItem ? "Редактировать несоответствие" : "Внести новое несоответствие"}</h4>
            <div className={styles.nonConfNumberInputBlock}>
              <label htmlFor="num_nonconf">Номер несоответствия:</label>
              <input
                type="number"
                name="num_nonconf"
                id="num_nonconf"
                value={formData.num_nonconf || ""}
                onChange={handleChange}
                required
                ref={numNonconfRef}
                className={errors.num_nonconf ? styles.inputError : ""}
                disabled={!!editItem}
              />
              {errors.num_nonconf && <p className={styles.submitError}>{errors.num_nonconf}</p>}
            </div>
          </div>

          <div className={styles.modalInternalBlocks}>
            <p>1. Основная информация о несоответствии</p>
            <select
              name="norm_doc"
              id="norm_doc"
              value={formData.norm_doc || ""}
              onChange={handleChange}
            >
              <option value="">...выбрать нормативный документ из базы</option>
              <option value="А1">А1</option>
              <option value="А2">А2</option>
              <option value="А3">А3</option>
              <option value="А4">А4</option>
              <option value="А14">А14</option>
            </select>
            <input
              name="point"
              type="text"
              value={formData.point || ""}
              placeholder="Номер пункта нормативного документа"
              onChange={handleChange}
            />
            <a href="#">Добавить НД</a>
            <textarea
              name="nonconf"
              id="nonconf"
              value={formData.nonconf || ""}
              placeholder="Описание несоответствия"
              rows={10}
              onChange={handleChange}
            />
            <input
              name="report"
              id="report"
              type="text"
              value={formData.report || ""}
              placeholder="Источник информации о несоответствии"
              onChange={handleChange}
            />
            <input
              type="date"
              name="report_date"
              id="report_date"
              title="Выберите дату утверждения источника"
              value={formData.report_date || ""}
              onChange={handleChange}
            />
          </div>

          <div className={styles.modalInternalBlocks}>
            <p>2. Анализ причин несоответствия</p>
            <div className={styles.oneLineText}>
              <input
                type="date"
                name="analysis_start_date"
                id="analysis_start_date"
                title="Выберите дату начала проведения анализа"
                value={formData.analysis_start_date || ""}
                onChange={handleChange}
              />
              <input
                type="date"
                name="analysis_finish_date"
                id="analysis_finish_date"
                title="Выберите дату окончания проведения анализа"
                value={formData.analysis_finish_date || ""}
                onChange={handleChange}
              />
            </div>

            <select
              name="head_auditor"
              id="head_auditor"
              value={formData.head_auditor || ""}
              onChange={handleChange}
            >
              <option value="">...выбрать главного аудитора из базы</option>
              <option value="Разумнева Н.П.">Разумнева Н.П.</option>
            </select>

            <select
              name="auditor"
              id="auditor"
              value={formData.auditor || ""}
              onChange={handleChange}
            >
              <option value="">...выбрать аудитора из базы</option>
              <option value="Алтаева О.Ю.">Алтаева О.Ю.</option>
              <option value="Ткачук Н.С.">Ткачук Н.С.</option>
              <option value="Морозова Е.">Морозова Е.</option>
              <option value="Зюзева Е.">Зюзева Е.</option>
            </select>
            <a href="#">Добавить аудитора</a>
            <textarea
              name="reason"
              id="reason"
              value={formData.reason || ""}
              placeholder="Причины несоответствия, определенные по результатам анализа"
              rows={10}
              onChange={handleChange}
            />
          </div>

          <div className={styles.modalInternalBlocks}>
            <div className={styles.oneLineText}>
              <p>3. Коррекция</p>
              <a href="#">Добавить коррекцию</a>
            </div>
            <textarea
              name="correction"
              id="correction"
              value={formData.correction || ""}
              placeholder="Описание коррекции"
              rows={10}
              onChange={handleChange}
            />
            <div className={styles.oneLineText}>
              <input
                type="date"
                name="correction_date"
                id="correction_date"
                title="Выберите дату внедрения коррекции"
                value={formData.correction_date || ""}
                onChange={handleChange}
              />
            </div>

            <select
              name="resp_person_correction"
              id="resp_person_correction"
              value={formData.resp_person_correction || ""}
              onChange={handleChange}
            >
              <option value="">...выбрать ответственное лицо из базы</option>
              <option value="Матвеева М.А.">Матвеева М.А.</option>
              <option value="Семенов К.С.">Семенов К.С.</option>
              <option value="Курженков С.А.">Курженков С.А.</option>
            </select>
            <a href="#">Добавить ответственное лицо</a>

            <select
              name="department_correction"
              id="department_correction"
              value={formData.department_correction || ""}
              onChange={handleChange}
            >
              <option value="">...выбрать ответственное подразделение из базы</option>
              <option value="НПО">НПО</option>
              <option value="НПГС">НПГС</option>
              <option value="ПП СОК">ПП СОК</option>
              <option value="ПП ФЭИС">ПП ФЭИС</option>
            </select>
            <a href="#">Добавить ответственное подразделение</a>
          </div>

          <div className={styles.modalInternalBlocks}>
            <div className={styles.oneLineText}>
              <p>4. Корректирующее действие</p>
              <a href="#">Добавить кор. действие</a>
            </div>
            <textarea
              name="corrective_action"
              id="corrective_action"
              value={formData.corrective_action || ""}
              placeholder="Описание корректирующего действия"
              rows={10}
              onChange={handleChange}
            />
            <div className={styles.oneLineText}>
              <input
                type="date"
                name="corrective_action_date"
                id="corrective_action_date"
                title="Выберите дату внедрения корректирующего действия"
                value={formData.corrective_action_date || ""}
                onChange={handleChange}
              />
            </div>

            <select
              name="resp_person_corrective_action"
              id="resp_person_corrective_action"
              value={formData.resp_person_corrective_action || ""}
              onChange={handleChange}
            >
              <option value="">...выбрать ответственное лицо из базы</option>
              <option value="Матвеева М.А.">Матвеева М.А.</option>
              <option value="Семенов К.С.">Семенов К.С.</option>
              <option value="Курженков С.А.">Курженков С.А.</option>
            </select>
            <a href="#">Добавить ответственное лицо</a>

            <select
              name="department_corrective_action"
              id="department_corrective_action"
              value={formData.department_corrective_action || ""}
              onChange={handleChange}
            >
              <option value="">...выбрать ответственное подразделение из базы</option>
              <option value="НПО">НПО</option>
              <option value="НПГС">НПГС</option>
              <option value="ПП СОК">ПП СОК</option>
              <option value="ПП ФЭИС">ПП ФЭИС</option>
            </select>
            <a href="#">Добавить ответственное подразделение</a>
          </div>
          <div className={styles.buttonsBlock}>
            <button type="submit" disabled={createLoading}>
              {createLoading
                ? "Сохранение..."
                : editItem
                  ? "Сохранить изменения"
                  : "Сохранить и закрыть"}
            </button>
          </div>
        </form>
      </div>
    </ModalComponent>
  );
};
