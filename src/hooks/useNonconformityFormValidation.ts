import { useCallback } from "react";
import { NonconformityRequestPOST } from "@appTypes/types";

interface ValidationErrors {
  [key: string]: string;
}

interface UseNonconformityFormValidationProps {
  formData: NonconformityRequestPOST;
  numNonconfRef: React.RefObject<HTMLInputElement | null>;
}

export const useNonconformityFormValidation = ({
  formData,
  numNonconfRef,
}: UseNonconformityFormValidationProps) => {
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
