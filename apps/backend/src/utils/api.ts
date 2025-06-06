import axios from "axios";

export const api = axios.create({
	baseURL: "https://imagine-sheet-bridge.emma-6a1.workers.dev",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		// If we have a response from the server with our expected error format
		if (error.response?.data?.error) {
			// Extract the error message from the API response
			const errorMessage = error.response.data.error;

			// Create a new error with the extracted message
			const customError = new Error(errorMessage);

			return Promise.reject(customError);
		}

		// If it's any other type of error, just pass it through
		return Promise.reject(error);
	},
);
