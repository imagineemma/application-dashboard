import { eq } from "drizzle-orm";

import { jobPostingTable, userTable } from "../../database/schema";
import { db } from "../../utils/db";

export const selectDataForCoverLetterContent = async (jobPostingId: number) => {
	return Promise.all([
		db
			.select({
				jobDescription: jobPostingTable.jobDescription,
				title: jobPostingTable.title,
				companyName: jobPostingTable.companyName,
				location: jobPostingTable.location,
			})
			.from(jobPostingTable)
			.where(eq(jobPostingTable.id, jobPostingId))
			.then((rows) => rows.at(0)),
		db
			.select()
			.from(userTable)
			.then((rows) => rows.at(0)),
	]);
};

export const updateJobPostingAddCoverLetterContent = async (
	jobPostingId: number,
	content: string,
) => {
	return db
		.update(jobPostingTable)
		.set({ usedCoverLetterContent: content })
		.where(eq(jobPostingTable.id, jobPostingId));
};
