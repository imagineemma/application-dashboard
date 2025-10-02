import { GoogleGenerativeAI } from "@google/generative-ai";
import { format } from "date-fns";

import { geminiCoverLetterUserPrompt } from "../../constants/gemini";
import { createGoogleClients } from "../../utils/google";
import type { DownloadCoverLetterRequestType } from "./validators";

type GetGeminiCoverLetterResultParams = {
	positionDetails: { title: string; companyName: string };
	jobDescription: string;
	cvText: string;
	aiKey: string;
	additionalInfo: string;
	location: string;
	systemPrompt: string;
};

export const getGeminiCoverLetterResult = async ({
	additionalInfo,
	aiKey,
	cvText,
	jobDescription,
	location,
	positionDetails,
	systemPrompt,
}: GetGeminiCoverLetterResultParams) => {
	const genAI = new GoogleGenerativeAI(aiKey);
	const geminiCoverLetterModel = genAI.getGenerativeModel({
		model: "gemini-2.5-flash",
		systemInstruction: systemPrompt,
	});

	const result = await geminiCoverLetterModel.generateContent({
		contents: [
			{
				role: "user",
				parts: [
					{
						text: geminiCoverLetterUserPrompt({
							...positionDetails,
							cvText,
							jobDescription,
							additionalInfo,
							location,
						}),
					},
				],
			},
		],
		generationConfig: {
			temperature: 0.4,
		},
	});

	return result.response.text();
};

export const prepareCoverLetterFile = async (
	{ companyName, letterContent }: DownloadCoverLetterRequestType,
	coverLetterGoogleDocId: string,
	googleApiCredential: string,
) => {
	const templateDocId = coverLetterGoogleDocId;
	const { googleDocs, googleDrive } =
		await createGoogleClients(googleApiCredential);

	const date = format(new Date(), "d MMMM yyyy");

	// Make a copy of the template document
	const copyResponse = await googleDrive.files.copy({
		fileId: templateDocId,
		requestBody: { name: `cover-letter-${new Date().toISOString()}` },
	});

	const newDocId = copyResponse.data.id;
	if (!newDocId) throw new Error("Copying cover letter template failed");

	// Replace placeholders in the document
	const placeholders = {
		"{{companyName}}": companyName,
		"{{letterContent}}": letterContent,
		"{{date}}": date,
	};

	// create batch requests and send to google api
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
