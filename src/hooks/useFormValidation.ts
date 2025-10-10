import { useCallback } from "react";
import { InconsistencyRequestPOST } from "@appTypes/types";

interface ValidationErrors {
  [key: string]: string;
}

interface UseFormValidationProps {
  formData: InconsistencyRequestPOST;
  numNonconfRef: React.RefObject<HTMLInputElement | null>;
}

export const useFormValidation = ({ formData, numNonconfRef }: UseFormValidationProps) => {
  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};
    if (!formData.num_nonconf || formData.num_nonconf <= 0) {
      newErrors.num_nonconf = "Укажите номер несоответствия (положительное число)";
      if (numNonconfRef.current) {
        numNonconfRef.current.focus();
        numNonconfRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    return newErrors;
  }, [formData, numNonconfRef]);

  return { validateForm };
};
