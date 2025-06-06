import { Hono } from "hono";

import { zValidator } from "../../utils";
import { selectUser } from "../user/services";
import { getApplicationStatus, logApplicationToImagine } from "./clients";
import { getGeminiPredictResult, prepareResumeFile } from "./controllers";
import {
	deleteJobPosting,
	insertJobPosting,
	selectAppliedJobPostings,
	selectDataForReanalyze,
	selectJobDescriptionByJobId,
	selectJobPostingById,
	selectJobPostingByUrl,
	selectJobPostings,
	selectUsedCoverLetterByJobId,
	selectUsedResumeByJobId,
	updateJobPostingAnalyze,
	updateJobPostingApplicationStatus,
	updateJobPostingToApplied,
} from "./services";
import {
	createJobPostingRequestSchema,
	downloadResumeRequestSchema,
	getAppliedJobsQuerySchema,
	jobPostingIdSchema,
	markAsAppliedRequestSchema,
	reanalyzeResumeRequestSchema,
	updateApplicationStatusRequestSchema,
} from "./validators";

const jobPostingRoute = new Hono()
	.get("/", zValidator("query", getAppliedJobsQuerySchema), async (c) => {
		const queries = c.req.valid("query");

		const selectedJobPostings = await selectJobPostings(queries);

		return c.json(selectedJobPostings, 200);
	})
	.post("/", zValidator("json", createJobPostingRequestSchema), async (c) => {
		const payload = c.req.valid("json");

		// Prevent duplicate job posting
		const duplicateJobPosting = await selectJobPostingByUrl(payload.url);
		if (duplicateJobPosting) {
			return c.json({ error: "Job posting already exist" }, 400);
		}

		// Getting Gemini key from User
		const selectedUser = await selectUser();
		if (!selectedUser) {
			return c.json({ error: "Your profile is not complete" }, 401);
		}
		if (!selectedUser.geminiKey) {
			return c.json({ error: "Gemini api key not found" }, 404);
		}
		if (!selectedUser.resumeContent1) {
			return c.json({ error: "Resume content not found" }, 404);
		}

		const { jobDescription, ...payloadRest } = payload;

		// using Gemini
		const aiResult = await getGeminiPredictResult({
			title: payloadRest.title,
			jobDescription,
			cvText: selectedUser.resumeContent1,
			aiKey: selectedUser.geminiKey,
			location: payloadRest.location,
		});

		await insertJobPosting({ aiResult, payload });

		return c.json({ message: "Job posting created successfully" }, 201);
	})
	.get(
		"/applied",
		zValidator("query", getAppliedJobsQuerySchema),
		async (c) => {
			const queries = c.req.valid("query");

			const selectedUser = await selectUser();
			if (!selectedUser) {
				return c.json({ error: "Your profile is not complete" }, 401);
			}

			const selectedJobPostings = await selectAppliedJobPostings(queries);

			//* Related to Imagine
			const imagineApplicationIds = selectedJobPostings
				.map((item) => item.imagineApplicationId)
				.filter((item): item is string => item !== null);

			// Getting statuses for each of available applied jobs from imagine database
			const statuses =
				imagineApplicationIds.length > 0
					? await getApplicationStatus(
							imagineApplicationIds,
							selectedUser.email,
						)
					: [];

			const statusMap = new Map(
				statuses.map((status) => [status.rowId, status]),
			);

			const result = selectedJobPostings.map((item) => {
				const status = item.imagineApplicationId
					? statusMap.get(item.imagineApplicationId)
					: null;

				return {
					...item,
					imagineCoachComment: status?.comment ?? null,
					imagineApplicationStatus: status?.status ?? null,
				};
			});

			return c.json(result, 200);
		},
	)
	.post(
		"/download-resume",
		zValidator("json", downloadResumeRequestSchema),
		async (c) => {
			const payload = c.req.valid("json");

			const selectedUser = await selectUser();
			if (!selectedUser) return c.json({ error: "Profile is not set" }, 401);
			if (!selectedUser.googleApiCredential)
				return c.json(
					{ error: "Google API credentials are not set in profile" },
					400,
				);
			if (!selectedUser.resumeGoogleDocId)
				return c.json(
					{ error: "Resume template document id is not set in profile" },
					400,
				);

			const file = await prepareResumeFile(
				payload,
				selectedUser.resumeGoogleDocId,
				selectedUser.googleApiCredential,
			);

			c.header("Content-Type", "application/pdf");
			c.header(
				"Content-Disposition",
				`attachment; filename="resume-${selectedUser.name.toLowerCase().split(" ").join("-")}.pdf"`,
			);
			return c.body(Buffer.from(file as ArrayBuffer));
		},
	)
	.delete("/:id", zValidator("param", jobPostingIdSchema), async (c) => {
		const { id } = c.req.valid("param");

		const updatedRow = await deleteJobPosting(id);

		if (!updatedRow.length) {
			return c.json({ message: "Job posting doesn't exist" }, 404);
		}

		return c.json({ message: "Success" }, 200);
	})
	.get(
		"/:id/used-resume",
		zValidator("param", jobPostingIdSchema),
		async (c) => {
			const { id } = c.req.valid("param");

			const selectedJobPosting = await selectUsedResumeByJobId(id);

			if (!selectedJobPosting) {
				return c.json({ error: "Job posting doesn't exist" }, 404);
			}

			return c.json(selectedJobPosting, 200);
		},
	)
	.get(
		"/:id/used-cover-letter",
		zValidator("param", jobPostingIdSchema),
		async (c) => {
			const { id } = c.req.valid("param");

			const selectedJobPosting = await selectUsedCoverLetterByJobId(id);

			if (!selectedJobPosting) {
				return c.json({ error: "Job posting doesn't exist" }, 404);
			}

			return c.json(selectedJobPosting, 200);
		},
	)
	.get(
		"/:id/job-description",
		zValidator("param", jobPostingIdSchema),
		async (c) => {
			const { id } = c.req.valid("param");

			const selectedJobPosting = await selectJobDescriptionByJobId(id);

			if (!selectedJobPosting) {
				return c.json({ error: "Job posting doesn't exist" }, 404);
			}

			return c.json(selectedJobPosting, 200);
		},
	)
	.post(
		"/:id/reanalyze",
		zValidator("param", jobPostingIdSchema),
		zValidator("json", reanalyzeResumeRequestSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const { resumeNumber } = c.req.valid("json");

			const [selectedJobPosting, selectedUser] =
				await selectDataForReanalyze(id);
			if (!selectedJobPosting) {
				return c.json({ error: "Job posting doesn't exist" }, 404);
			}
			if (!selectedUser) {
				return c.json({ error: "Profile is not set" }, 404);
			}
			if (!selectedUser.geminiKey) {
				return c.json({ error: "Gemini api key not found" }, 404);
			}
			if (!selectedUser[`resumeContent${resumeNumber}`]) {
				return c.json(
					{ error: `Resume ${resumeNumber} content not found` },
					404,
				);
			}

			// using Gemini
			const aiResult = await getGeminiPredictResult({
				title: selectedJobPosting.title,
				jobDescription: selectedJobPosting.jobDescription,
				cvText: selectedUser[`resumeContent${resumeNumber}`]!,
				aiKey: selectedUser.geminiKey,
				location: selectedJobPosting.location,
			});

			await updateJobPostingAnalyze(id, aiResult);

			return c.json({ message: "Success" }, 200);
		},
	)
	.patch(
		"/:id/applied",
		zValidator("param", jobPostingIdSchema),
		zValidator("json", markAsAppliedRequestSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const payload = c.req.valid("json");

			const selectedUser = await selectUser();
			if (!selectedUser) {
				return c.json({ error: "Your profile is not complete" }, 401);
			}
			if (!selectedUser[`resumeContent${payload.resumeNumber}`]) {
				return c.json(
					{ error: `Resume ${payload.resumeNumber} content not found` },
					404,
				);
			}

			const selectedJobPosting = await selectJobPostingById(id);
			if (!selectedJobPosting) {
				return c.json({ error: "Job posting doesn't exist" }, 404);
			}

			const selectedResumeContent =
				selectedUser[`resumeContent${payload.resumeNumber}`];

			//* for Imagine
			const rowNumberResult = await logApplicationToImagine(
				selectedUser.email,
				{
					recruiter: payload.recruiter,
					email: selectedUser.email,
					companyName: selectedJobPosting.jobPosting.companyName,
					title: selectedJobPosting.jobPosting.title,
					url: selectedJobPosting.jobPosting.url,
					applicationScore: selectedJobPosting.jobPostingAnalyze.overallMatch,
				},
			);

			await updateJobPostingToApplied(id, {
				payload,
				resumeContent: selectedResumeContent!,
				rowNumber: rowNumberResult.rowNumber,
			});

			return c.json({ message: "Success" }, 200);
		},
	)
	.patch(
		"/:id/application-status",
		zValidator("param", jobPostingIdSchema),
		zValidator("json", updateApplicationStatusRequestSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const payload = c.req.valid("json");

			const selectedUser = await selectUser();

			if (!selectedUser) {
				return c.json({ error: "Your profile is not complete" }, 401);
			}

			const updatedRow = await updateJobPostingApplicationStatus(
				id,
				payload,
				selectedUser.email,
			);
			if (updatedRow === false)
				return c.json(
					{
						error: "Job posting doesn't exist or something happened on imagine",
					},
					404,
				);

			return c.json({ message: "Success" }, 200);
		},
	);

export default jobPostingRoute;
