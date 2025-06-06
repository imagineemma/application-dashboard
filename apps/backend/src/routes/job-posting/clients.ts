import type {
	ImagineBridgeApiInsertedRowType,
	ImagineBridgeApiStatusType,
} from "../../types/route";
import { api } from "../../utils/api";
import type { UpdateApplicationStatusRequestType } from "./validators";

type LogApplicationToImagineParams = {
	email: string;
	title: string;
	url: string;
	companyName: string;
	recruiter: string | null;
	applicationScore: number;
};

export const getApplicationStatus = async (rows: string[], email: string) => {
	const res = await api.get<ImagineBridgeApiStatusType>("/job-posting", {
		params: {
			rows: rows.join(","),
		},
		headers: {
			"X-User-Email": email,
		},
	});

	return res.data;
};

export const logApplicationToImagine = async (
	email: string,
	payload: LogApplicationToImagineParams,
) => {
	const res = await api.post<ImagineBridgeApiInsertedRowType>(
		"/job-posting",
		payload,
		{
			headers: {
				"X-User-Email": email,
			},
		},
	);

	return res.data;
};

export const updateApplicationStatusToImagine = async (
	email: string,
	payload: UpdateApplicationStatusRequestType & { rowId: string },
) => {
	const res = await api.patch("/job-posting/status", payload, {
		headers: {
			"X-User-Email": email,
		},
	});

	return res.data;
};
