import styles from "./styles.module.css";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isAxiosError } from "axios";
import { createObservationRequest, updateObservationRequest } from "@/api";
import { AppDispatch, RootState } from "@store/store";
import {
  Solution,
  ObservationRequestPOST,
  ObservationResponseGET,
  SnackbarType,
} from "@appTypes/types";
import { useObservationFormValidation } from "@hooks/useObservationFormValidation";
import { useSnackbar } from "@components/Snackbar/snackbarContext";
import { ModalComponent } from "@modals/ModalComponent";
import { DynamicListForObservation } from "@components/lists/listsForModals/helpers/DynamicList/forObservation";
import { ResponsibleGroupForObservation } from "@components/lists/listsForModals/helpers/ResponsibleGroups/forObservation";
import { NormativeDocumentsForObservation } from "@components/lists/listsForModals/NormativeDocuments/forObservation";

type FieldName = keyof ObservationRequestPOST | keyof Solution;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem: ObservationResponseGET | null;
}

const initialFormData: ObservationRequestPOST = {
  num_observation: 0,
  normative_documents: [{ norm_doc: "", point: "" }],
  observation: "",
  report: "",
  report_date: null,
  analysis_start_date: null,
  analysis_finish_date: null,
  solutions: [
    {
      solution: "",
      solution_date: null,
      responsible_for_solution: [{ department: "", person: "" }],
    },
  ],
  observation_closure_date: null,
  resp_person_observation_closure: "",
};

const ObservationAdderModal = ({ isOpen, onClose, editItem }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const { createLoading } = useSelector((state: RootState) => state.observations);
  const [formData, setFormData] = useState<ObservationRequestPOST>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const numObservationRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const { validateForm } = useObservationFormValidation({ formData, numObservationRef });

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
          num_observation: editItem.num_observation || 0,
          normative_documents:
            editItem.normative_documents && editItem.normative_documents.length > 0
              ? editItem.normative_documents
              : [{ norm_doc: "", point: "" }],
          observation: editItem.observation || "",
          report: editItem.report || "",
          report_date: editItem.report_date || null,
          analysis_start_date: editItem.analysis_start_date || null,
          analysis_finish_date: editItem.analysis_finish_date || null,
          solutions:
            editItem.solutions.length > 0
              ? editItem.solutions.map((sol) => ({
                  solution: sol.solution || "",
                  solution_date: sol.solution_date || null,
                  responsible_for_solution:
                    sol.responsible_for_solution.length > 0
                      ? sol.responsible_for_solution
                      : [{ department: "", person: "" }],
                }))
              : [
                  {
                    solution: "",
                    solution_date: null,
                    responsible_for_solution: [{ department: "", person: "" }],
                  },
                ],
          observation_closure_date: editItem.observation_closure_date || null,
          resp_person_observation_closure: editItem.resp_person_observation_closure || "",
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
    const dateFields = [
      "report_date",
      "analysis_start_date",
      "analysis_finish_date",
      "observation_closure_date",
    ];

    const updatedValue = dateFields.includes(name) ? value || null : value;

    setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const renderSolution = (
    item: Solution,
    index: number,
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
      index: number,
      fieldName: FieldName,
    ) => void,
    createLoading: boolean,
    fieldName: FieldName,
  ) => {
    const sectionNumber = formData.solutions?.length === 1 ? "2" : `2.${index + 1}`;
    return (
      <div className={styles.modalInternalBlocks}>
        <div className={styles.internalBlocks}>
          <div className={styles.oneLineText}>
            <p>{sectionNumber}. Решение</p>
          </div>
          <textarea
            name="solution"
            id={`solution_${index}`}
            value={item.solution || ""}
            placeholder="Описание решения"
            rows={10}
            onChange={(e) => handleChange(e, index, fieldName)}
            disabled={createLoading}
          />
          <div className={styles.dateLine}>
            <label htmlFor="solution_date">Срок выполнения:</label>
            <input
              type="date"
              name="solution_date"
              id={`solution_date_${index}`}
              title="Выберите дату внедрения решения"
              value={item.solution_date || ""}
              onChange={(e) => handleChange(e, index, fieldName)}
              disabled={createLoading}
            />
          </div>
          <ResponsibleGroupForObservation
            formData={formData}
            setFormData={setFormData}
            createLoading={createLoading}
            fieldName="solutions"
            addText="Добавить ответственного"
            solutionIndex={index}
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
        validationErrors.num_observation || validationErrors.form || "Ошибка валидации формы",
      );
      return;
    }

    const payload = {
      ...formData,
      normative_documents:
        formData.normative_documents?.filter((doc) => doc.norm_doc && doc.point) || [],

      solutions:
        formData.solutions?.map((sol) => ({
          ...sol,
          solution: sol.solution?.trim() || "",
          solution_date: sol.solution_date
            ? new Date(sol.solution_date).toISOString().split("T")[0]
            : null,
          responsible_for_solution:
            sol.responsible_for_solution?.filter((r) => r.department && r.person) || [],
        })) || [],
      is_archived: false,
    } as ObservationRequestPOST;

    try {
      if (editItem) {
        const result = await dispatch(
          updateObservationRequest({ num_observation: editItem.num_observation, data: payload }),
        ).unwrap();
        addSnackbar(
          SnackbarType.success,
          `Наблюдение № ${result.num_observation} успешно обновлено`,
        );
      } else {
        const result = await dispatch(createObservationRequest(payload)).unwrap();
        addSnackbar(SnackbarType.success, `Наблюдение № ${result.num_observation} успешно создано`);
      }
      setTimeout(() => {
        setFormData(initialFormData);
        setErrors({});
        onClose();
      }, 300);
    } catch (error: unknown) {
      const errorMessage =
        isAxiosError(error) && error.response?.data
          ? Object.values(error.response.data).join(", ")
          : "Наблюдение с таким номером уже существует";
      setErrors({ num_observation: errorMessage });
      addSnackbar(SnackbarType.error, errorMessage);
      if (numObservationRef.current) {
        numObservationRef.current.focus();
        numObservationRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
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
          <div className={styles.numberBlock}>
            <h4>{editItem ? "Редактировать наблюдение" : "Добавить новое наблюдение"}</h4>
            <div className={styles.numberInputBlock}>
              <label htmlFor="num_observation">Номер наблюдения: </label>
              <input
                type="number"
                name="num_observation"
                id="num_observation"
                value={formData.num_observation || ""}
                onChange={handleTopLevelChange}
                ref={numObservationRef}
                className={errors.num_observation ? styles.inputError : ""}
                disabled={!!editItem}
                onKeyDown={(e) => {
                  if (["-", ".", "e", "E", "0"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                min="1"
                step="1"
              />
              {errors.num_observation && (
                <p className={styles.submitError}>{errors.num_observation}</p>
              )}
            </div>
          </div>

          <div className={styles.modalInternalBlocks}>
            <p>1. Основная информация о наблюдении</p>
            <NormativeDocumentsForObservation
              normative_documents={formData.normative_documents || [{ norm_doc: "", point: "" }]}
              setFormData={setFormData}
              createLoading={createLoading}
            />
            <textarea
              name="observation"
              id="observation"
              value={formData.observation || ""}
              placeholder="Описание наблюдения"
              rows={10}
              onChange={handleTopLevelChange}
              disabled={createLoading}
              className={errors.observation ? styles.inputError : ""}
            />
            {errors.observation && <p className={styles.submitError}>{errors.observation}</p>}

            <div className={styles.sourceLine}>
              <input
                name="report"
                id="report"
                type="text"
                value={formData.report || ""}
                placeholder="Источник информации о наблюдении"
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
          </div>

          <div className={styles.modalInternalBlocks}>
            <DynamicListForObservation
              items={formData.solutions || []}
              setFormData={setFormData}
              createLoading={createLoading}
              fieldName="solutions"
              renderItem={renderSolution}
              addItemText="Добавить решение"
              newItem={{
                solution: "",
                solution_date: null,
                responsible_for_solution: [{ department: "", person: "" }],
              }}
              minItems={1}
              listBlockClassName={styles.listSolutionBlock}
            />
            {errors.solutions && <p className={styles.submitError}>{errors.solutions}</p>}
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

export default React.memo(ObservationAdderModal);
