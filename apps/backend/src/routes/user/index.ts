import { Hono } from "hono";

import { zValidator } from "../../utils";

import { geminiCoverLetterSystemPrompt } from "../../constants/gemini";
import type { UserType } from "../../types/route";
import {
	countRecentApplicationsByDay,
	countTotalAppliedApplications,
} from "../job-posting/services";
import { selectUser, updateUser } from "./services";
import { populateCompleteWeek } from "./utils";
import { updateUserRequestSchema } from "./validators";

const userRoute = new Hono()
	.get("/", async (c) => {
		const selectedUser = await selectUser();
		if (!selectedUser) {
			return c.json(
				{
					email: "",
					geminiKey: "",
					name: "",
					resumeContent1: "",
					resumeContent2: "",
					resumeContent3: "",
					coverLetterPrompt: geminiCoverLetterSystemPrompt,
					coverLetterGoogleDocId: "",
					resumeGoogleDocId: "",
					googleApiCredential: "",
				} satisfies UserType,
				200,
			);
		}

		return c.json(selectedUser, 200);
	})
	.put("/", zValidator("json", updateUserRequestSchema), async (c) => {
		const payload = c.req.valid("json");

		await updateUser(payload);

		return c.json({ message: "User is updated successfully" }, 200);
	})
	.get("/statistics", async (c) => {
		const lastWeekApplications = await countRecentApplicationsByDay();
		// Making sure the empty days of weeks are populated by 0
		const completeLastWeek = populateCompleteWeek(lastWeekApplications);

		const totalApplications = await countTotalAppliedApplications();

		return c.json(
			{
				lastWeekApplications: completeLastWeek,
				totalApplications,
			},
			200,
		);
	});

export default userRoute;
