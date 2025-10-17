import { isAxiosError } from "axios";

export const handleApiInconsistencyError = (
  error: unknown,
  defaultMessage: string,
  num_nonconf?: number,
): string => {
  if (isAxiosError(error)) {
    if (error.response?.status === 400 && num_nonconf !== undefined) {
      const serverMessage =
        error.response?.data?.num_nonconf?.[0] ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        defaultMessage;
      if (
        serverMessage.toLowerCase().includes("already exists") ||
        serverMessage.toLowerCase().includes("уже существует") ||
        serverMessage.toLowerCase().includes("duplicate")
      ) {
        return `Несоответствие с номером ${num_nonconf} уже существует`;
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
