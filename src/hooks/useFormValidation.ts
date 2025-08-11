import { useCallback } from "react";
import { ItemRequestPOST } from "../types/types";

interface ValidationErrors {
  [key: string]: string;
}

interface UseFormValidationProps {
  formData: ItemRequestPOST;
  numNonconfRef: React.RefObject<HTMLInputElement | null>;
}

export const useFormValidation = ({ formData, numNonconfRef }: UseFormValidationProps) => {
  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};

    // Валидация номера несоответствия
    if (!formData.num_nonconf || formData.num_nonconf <= 0) {
      newErrors.num_nonconf = "Укажите номер несоответствия (положительное число)";
      if (numNonconfRef.current) {
        numNonconfRef.current.focus();
        numNonconfRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    // Валидация нормативных документов
    if (!formData.normative_documents.some((doc) => doc.norm_doc)) {
      newErrors.normative_documents = "Укажите хотя бы один нормативный документ";
    }

    return newErrors;
  }, [formData, numNonconfRef]);

  return { validateForm };
};
