import { isAxiosError } from "axios";

export const handleApiObservationError = (
  error: unknown,
  defaultMessage: string,
  num_observation?: number,
): string => {
  if (isAxiosError(error)) {
    if (error.response?.status === 400 && num_observation !== undefined) {
      const serverMessage =
        error.response?.data?.num_observation?.[0] ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        defaultMessage;
      if (
        serverMessage.toLowerCase().includes("already exists") ||
        serverMessage.toLowerCase().includes("уже существует") ||
        serverMessage.toLowerCase().includes("duplicate")
      ) {
        return `Наблюдение с номером ${num_observation} уже существует`;
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
