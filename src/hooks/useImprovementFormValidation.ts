import { useCallback } from "react";
import { ImprovementRequestPOST } from "@appTypes/types";

interface ValidationErrors {
  [key: string]: string;
}

interface UseImprovementFormValidationProps {
  formData: ImprovementRequestPOST;
  numImprovementRef: React.RefObject<HTMLInputElement | null>;
}

export const useImprovementFormValidation = ({
  formData,
  numImprovementRef,
}: UseImprovementFormValidationProps) => {
  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};
    if (!formData.num_improvement || formData.num_improvement <= 0) {
      newErrors.num_improvement = "Укажите номер возможности для улучшения (положительное число)";
      if (numImprovementRef.current) {
        numImprovementRef.current.focus();
        numImprovementRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    return newErrors;
  }, [formData, numImprovementRef]);

  return { validateForm };
};
