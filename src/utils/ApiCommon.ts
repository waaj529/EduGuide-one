import { axiosForm, axiosJSON } from "./Axios";

export const API_COMMON = async (
  METHOD: string,
  type = "json",
  URL: string,
  ERROR_MESSAGE = "Error Making Request",
  DATA = null
) => {
  try {
    switch (METHOD) {
      case "post": {
        const response =
          type === "form"
            ? await axiosForm.post(URL, DATA)
            : await axiosJSON.post(URL, DATA);
        return response.data;
      }
      case "patch": {
        const response =
          type === "form"
            ? await axiosForm.patch(URL, DATA)
            : await axiosJSON.patch(URL, DATA);
        return response.data;
      }
      case "getAll": {
        const response = await axiosJSON.get(URL);
        return response.data;
      }
      case "getPdf": {
        const response = await axiosJSON.get(URL, { responseType: "blob" });
        return response; // Return the full response, not just response.data
      }
      case "delete": {
        const response = await axiosJSON.delete(URL);
        return response.data;
      }
      case "auth": {
        const response = await axiosJSON.post(URL, DATA);
        return response.data;
      }
      default: {
        console.error("Enter a valid method");
        return null;
      }
    }
  } catch (error) {
    // Enhanced error handling for different types of errors
    let message = ERROR_MESSAGE;
    let statusCode = null;
    
    if (error.response) {
      // Server responded with error status
      statusCode = error.response.status;
      message = error.response.data?.message || `Server Error: ${statusCode}`;
      
      // Handle specific error codes
      switch (statusCode) {
        case 404:
          message = "Resource not found. Please check the URL or try again.";
          break;
        case 500:
          message = "Internal server error. Please try again later.";
          break;
        case 403:
          message = "Access denied. Please check your permissions.";
          break;
        case 401:
          message = "Authentication required. Please login again.";
          break;
      }
    } else if (error.request) {
      // Network error - no response received
      message = "Network error. Please check your internet connection.";
    } else {
      // Other error
      message = error.message || ERROR_MESSAGE;
    }
    
    // Log error details in development only
    if (!import.meta.env.PROD) {
      console.error("API Error Details:", {
        url: error.config?.url,
        method: error.config?.method,
        status: statusCode,
        message,
        error
      });
    } else {
      // Production-safe logging
      console.error("API Error:", message);
    }
    
    return Promise.reject({ message, statusCode });
  }
};
