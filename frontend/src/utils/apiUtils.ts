import { AxiosError } from "axios";
import { ApiError } from "../api/types";

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const response = error.response?.data;
    return {
      message: response?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
      errors: response?.errors,
    };
  }

  return {
    message:
      error instanceof Error ? error.message : "An unknown error occurred",
    status: 500,
  };
};

export const formatApiResponse = <T>(
  data: T,
  message?: string,
  status = 200
) => ({
  data,
  message,
  status,
});

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

export const getValidationErrors = (
  error: unknown
): Record<string, string[]> => {
  if (isApiError(error) && error.errors) {
    return error.errors;
  }
  return {};
};
