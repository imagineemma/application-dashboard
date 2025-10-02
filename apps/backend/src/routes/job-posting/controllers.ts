import { GoogleGenerativeAI } from "@google/generative-ai";

import {
	geminiAnalyzeSystemPrompt,
	geminiAnalyzeUserPrompt,
} from "../../constants/gemini";
import { createGoogleClients } from "../../utils/google";
import {
	type DownloadResumeRequestType,
	type JobPostingAiResultType,
	jobPostingAiResultSchema,
} from "./validators";

export const getGeminiPredictResult = async (data: {
	title: string;
	jobDescription: string;
	cvText: string;
	aiKey: string;
	location: string;
}): Promise<JobPostingAiResultType> => {
	const { aiKey, cvText, jobDescription, location, title } = data;

	const genAI = new GoogleGenerativeAI(aiKey);
	const geminiPredictModel = genAI.getGenerativeModel({
		model: "gemini-2.5-flash-lite",
		systemInstruction: geminiAnalyzeSystemPrompt,
	});

	const result = await geminiPredictModel.generateContent({
		contents: [
			{
				role: "user",
				parts: [
					{
						text: geminiAnalyzeUserPrompt({
							cvText,
							jobDescription,
							title,
							location,
						}),
					},
				],
			},
		],
		generationConfig: {
			temperature: 0,
		},
	});

	// Parsing result from JSON
	const aiResult = result.response.text().replace(/^```\w*\n?|```$/g, "");
	const aiResultObject = JSON.parse(aiResult);

	return jobPostingAiResultSchema.parse(aiResultObject);
};

export const prepareResumeFile = async (
	payload: DownloadResumeRequestType,
	resumeGoogleDocId: string,
	googleApiCredential: string,
) => {
	const { googleDocs, googleDrive } =
		await createGoogleClients(googleApiCredential);

	const templateDocId = resumeGoogleDocId;

	// Make a copy of the template document
	const copyResponse = await googleDrive.files.copy({
		fileId: templateDocId,
		requestBody: { name: `resume-${new Date().toISOString()}` },
	});

	const newDocId = copyResponse.data.id;
	if (!newDocId) throw new Error("Copying resume template failed");

	// Replace placeholders in the document
	const placeholders = {
		"{{title}}": payload.title,
	};

	// Prepare requests to google api
	const requests = Object.entries(placeholders).map(([text, replaceText]) => ({
		replaceAllText: {
			containsText: { text, matchCase: true },
			replaceText,
		},
	}));

	await googleDocs.documents.batchUpdate({
		documentId: newDocId,
		requestBody: { requests },
	});

	// Export as PDF
	const pdfResponse = await googleDrive.files.export(
		{ fileId: newDocId, mimeType: "application/pdf" },
		{ responseType: "arraybuffer" },
	);

	// Clean up temporary doc
	await googleDrive.files.delete({ fileId: newDocId });

	return pdfResponse.data;
};
