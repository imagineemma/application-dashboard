import {
	and,
	desc,
	eq,
	getTableColumns,
	isNotNull,
	isNull,
	sql,
} from "drizzle-orm";

import { jobPostingItemPerPage } from "../../constants";
import { db } from "../../utils/db";

import {
	jobPostingAnalyzeTable,
	jobPostingTable,
	userTable,
} from "../../database/schema";
import { updateApplicationStatusToImagine } from "./clients";
import type {
	CreateJobPostingRequestType,
	GetAppliedJobsQueryType,
	JobPostingAiResultType,
	MarkAsAppliedRequestType,
	UpdateApplicationStatusRequestType,
} from "./validators";

type InsertJobPostingType = {
	payload: CreateJobPostingRequestType;
	aiResult: JobPostingAiResultType;
};

export const selectJobPostingByUrl = async (url: string) => {
	return db
		.select({ id: jobPostingTable.id })
		.from(jobPostingTable)
		.where(eq(jobPostingTable.url, url))
		.then((rows) => rows.at(0));
};

export const insertJobPosting = async ({
	payload,
	aiResult,
}: InsertJobPostingType) => {
	const { postingDate, ...payloadRest } = payload;

	return db.transaction(async (tx) => {
		const insertedJobPosting = await tx
			.insert(jobPostingTable)
			.values({
				...payloadRest,
				postingDate: postingDate,
			})
			.returning({ id: jobPostingTable.id })
			.then((rows) => rows.at(0));

		if (!insertedJobPosting)
			throw new Error("Failed to insert new job posting");

		await tx
			.insert(jobPostingAnalyzeTable)
			.values({ ...aiResult, jobsPostingId: insertedJobPosting.id });
	});
};

export const selectJobPostings = async (queries: GetAppliedJobsQueryType) => {
	return db
		.select({
			companyUrl: jobPostingTable.companyUrl,
			companyName: jobPostingTable.companyName,
			id: jobPostingTable.id,
			location: jobPostingTable.location,
			platform: jobPostingTable.platform,
			postingDate: jobPostingTable.postingDate,
			recruiter: jobPostingTable.recruiter,
			title: jobPostingTable.title,
			url: jobPostingTable.url,
			keySkillsMatched: jobPostingAnalyzeTable.keySkillsMatched,
			keySkillsMissing: jobPostingAnalyzeTable.keySkillsMissing,
			languageMatch: jobPostingAnalyzeTable.languageMatch,
			overallMatch: jobPostingAnalyzeTable.overallMatch,
			postingLanguage: jobPostingAnalyzeTable.postingLanguage,
			relocationAvailable: jobPostingAnalyzeTable.relocationAvailable,
			suggestions: jobPostingAnalyzeTable.suggestions,
		})
		.from(jobPostingTable)
		.where(
			and(
				isNull(jobPostingTable.appliedAt),
				eq(jobPostingTable.isDeleted, false),
			),
		)
		.innerJoin(
			jobPostingAnalyzeTable,
			eq(jobPostingAnalyzeTable.jobsPostingId, jobPostingTable.id),
		)
		.limit(jobPostingItemPerPage)
		.offset(jobPostingItemPerPage * (queries.page - 1))
		.orderBy(desc(jobPostingTable.createdAt));
};

export const selectAppliedJobPostings = async (
	queries: GetAppliedJobsQueryType,
) => {
	return db
		.select({
			appliedAt: jobPostingTable.appliedAt,
			applyComment: jobPostingTable.applyComment,
			rejectedAt: jobPostingTable.rejectedAt,
			invitedAt: jobPostingTable.invitedAt,
			failedInterviewAt: jobPostingTable.failedInterviewAt,
			jobOfferAt: jobPostingTable.jobOfferAt,
			companyUrl: jobPostingTable.companyUrl,
			companyName: jobPostingTable.companyName,
			id: jobPostingTable.id,
			location: jobPostingTable.location,
			platform: jobPostingTable.platform,
			postingDate: jobPostingTable.postingDate,
			recruiter: jobPostingTable.recruiter,
			title: jobPostingTable.title,
			url: jobPostingTable.url,
			keySkillsMatched: jobPostingAnalyzeTable.keySkillsMatched,
			keySkillsMissing: jobPostingAnalyzeTable.keySkillsMissing,
			languageMatch: jobPostingAnalyzeTable.languageMatch,
			overallMatch: jobPostingAnalyzeTable.overallMatch,
			postingLanguage: jobPostingAnalyzeTable.postingLanguage,
			relocationAvailable: jobPostingAnalyzeTable.relocationAvailable,
			imagineApplicationId: jobPostingTable.imagineApplicationId,
		})
		.from(jobPostingTable)
		.where(
			and(
				isNotNull(jobPostingTable.appliedAt),
				queries.name
					? sql`${jobPostingTable.companyName} LIKE ${`%${queries.name}%`} COLLATE NOCASE`
					: undefined,
			),
		)
		.innerJoin(
			jobPostingAnalyzeTable,
			eq(jobPostingAnalyzeTable.jobsPostingId, jobPostingTable.id),
		)
		.limit(jobPostingItemPerPage)
		.offset(jobPostingItemPerPage * (queries.page - 1))
		.orderBy(desc(jobPostingTable.createdAt));
};

export const selectJobPostingById = async (id: number) => {
	return db
		.select({
			jobPosting: getTableColumns(jobPostingTable),
			jobPostingAnalyze: getTableColumns(jobPostingAnalyzeTable),
		})
		.from(jobPostingTable)
		.innerJoin(
			jobPostingAnalyzeTable,
			eq(jobPostingTable.id, jobPostingAnalyzeTable.jobsPostingId),
		)
		.where(eq(jobPostingTable.id, id))
		.then((rows) => rows.at(0));
};

export const updateJobPostingToApplied = (
	id: number,
	data: {
		payload: MarkAsAppliedRequestType;
		resumeContent: string | null;
		rowNumber: string;
	},
) => {
	return db
		.update(jobPostingTable)
		.set({
			appliedAt: new Date().toISOString(),
			usedCoverLetterContent: data.payload.isCoverLetterUsed ? undefined : null, // If cover letter is not used we delete the content from db
			usedResumeContent: data.resumeContent,
			recruiter: data.payload.recruiter,
			imagineApplicationId: data.rowNumber,
			applyComment: data.payload.applyComment,
		})
		.where(eq(jobPostingTable.id, id));
};

export const updateJobPostingApplicationStatus = async (
	id: number,
	payload: UpdateApplicationStatusRequestType,
	userEmail: string,
) => {
	return db.transaction(async (tx) => {
		const updatedData = await tx
			.update(jobPostingTable)
			.set(payload)
			.where(eq(jobPostingTable.id, id))
			.returning({ imagineApplicationId: jobPostingTable.imagineApplicationId })
			.then((rows) => rows.at(0));

		if (!updatedData?.imagineApplicationId) return false;

		await updateApplicationStatusToImagine(userEmail, {
			...payload,
			rowId: updatedData.imagineApplicationId,
		});
	});
};

export const deleteJobPosting = (id: number) => {
	return db
		.update(jobPostingTable)
		.set({ isDeleted: true })
		.where(eq(jobPostingTable.id, id))
		.returning({ id: jobPostingTable.id });
};

export const countRecentApplicationsByDay = async () => {
	const rows = await db
		.select({
			date: sql<string>`strftime('%Y-%m-%d', ${jobPostingTable.appliedAt})`,
			count: sql<number>`COUNT(*)`,
		})
		.from(jobPostingTable)
		.where(sql`${jobPostingTable.appliedAt} >= datetime('now', '-7 days')`)
		.groupBy(sql`strftime('%Y-%m-%d', ${jobPostingTable.appliedAt})`)
		.orderBy(sql`strftime('%Y-%m-%d', ${jobPostingTable.appliedAt})`);

	return rows;
};

export const countTotalAppliedApplications = () => {
	return db.$count(jobPostingTable, isNotNull(jobPostingTable.appliedAt));
};

export const selectJobPostingForReanalyze = async (id: number) => {
	return db
		.select({
			title: jobPostingTable.title,
			jobDescription: jobPostingTable.jobDescription,
			location: jobPostingTable.location,
		})
		.from(jobPostingTable)
		.where(eq(jobPostingTable.id, id))
		.then((rows) => rows.at(0));
};

export const updateJobPostingAnalyze = (
	id: number,
	payload: JobPostingAiResultType,
) => {
	return db
		.update(jobPostingAnalyzeTable)
		.set(payload)
		.where(eq(jobPostingAnalyzeTable.jobsPostingId, id));
};

export const selectUsedResumeByJobId = async (id: number) => {
	return db
		.select({ usedResumeContent: jobPostingTable.usedResumeContent })
		.from(jobPostingTable)
		.where(eq(jobPostingTable.id, id))
		.then((rows) => rows.at(0));
};

export const selectUsedCoverLetterByJobId = async (id: number) => {
	return db
		.select({ usedCoverLetterContent: jobPostingTable.usedCoverLetterContent })
		.from(jobPostingTable)
		.where(eq(jobPostingTable.id, id))
		.then((rows) => rows.at(0));
};

export const selectJobDescriptionByJobId = async (id: number) => {
	return db
		.select({ jobDescription: jobPostingTable.jobDescription })
		.from(jobPostingTable)
		.where(eq(jobPostingTable.id, id))
		.then((rows) => rows.at(0));
};

export const selectDataForReanalyze = async (jobPostingId: number) => {
	return Promise.all([
		db
			.select({
				jobDescription: jobPostingTable.jobDescription,
				title: jobPostingTable.title,
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
