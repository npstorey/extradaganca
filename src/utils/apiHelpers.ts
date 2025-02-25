/**
 * Common API helper functions
 */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * Creates an error message from an API error
 */
export const formatApiError = (error: Error | AxiosError): string => {
  if (axios.isAxiosError(error)) {
    const response = error.response;
    if (response?.data?.error?.message) {
      return `API Error: ${response.data.error.message}`;
    }
    return `API Error: ${error.message}`;
  }
  return `Error: ${error.message}`;
};

/**
 * Standard request options for API calls
 */
export const getRequestOptions = (
  apiKey: string,
  options: AxiosRequestConfig = {}
): AxiosRequestConfig => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...options.headers,
    },
    ...options,
  };
};

/**
 * Generate a unique request ID
 */
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}; 