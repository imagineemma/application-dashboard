import { z } from "zod";
import { availableResumeList } from "../../constants";

export const generateCoverLetterRequestSchema = z.object({
	additionalInfo: z.string().max(1000),
	resumeNumber: z.enum(availableResumeList),
});

export const downloadCoverLetterRequestSchema = z.object({
	companyName: z.string(),
	letterContent: z.string(),
});
export type DownloadCoverLetterRequestType = z.infer<
	typeof downloadCoverLetterRequestSchema
>;
