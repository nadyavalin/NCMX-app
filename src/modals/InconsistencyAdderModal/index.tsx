import styles from "./styles.module.css";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isAxiosError } from "axios";
import { createInconsistencyRequest, updateInconsistencyRequest } from "@/api";
import { AppDispatch, RootState } from "@store/store";
import {
  Correction,
  CorrectiveAction,
  InconsistencyRequestPOST,
  InconsistencyResponseGET,
  SnackbarType,
} from "@appTypes/types";
import { useInconsistencyFormValidation } from "@hooks/useInconsistencyFormValidation";
import { useSnackbar } from "@components/Snackbar/snackbarContext";
import { Auditors } from "@components/lists/listsForInconsistencyAdder/Auditors";
import { NormativeDocumentsForInconsistency } from "@components/lists/listsForInconsistencyAdder/NormativeDocuments/forInconsistency";
import { ModalComponent } from "@modals/ModalComponent";
import { ResponsibleGroupForInconsistency } from "@components/lists/listsForInconsistencyAdder/helpers/ResponsibleGroups/forInconsistency";
import { DynamicListForInconsistency } from "@components/lists/listsForInconsistencyAdder/helpers/DynamicList/forInconsistency";

type FieldName = keyof InconsistencyRequestPOST | keyof Correction | keyof CorrectiveAction;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem: InconsistencyResponseGET | null;
}

const initialFormData: InconsistencyRequestPOST = {
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
  corrections: [
    {
      correction: "",
      correction_date: null,
      responsible_for_correction: [{ department: "", person: "" }],
    },
  ],
  corrective_actions: [
    {
      corrective_action: "",
      corrective_action_date: null,
      responsible_for_corrective_action: [{ department: "", person: "" }],
    },
  ],
  estimate: null,
  nonconf_closure_date: null,
  resp_person_nonconf_closure: "",
};

const InconsistencyAdderModal = ({ isOpen, onClose, editItem }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const { createLoading } = useSelector((state: RootState) => state.inconsistencies);
  const [formData, setFormData] = useState<InconsistencyRequestPOST>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const numNonconfRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const { validateForm } = useInconsistencyFormValidation({ formData, numNonconfRef });

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
          num_nonconf: editItem.num_nonconf || 0,
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
          corrections:
            editItem.corrections && editItem.corrections.length > 0
              ? editItem.corrections.map((corr) => ({
                  correction: corr.correction || "",
                  correction_date: corr.correction_date || null,
                  responsible_for_correction:
                    corr.responsible_for_correction && corr.responsible_for_correction.length > 0
                      ? corr.responsible_for_correction
                      : [{ department: "", person: "" }],
                }))
              : [
                  {
                    correction: "",
                    correction_date: null,
                    responsible_for_correction: [{ department: "", person: "" }],
                  },
                ],
          corrective_actions:
            editItem.corrective_actions && editItem.corrective_actions.length > 0
              ? editItem.corrective_actions.map((act) => ({
                  corrective_action: act.corrective_action || "",
                  corrective_action_date: act.corrective_action_date || null,
                  responsible_for_corrective_action:
                    act.responsible_for_corrective_action &&
                    act.responsible_for_corrective_action.length > 0
                      ? act.responsible_for_corrective_action
                      : [{ department: "", person: "" }],
                }))
              : [
                  {
                    corrective_action: "",
                    corrective_action_date: null,
                    responsible_for_corrective_action: [{ department: "", person: "" }],
                  },
                ],
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

  const handleTopLevelChange = (
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
              "nonconf_closure_date",
            ].includes(name)
          ? value || null
          : value;
    setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const renderCorrection = (
    item: Correction,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
      index: number,
      fieldName: FieldName,
    ) => void,
    createLoading: boolean,
    fieldName: FieldName,
  ) => {
    const sectionNumber = formData.corrections?.length === 1 ? "3" : `3.${index + 1}`;
    return (
      <div className={styles.modalInternalBlocks}>
        <div className={styles.internalBlocks}>
          <div className={styles.oneLineText}>
            <p>{sectionNumber}. Коррекция</p>
          </div>
          <textarea
            name="correction"
            id={`correction_${index}`}
            value={item.correction || ""}
            placeholder="Описание коррекции"
            rows={10}
            onChange={(e) => handleChange(e, index, fieldName)}
            disabled={createLoading}
          />
          <div className={styles.oneLineText}>
            <input
              type="date"
              name="correction_date"
              id={`correction_date_${index}`}
              title="Выберите дату внедрения коррекции"
              value={item.correction_date || ""}
              onChange={(e) => handleChange(e, index, fieldName)}
              disabled={createLoading}
            />
          </div>
          <ResponsibleGroupForInconsistency
            formData={formData}
            setFormData={setFormData}
            createLoading={createLoading}
            fieldName="corrections"
            addText="Добавить ответственного"
            correctionIndex={index}
          />
        </div>
      </div>
    );
  };

  const renderCorrectiveAction = (
    item: CorrectiveAction,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
      index: number,
      fieldName: FieldName,
    ) => void,
    createLoading: boolean,
    fieldName: FieldName,
  ) => {
    const sectionNumber = formData.corrective_actions?.length === 1 ? "4" : `4.${index + 1}`;
    return (
      <div className={styles.modalInternalBlocks}>
        <div className={styles.internalBlocks}>
          <div className={styles.oneLineText}>
            <p>{sectionNumber}. Корректирующее действие</p>
          </div>
          <textarea
            name="corrective_action"
            id={`corrective_action_${index}`}
            value={item.corrective_action || ""}
            placeholder="Описание корректирующего действия"
            rows={10}
            onChange={(e) => handleChange(e, index, fieldName)}
            disabled={createLoading}
          />
          <div className={styles.oneLineText}>
            <input
              type="date"
              name="corrective_action_date"
              id={`corrective_action_date_${index}`}
              title="Выберите дату внедрения корректирующего действия"
              value={item.corrective_action_date || ""}
              onChange={(e) => handleChange(e, index, fieldName)}
              disabled={createLoading}
            />
          </div>
          <ResponsibleGroupForInconsistency
            formData={formData}
            setFormData={setFormData}
            createLoading={createLoading}
            fieldName="corrective_actions"
            addText="Добавить ответственного"
            correctionIndex={index}
          />
        </div>
      </div>
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addSnackbar(
        SnackbarType.error,
        validationErrors.num_nonconf || validationErrors.form || "Ошибка валидации формы",
      );
      return;
    }

    const payload = {
      ...formData,
      normative_documents:
        formData.normative_documents?.filter((doc) => doc.norm_doc && doc.point) || [],
      auditors: formData.auditors?.filter((person) => person.auditor) || [],
      corrections:
        formData.corrections?.map((corr) => ({
          ...corr,
          correction: corr.correction?.trim() || "",
          correction_date: corr.correction_date
            ? new Date(corr.correction_date).toISOString().split("T")[0]
            : null,
          responsible_for_correction:
            corr.responsible_for_correction?.filter((r) => r.department && r.person) || [],
        })) || [],
      corrective_actions:
        formData.corrective_actions?.map((act) => ({
          ...act,
          corrective_action: act.corrective_action?.trim() || "",
          corrective_action_date: act.corrective_action_date
            ? new Date(act.corrective_action_date).toISOString().split("T")[0]
            : null,
          responsible_for_corrective_action:
            act.responsible_for_corrective_action?.filter((r) => r.department && r.person) || [],
        })) || [],
      is_archived: false,
    } as InconsistencyRequestPOST;

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
      console.error("Error during submit:", error);
      const errorMessage =
        isAxiosError(error) && error.response?.data
          ? Object.values(error.response.data).join(", ")
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
            <h4>{editItem ? "Редактировать несоответствие" : "Добавить новое несоответствие"}</h4>
            <div className={styles.nonConfNumberInputBlock}>
              <label htmlFor="num_nonconf">Номер несоответствия:</label>
              <input
                type="number"
                name="num_nonconf"
                id="num_nonconf"
                value={formData.num_nonconf || ""}
                onChange={handleTopLevelChange}
                ref={numNonconfRef}
                className={errors.num_nonconf ? styles.inputError : ""}
                disabled={!!editItem}
              />
              {errors.num_nonconf && <p className={styles.submitError}>{errors.num_nonconf}</p>}
            </div>
          </div>

          <div className={styles.modalInternalBlocks}>
            <p>1. Основная информация о несоответствии</p>
            <NormativeDocumentsForInconsistency
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
              onChange={handleTopLevelChange}
              disabled={createLoading}
            />
            <input
              name="report"
              id="report"
              type="text"
              value={formData.report || ""}
              placeholder="Источник информации о несоответствии"
              onChange={handleTopLevelChange}
              disabled={createLoading}
            />
            <input
              type="date"
              name="report_date"
              id="report_date"
              title="Выберите дату утверждения источника"
              value={formData.report_date || ""}
              onChange={handleTopLevelChange}
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
                onChange={handleTopLevelChange}
                disabled={createLoading}
              />
              <input
                type="date"
                name="analysis_finish_date"
                id="analysis_finish_date"
                title="Выберите дату окончания проведения анализа"
                value={formData.analysis_finish_date || ""}
                onChange={handleTopLevelChange}
                disabled={createLoading}
              />
            </div>
            <select
              name="head_auditor"
              id="head_auditor"
              value={formData.head_auditor || ""}
              onChange={handleTopLevelChange}
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
              onChange={handleTopLevelChange}
              disabled={createLoading}
            />
          </div>

          <div className={styles.modalInternalBlocks}>
            <DynamicListForInconsistency
              items={formData.corrections || []}
              setFormData={setFormData}
              createLoading={createLoading}
              fieldName="corrections"
              renderItem={renderCorrection}
              addItemText="Добавить коррекцию"
              newItem={{
                correction: "",
                correction_date: null,
                responsible_for_correction: [{ department: "", person: "" }],
              }}
              minItems={1}
              listBlockClassName={styles.listCorrectionBlock}
            />
          </div>
          <div className={styles.modalInternalBlocks}>
            <DynamicListForInconsistency
              items={formData.corrective_actions || []}
              setFormData={setFormData}
              createLoading={createLoading}
              fieldName="corrective_actions"
              renderItem={renderCorrectiveAction}
              addItemText="Добавить корр. действие"
              newItem={{
                corrective_action: "",
                corrective_action_date: null,
                responsible_for_corrective_action: [{ department: "", person: "" }],
              }}
              minItems={1}
              listBlockClassName={styles.listCorrectiveActionBlock}
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
