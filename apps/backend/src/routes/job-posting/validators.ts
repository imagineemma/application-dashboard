import { z } from "zod";

import { availableResumeList } from "../../constants";

export const jobPostingIdSchema = z.object({
	id: z
		.string()
		.transform((val) => Number(val))
		.pipe(z.number().positive()),
});

export const createJobPostingRequestSchema = z.object({
	companyName: z.string().trim(),
	companyUrl: z.string().trim().optional(),
	location: z.string().trim().transform(value => value || "Location not specified"),
	title: z.string().trim(),
	jobDescription: z.string().trim(),
	platform: z.string().trim().transform(value => value || "Custom"),
	url: z.string().trim().url(),
	postingDate: z.string().datetime().optional(),
	recruiter: z.string().trim().optional(),
});
export type CreateJobPostingRequestType = z.infer<
	typeof createJobPostingRequestSchema
>;

export const jobPostingAiResultSchema = z.object({
	postingLanguage: z.string().min(1),
	relocationAvailable: z.boolean(),
	languageMatch: z.boolean(),
	keySkillsMatched: z.array(z.string()),
	keySkillsMissing: z.array(z.string()),
	suggestions: z.array(z.string()),
	overallMatch: z.number().int(),
});
export type JobPostingAiResultType = z.infer<typeof jobPostingAiResultSchema>;

export const updateApplicationStatusRequestSchema = z.object({
	rejectedAt: z.string().datetime().optional(),
	invitedAt: z.string().datetime().optional(),
	jobOfferAt: z.string().datetime().optional(),
	failedInterviewAt: z.string().datetime().optional(),
});
export type UpdateApplicationStatusRequestType = z.infer<
	typeof updateApplicationStatusRequestSchema
>;

export const getAppliedJobsQuerySchema = z.object({
	page: z
		.string()
		.transform((val) => Number(val))
		.pipe(z.number().min(1)),
	name: z
		.string()
		.trim()
		.optional()
		.transform((val) => (val ? val : undefined)),
});
export type GetAppliedJobsQueryType = z.infer<typeof getAppliedJobsQuerySchema>;

export const markAsAppliedRequestSchema = z.object({
	applyComment: z.string().transform((val) => val || null),
	resumeNumber: z.enum(availableResumeList),
	isCoverLetterUsed: z.boolean(),
	recruiter: z.string().transform((val) => val || null),
});
export type MarkAsAppliedRequestType = z.infer<
	typeof markAsAppliedRequestSchema
>;

export const bulletPointAiResultSchema = z.object({
	summary: z.string().min(1),
	evalucar: z.array(z.string()).length(5),
	brunny: z.array(z.string()).length(4),
	languages: z.string().trim().min(5),
	web: z.string().trim().min(5),
	toolsFrameworks: z.string().trim().min(5),
	testing: z.string().trim().min(5),
	other: z.string().trim().min(5),
});
export type BulletPointAiResultType = z.infer<typeof bulletPointAiResultSchema>;

export const reanalyzeResumeRequestSchema = z.object({
	resumeNumber: z.enum(availableResumeList),
});

export const downloadResumeRequestSchema = z.object({
	title: z.string().min(1),
});
export type DownloadResumeRequestType = z.infer<
	typeof downloadResumeRequestSchema
>;
