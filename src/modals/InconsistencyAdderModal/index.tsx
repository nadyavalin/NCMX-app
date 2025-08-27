import styles from "./styles.module.css";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isAxiosError } from "axios";
import { createInconsistencyRequest, updateInconsistencyRequest } from "@/api";
import { AppDispatch, RootState } from "@store/store";
import { ItemRequestPOST, ItemResponseGET, SnackbarType } from "@appTypes/types";
import { useFormValidation } from "@hooks/useFormValidation";
import { useSnackbar } from "@components/Snackbars/snackbarContext";
import { Auditors } from "@components/lists/listsForInconsistencyAdder/Auditorss";
import { NormativeDocuments } from "@components/lists/listsForInconsistencyAdder/NormativeDocumentss";
import ResponsibleGroup from "@components/lists/listsForInconsistencyAdder/helpers/ResponsibleGroup";
import { ModalComponent } from "../ModalComponent";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem: ItemResponseGET | null;
}

const initialFormData: ItemRequestPOST = {
  num_nonconf: 0,
  normative_documents: [{ norm_doc: "", point: "" }],
  nonconf: "",
  report: "",
  report_date: null,
  analysis_start_date: null,
  analysis_finish_date: null,
  head_auditor: "",
  auditors: [{ auditor: "" }],
  reason: "",
  correction: "",
  correction_date: null,
  responsible_for_correction: [{ department: "", person: "" }],
  corrective_action: "",
  corrective_action_date: null,
  responsible_for_corrective_action: [{ department: "", person: "" }],
  estimate: null,
  nonconf_closure_date: null,
  resp_person_nonconf_closure: "",
};

const InconsistencyAdderModal = ({ isOpen, onClose, editItem }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const { createLoading } = useSelector((state: RootState) => state.inconsistencies);
  const [formData, setFormData] = useState<ItemRequestPOST>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const numNonconfRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const { validateForm } = useFormValidation({ formData, numNonconfRef });

  const scrollToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormData({
          num_nonconf: editItem.num_nonconf,
          normative_documents:
            editItem.normative_documents && editItem.normative_documents.length > 0
              ? editItem.normative_documents
              : [{ norm_doc: "", point: "" }],
          nonconf: editItem.nonconf || "",
          report: editItem.report || "",
          report_date: editItem.report_date || null,
          analysis_start_date: editItem.analysis_start_date || null,
          analysis_finish_date: editItem.analysis_finish_date || null,
          head_auditor: editItem.head_auditor || "",
          auditors:
            editItem.auditors && editItem.auditors.length > 0
              ? editItem.auditors
              : [{ auditor: "" }],
          reason: editItem.reason || "",
          correction: editItem.correction || "",
          correction_date: editItem.correction_date || null,
          responsible_for_correction:
            editItem.responsible_for_correction && editItem.responsible_for_correction.length > 0
              ? editItem.responsible_for_correction
              : [{ department: "", person: "" }],
          corrective_action: editItem.corrective_action || "",
          corrective_action_date: editItem.corrective_action_date || null,
          responsible_for_corrective_action:
            editItem.responsible_for_corrective_action &&
            editItem.responsible_for_corrective_action.length > 0
              ? editItem.responsible_for_corrective_action
              : [{ department: "", person: "" }],
          estimate: editItem.estimate || null,
          nonconf_closure_date: editItem.nonconf_closure_date || null,
          resp_person_nonconf_closure: editItem.resp_person_nonconf_closure || "",
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
      setTimeout(() => {
        scrollToTop();
      }, 0);
    }
  }, [isOpen, editItem]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const updatedValue =
      name === "num_nonconf" || name === "estimate"
        ? value
          ? parseInt(value, 10)
          : null
        : [
              "report_date",
              "analysis_start_date",
              "analysis_finish_date",
              "correction_date",
              "corrective_action_date",
              "nonconf_closure_date",
            ].includes(name)
          ? value || null
          : value;
    setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addSnackbar(SnackbarType.error, validationErrors.num_nonconf);
      return;
    }

    const payload = {
      ...formData,
      normative_documents: formData.normative_documents?.filter((doc) => doc.norm_doc) || [],
      auditors: formData.auditors?.filter((person) => person.auditor) || [],
      responsible_for_correction:
        formData.responsible_for_correction?.filter((resp) => resp.department) || [],
      responsible_for_corrective_action:
        formData.responsible_for_corrective_action?.filter((resp) => resp.department) || [],
      is_archived: false,
    } as ItemRequestPOST;

    try {
      if (editItem) {
        const result = await dispatch(
          updateInconsistencyRequest({ num_nonconf: editItem.num_nonconf, data: payload }),
        ).unwrap();
        addSnackbar(
          SnackbarType.success,
          `Несоответствие № ${result.num_nonconf} успешно обновлено`,
        );
      } else {
        const result = await dispatch(createInconsistencyRequest(payload)).unwrap();
        addSnackbar(SnackbarType.success, `Несоответствие № ${result.num_nonconf} успешно создано`);
      }
      setTimeout(() => {
        setFormData(initialFormData);
        setErrors({});
        onClose();
      }, 300);
    } catch (error: unknown) {
      const errorMessage =
        isAxiosError(error) && error.response?.data?.num_nonconf
          ? error.response.data.num_nonconf[0]
          : "Ошибка при сохранении несоответствия";
      setErrors({ num_nonconf: errorMessage });
      addSnackbar(SnackbarType.error, errorMessage);
      if (numNonconfRef.current) {
        numNonconfRef.current.focus();
        numNonconfRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleClose = () => {
    setTimeout(() => {
      setFormData(initialFormData);
      setErrors({});
      onClose();
    }, 300);
  };

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={handleClose}
      additionalClass={styles.modalContentSpec}
      contentRef={modalContentRef}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.modalForm}>
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
                ref={numNonconfRef}
                className={errors.num_nonconf ? styles.inputError : ""}
                disabled={!!editItem}
              />
              {errors.num_nonconf && <p className={styles.submitError}>{errors.num_nonconf}</p>}
            </div>
          </div>

          <div className={styles.modalInternalBlocks}>
            <p>1. Основная информация о несоответствии</p>
            <NormativeDocuments
              normative_documents={formData.normative_documents || [{ norm_doc: "", point: "" }]}
              setFormData={setFormData}
              createLoading={createLoading}
            />
            <textarea
              name="nonconf"
              id="nonconf"
              value={formData.nonconf || ""}
              placeholder="Описание несоответствия"
              rows={10}
              onChange={handleChange}
              disabled={createLoading}
            />
            <input
              name="report"
              id="report"
              type="text"
              value={formData.report || ""}
              placeholder="Источник информации о несоответствии"
              onChange={handleChange}
              disabled={createLoading}
            />
            <input
              type="date"
              name="report_date"
              id="report_date"
              title="Выберите дату утверждения источника"
              value={formData.report_date || ""}
              onChange={handleChange}
              disabled={createLoading}
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
                disabled={createLoading}
              />
              <input
                type="date"
                name="analysis_finish_date"
                id="analysis_finish_date"
                title="Выберите дату окончания проведения анализа"
                value={formData.analysis_finish_date || ""}
                onChange={handleChange}
                disabled={createLoading}
              />
            </div>
            <select
              name="head_auditor"
              id="head_auditor"
              value={formData.head_auditor || ""}
              onChange={handleChange}
              disabled={createLoading}
            >
              <option value="">...выбрать главного аудитора</option>
              <option value="Разумнева Н.П.">Разумнева Н.П.</option>
              <option value="Максютенко М.А.">Максютенко М.А.</option>
              <option value="Погодина С.Б.">Погодина С.Б.</option>
              <option value="Болкунов О.А.">Болкунов О.А.</option>
            </select>
            <Auditors
              auditors={formData.auditors || [{ auditor: "" }]}
              setFormData={setFormData}
              createLoading={createLoading}
            />
            <textarea
              name="reason"
              id="reason"
              value={formData.reason || ""}
              placeholder="Причины несоответствия, определенные по результатам анализа"
              rows={10}
              onChange={handleChange}
              disabled={createLoading}
            />
          </div>

          <div className={styles.modalInternalBlocks}>
            <div className={styles.oneLineText}>
              <p>3. Коррекция</p>
              <a
                href="#"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    correction: prev.correction
                      ? `${prev.correction}\nНовая коррекция`
                      : "Новая коррекция",
                  }))
                }
              >
                Добавить коррекцию
              </a>
            </div>
            <textarea
              name="correction"
              id="correction"
              value={formData.correction || ""}
              placeholder="Описание коррекции"
              rows={10}
              onChange={handleChange}
              disabled={createLoading}
            />
            <div className={styles.oneLineText}>
              <input
                type="date"
                name="correction_date"
                id="correction_date"
                title="Выберите дату внедрения коррекции"
                value={formData.correction_date || ""}
                onChange={handleChange}
                disabled={createLoading}
              />
            </div>
            <ResponsibleGroup
              formData={formData}
              setFormData={setFormData}
              createLoading={createLoading}
              fieldName="responsible_for_correction"
              addText="Добавить ответственного"
            />
          </div>

          <div className={styles.modalInternalBlocks}>
            <div className={styles.oneLineText}>
              <p>4. Корректирующее действие</p>
              <a
                href="#"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    corrective_action: prev.corrective_action
                      ? `${prev.corrective_action}\nНовое действие`
                      : "Новое действие",
                  }))
                }
              >
                Добавить кор. действие
              </a>
            </div>
            <textarea
              name="corrective_action"
              id="corrective_action"
              value={formData.corrective_action || ""}
              placeholder="Описание корректирующего действия"
              rows={10}
              onChange={handleChange}
              disabled={createLoading}
            />
            <div className={styles.oneLineText}>
              <input
                type="date"
                name="corrective_action_date"
                id="corrective_action_date"
                title="Выберите дату внедрения корректирующего действия"
                value={formData.corrective_action_date || ""}
                onChange={handleChange}
                disabled={createLoading}
              />
            </div>
            <ResponsibleGroup
              formData={formData}
              setFormData={setFormData}
              createLoading={createLoading}
              fieldName="responsible_for_corrective_action"
              addText="Добавить ответственного"
            />
          </div>
          <div className={styles.buttonsBlock}>
            <button type="submit" disabled={createLoading}>
              {createLoading ? "Сохранение..." : "Сохранить и закрыть"}
            </button>
          </div>
        </div>
      </form>
    </ModalComponent>
  );
};

export default React.memo(InconsistencyAdderModal);
