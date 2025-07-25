import { isAxiosError } from "axios";

export const handleApiError = (error: unknown, defaultMessage: string): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  } else if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};
