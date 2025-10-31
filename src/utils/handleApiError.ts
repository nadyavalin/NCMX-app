import { isAxiosError } from "axios";

export const createApiErrorHandler = (entityName: string, entityField?: string) => {
  return (error: unknown, defaultMessage: string, entityNumber?: number): string => {
    if (isAxiosError(error)) {
      if (error.response?.status === 400 && entityNumber !== undefined && entityField) {
        const serverMessage =
          error.response?.data?.[entityField]?.[0] ||
          error.response?.data?.detail ||
          error.response?.data?.message ||
          defaultMessage;

        if (
          serverMessage.toLowerCase().includes("already exists") ||
          serverMessage.toLowerCase().includes("уже существует") ||
          serverMessage.toLowerCase().includes("duplicate")
        ) {
          return `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} с номером ${entityNumber} уже существует`;
        }
        return serverMessage;
      }

      return (
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        defaultMessage
      );
    } else if (error instanceof Error) {
      return error.message;
    }
    return defaultMessage;
  };
};

export const handleApiInconsistencyError = createApiErrorHandler("несоответствие", "num_nonconf");
export const handleApiObservationError = createApiErrorHandler("наблюдение", "num_observation");
export const handleApiCommentError = createApiErrorHandler("комментарий");
