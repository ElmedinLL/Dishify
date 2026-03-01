/**
 * Combines API error messages from various response formats
 * @param {Object} error - API error object from RTK Query or fetch
 * @returns {string} Combined error message
 */
export function getErrorMessage(error) {
  if (!error) return "An unexpected error occurred";

  // RTK Query error structure (API returns ErrorMessages array)
  const messages = error.data?.errorMessages || error.data?.ErrorMessages;
  if (messages?.length) {
    return messages.join(", ");
  }
  if (error.data?.errorMessage || error.data?.ErrorMessage) {
    return error.data.errorMessage || error.data.ErrorMessage;
  }

  // Status-specific messages
  if (error.status === 404) return "Service not found. Is the API running?";
  if (error.status === 500) return "Server error. Please try again or contact support.";

  // Standard error message
  if (error.message) return error.message;

  return "An unexpected error occurred";
}
