import styles from "./styles.module.css";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isAxiosError } from "axios";
import { createImprovementRequest, updateImprovementRequest } from "@/api/improvementsApi";
import { AppDispatch, RootState } from "@store/store";
import { ImprovementRequestPOST, ImprovementResponseGET, SnackbarType } from "@appTypes/types";
import { useSnackbar } from "@components/Snackbar/snackbarContext";
import { ModalComponent } from "@modals/ModalComponent";
import { ResponsiblePairsForImprovement } from "@components/lists/listsForModals/ResponsiblePairs/forImprovement";
import { useImprovementFormValidation } from "@hooks/useImprovementFormValidation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem: ImprovementResponseGET | null;
}

const initialFormData: ImprovementRequestPOST = {
  num_improvement: 0,
  improvement: "",
  report: "",
  report_date: null,
  resp_person_for_improvement_implementation: [{ department: "", person: "" }],
  date_implementation_for_improvement: null,
  improvement_closure_date: null,
  resp_person_improvement_closure: "",
};

const ImprovementAdderModal = ({ isOpen, onClose, editItem }: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addSnackbar = useSnackbar();
  const { createLoading } = useSelector((state: RootState) => state.improvements);
  const [formData, setFormData] = useState<ImprovementRequestPOST>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const numImprovementRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const { validateForm } = useImprovementFormValidation({
    formData,
    numImprovementRef,
  });

  const scrollToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const formatDateForInput = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;

    try {
      return dateString.includes("T") ? dateString.split("T")[0] : dateString;
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormData({
          num_improvement: editItem.num_improvement || 0,
          improvement: editItem.improvement || "",
          report: editItem.report || "",
          report_date: formatDateForInput(editItem.report_date),
          resp_person_for_improvement_implementation:
            editItem.resp_person_for_improvement_implementation &&
            editItem.resp_person_for_improvement_implementation.length > 0
              ? editItem.resp_person_for_improvement_implementation
              : [{ department: "", person: "" }],
          date_implementation_for_improvement: formatDateForInput(
            editItem.date_implementation_for_improvement,
          ),
          improvement_closure_date: formatDateForInput(editItem.improvement_closure_date),
          resp_person_improvement_closure: editItem.resp_person_improvement_closure || "",
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
      "date_implementation_for_improvement",
      "improvement_closure_date",
    ];

    const updatedValue = dateFields.includes(name) ? value || null : value;

    setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.values(validationErrors)[0];
      addSnackbar(SnackbarType.error, firstError);
      return;
    }

    const payload = {
      ...formData,
      improvement: formData.improvement?.trim() || "",
      report: formData.report?.trim() || "",
      report_date: formData.report_date || null,
      date_implementation_for_improvement: formData.date_implementation_for_improvement || null,
      resp_person_for_improvement_implementation:
        formData.resp_person_for_improvement_implementation?.filter(
          (r) => r.department && r.person,
        ) || [],
      is_archived: false,
    } as ImprovementRequestPOST;

    try {
      if (editItem) {
        const result = await dispatch(
          updateImprovementRequest({
            num_improvement: editItem.num_improvement,
            data: payload,
          }),
        ).unwrap();
        addSnackbar(
          SnackbarType.success,
          `Возможность улучшения № ${result.num_improvement} успешно обновлена`,
        );
      } else {
        const result = await dispatch(createImprovementRequest(payload)).unwrap();
        addSnackbar(
          SnackbarType.success,
          `Возможность улучшения № ${result.num_improvement} успешно создана`,
        );
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
          : "Возможность для улучшения с таким номером уже существует";
      setErrors({ num_improvement: errorMessage });
      addSnackbar(SnackbarType.error, errorMessage);
      if (numImprovementRef.current) {
        numImprovementRef.current.focus();
        numImprovementRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
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
            <h4>
              {editItem
                ? "Редактировать возможность улучшения"
                : "Добавить новую возможность улучшения"}
            </h4>
            <div className={styles.numberInputBlock}>
              <label htmlFor="num_improvement">Номер возможности улучшения:</label>
              <input
                type="number"
                name="num_improvement"
                id="num_improvement"
                value={formData.num_improvement || ""}
                onChange={handleTopLevelChange}
                ref={numImprovementRef}
                className={errors.num_improvement ? styles.inputError : ""}
                disabled={!!editItem}
                min="1"
              />
              {errors.num_improvement && (
                <p className={styles.submitError}>{errors.num_improvement}</p>
              )}
            </div>
          </div>

          <div className={styles.modalInternalBlocks}>
            <div className={styles.internalBlock}>
              <p>1. Основная информация о возможности для улучшения</p>
              <textarea
                name="improvement"
                id="improvement"
                value={formData.improvement || ""}
                placeholder="Описание возможности для улучшения"
                rows={10}
                onChange={handleTopLevelChange}
                disabled={createLoading}
                className={errors.improvement ? styles.inputError : ""}
              />
              {errors.improvement && <p className={styles.submitError}>{errors.improvement}</p>}

              <div className={styles.dateLine}>
                <label htmlFor="date_implementation_for_improvement">Срок реализации:</label>
                <input
                  type="date"
                  name="date_implementation_for_improvement"
                  id="date_implementation_for_improvement"
                  title="Выберите дату реализации"
                  value={formData.date_implementation_for_improvement || ""}
                  onChange={handleTopLevelChange}
                  disabled={createLoading}
                  className={errors.date_implementation_for_improvement ? styles.inputError : ""}
                />
              </div>
              {errors.date_implementation_for_improvement && (
                <p className={styles.submitError}>{errors.date_implementation_for_improvement}</p>
              )}
            </div>

            <div className={styles.sourceLine}>
              <input
                name="report"
                id="report"
                type="text"
                value={formData.report || ""}
                placeholder="Источник информации о возможности для улучшения"
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
            <div className={styles.oneLineText}>
              <p>2. Ответственные за реализацию:</p>
            </div>
            <ResponsiblePairsForImprovement
              items={
                formData.resp_person_for_improvement_implementation || [
                  { department: "", person: "" },
                ]
              }
              setFormData={setFormData}
              createLoading={createLoading}
              fieldName="resp_person_for_improvement_implementation"
              addText="Добавить ответственного"
            />
            {errors.resp_person_for_improvement_implementation && (
              <p className={styles.submitError}>
                {errors.resp_person_for_improvement_implementation}
              </p>
            )}
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

export default React.memo(ImprovementAdderModal);
