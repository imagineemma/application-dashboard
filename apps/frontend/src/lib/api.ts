import type {
	CoverLetterRouteType,
	JobPostingRouteType,
	UserRouteType,
} from "backend/types";
import { type ClientResponse, hc } from "hono/client";
import type { APIErrorResponseType } from "../types";

const apiPrefix = "http://localhost:3008/api";

export const honoClientJobPosting = hc<JobPostingRouteType>(
	`${apiPrefix}/job-posting`,
);
export const honoClientUser = hc<UserRouteType>(`${apiPrefix}/user`);
export const honoClientCoverLetter = hc<CoverLetterRouteType>(
	`${apiPrefix}/cover-letter`,
);

export async function handleApiResponse<T>(
	requestPromise: Promise<ClientResponse<T | APIErrorResponseType>>,
): Promise<T> {
	try {
		const res = await requestPromise;

		if (!res.ok) {
			const errorData = (await res.json()) as APIErrorResponseType;
			throw new Error(errorData.error || "Unknown error occurred");
		}

		return res.json() as T;
	} catch (error) {
		// Handle network or other unexpected errors
		throw new Error(
			error instanceof Error ? error.message : "An unexpected error occurred",
		);
	}
}

export async function handleBlobResponse(
	requestPromise: Promise<ClientResponse<object | APIErrorResponseType>>,
) {
	try {
		const res = await requestPromise;

		if (!res.ok) {
			const errorData = (await res.json()) as APIErrorResponseType;
			throw new Error(errorData.error || "Unknown error occurred");
		}

		const blob = await res.blob();
		const url = URL.createObjectURL(blob);

		// Create a temporary anchor element to trigger download
		const link = document.createElement("a");
		link.href = url;

		// Get filename from Content-Disposition header if available
		const contentDisposition = res.headers.get("Content-Disposition");
		const fileNameFromHeader =
			contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
			"download.pdf";

		link.download = fileNameFromHeader;
		document.body.appendChild(link);
		link.click();

		// Clean up
		setTimeout(() => {
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}, 100);
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "An unexpected error occurred",
		);
	}
}
