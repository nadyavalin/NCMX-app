import { useCallback } from "react";
import { ObservationRequestPOST } from "@appTypes/types";

interface ValidationErrors {
  [key: string]: string;
}

interface UseInconsistencyFormValidationProps {
  formData: ObservationRequestPOST;
  numObservationRef: React.RefObject<HTMLInputElement | null>;
}

export const useObservationFormValidation = ({
  formData,
  numObservationRef,
}: UseInconsistencyFormValidationProps) => {
  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};
    if (!formData.num_observation || formData.num_observation <= 0) {
      newErrors.num_nonconf = "Укажите номер наблюдения (положительное число)";
      if (numObservationRef.current) {
        numObservationRef.current.focus();
        numObservationRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    return newErrors;
  }, [formData, numObservationRef]);

  return { validateForm };
};
