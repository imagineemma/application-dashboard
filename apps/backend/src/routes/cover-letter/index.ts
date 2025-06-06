import { Hono } from "hono";

import { zValidator } from "../../utils";
import { jobPostingIdSchema } from "../job-posting/validators";
import { selectUser } from "../user/services";
import {
	getGeminiCoverLetterResult,
	prepareCoverLetterFile,
} from "./controllers";
import {
	selectDataForCoverLetterContent,
	updateJobPostingAddCoverLetterContent,
} from "./services";
import {
	downloadCoverLetterRequestSchema,
	generateCoverLetterRequestSchema,
} from "./validators";

const coverLetterRoute = new Hono()
	.post(
		"/:id",
		zValidator("param", jobPostingIdSchema),
		zValidator("json", generateCoverLetterRequestSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const { additionalInfo, resumeNumber } = c.req.valid("json");

			const [selectedJobPosting, selectedUser] =
				await selectDataForCoverLetterContent(id);

			if (!selectedUser) {
				return c.json({ error: "User profile  is not found" }, 404);
			}
			if (!selectedJobPosting) {
				return c.json({ error: "Job posting is not found" }, 404);
			}
			if (!selectedUser.geminiKey) {
				return c.json(
					{
						error: "Gemini api key not found, please complete your profile",
					},
					400,
				);
			}
			if (!selectedUser[`resumeContent${resumeNumber}`]) {
				return c.json(
					{
						error: "Resume content not found, please complete your profile",
					},
					400,
				);
			}

			const letterContent = await getGeminiCoverLetterResult({
				positionDetails: {
					companyName: selectedJobPosting.companyName,
					title: selectedJobPosting.title,
				},
				jobDescription: selectedJobPosting.jobDescription,
				cvText: selectedUser[`resumeContent${resumeNumber}`]!,
				aiKey: selectedUser.geminiKey,
				additionalInfo,
				location: selectedJobPosting.location,
				systemPrompt: selectedUser.coverLetterPrompt,
			});

			return c.json(
				{
					letterContent,
				},
				200,
			);
		},
	)
	.post(
		"/:id/download",
		zValidator("param", jobPostingIdSchema),
		zValidator("json", downloadCoverLetterRequestSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const payload = c.req.valid("json");

			const selectedUser = await selectUser();

			if (!selectedUser) return c.json({ error: "Profile is not set" }, 401);
			if (!selectedUser.googleApiCredential)
				return c.json(
					{ error: "Google API credentials are not set in profile" },
					400,
				);
			if (!selectedUser.coverLetterGoogleDocId)
				return c.json(
					{ error: "Cover letter template document id is not set in profile" },
					400,
				);

			// Save the last generated cover letter in db
			await updateJobPostingAddCoverLetterContent(id, payload.letterContent);

			const data = await prepareCoverLetterFile(
				payload,
				selectedUser.coverLetterGoogleDocId,
				selectedUser.googleApiCredential,
			);

			c.header("Content-Type", "application/pdf");
			c.header(
				"Content-Disposition",
				`attachment; filename="cover-letter-${selectedUser.name.toLowerCase().split(" ").join("-")}.pdf"`,
			);
			return c.body(Buffer.from(data as ArrayBuffer));
		},
	);

export default coverLetterRoute;
