import { z } from "zod";

export const updateUserRequestSchema = z.object({
	name: z.string().min(1),
	resumeContent1: z.string().min(1500).max(10000),
	resumeContent2: z
		.string()
		.max(10000)
		.or(z.literal(""))
		.transform((val) => val || null),
	resumeContent3: z
		.string()
		.max(10000)
		.or(z.literal(""))
		.transform((val) => val || null),
	geminiKey: z.string().min(10),
	email: z.string().email(),
	coverLetterPrompt: z.string().min(100),
	coverLetterGoogleDocId: z
		.string()
		.min(1)
		.or(z.literal(""))
		.transform((value) => value || null),
	resumeGoogleDocId: z
		.string()
		.min(1)
		.or(z.literal(""))
		.transform((value) => value || null),
	googleApiCredential: z
		.string()
		.min(10)
		.or(z.literal(""))
		.transform((value) => value || null),
});
export type UpdateUserRequestType = z.infer<typeof updateUserRequestSchema>;
