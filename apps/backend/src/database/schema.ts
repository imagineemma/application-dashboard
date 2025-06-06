import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { geminiCoverLetterSystemPrompt } from "./constants";

export const jobPostingTable = sqliteTable("job_posting", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	location: text("location").notNull(),
	title: text("title").notNull(),
	jobDescription: text("job_description").notNull(),
	platform: text("platform").notNull(),
	companyName: text("company_name").notNull(),
	companyUrl: text("company_url"),
	url: text("url").notNull().unique(),
	postingDate: text("posting_date"),
	recruiter: text("recruiter"),
	appliedAt: text("applied_at"),
	rejectedAt: text("rejected_at"),
	invitedAt: text("invited_at"),
	jobOfferAt: text("job_offer_at"),
	failedInterviewAt: text("failed_interview_at"),
	applyComment: text("apply_comment"),
	isDeleted: integer("is_deleted", {
		mode: "boolean",
	})
		.default(false)
		.notNull(),
	usedResumeContent: text("used_resume_content"),
	usedCoverLetterContent: text("used_cover_letter_content"),
	imagineApplicationId: text("imagine_application_id"),
	createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const jobPostingAnalyzeTable = sqliteTable(
	"job_posting_analyze",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		jobsPostingId: integer("jobs_posting_id")
			.references(() => jobPostingTable.id, { onDelete: "cascade" })
			.notNull(),
		postingLanguage: text("posting_language").notNull(),
		relocationAvailable: integer("relocation_available", {
			mode: "boolean",
		}).notNull(),
		languageMatch: integer("language_match", { mode: "boolean" }).notNull(),
		keySkillsMatched: text("key_skills_matched", { mode: "json" })
			.notNull()
			.$type<string[]>()
			.default([]),
		keySkillsMissing: text("key_skills_missing", { mode: "json" })
			.notNull()
			.$type<string[]>()
			.default([]),
		suggestions: text("suggestions", { mode: "json" })
			.notNull()
			.$type<string[]>()
			.default([]),
		overallMatch: integer("overall_match").notNull(),
		createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [index("job_posting_id_idx").on(table.jobsPostingId)],
);

export const userTable = sqliteTable("user", {
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	geminiKey: text("gemini_key"),
	resumeContent1: text("resume_content_1"),
	resumeContent2: text("resume_content_2"),
	resumeContent3: text("resume_content_3"),
	coverLetterPrompt: text("cover_letter_prompt")
		.notNull()
		.default(geminiCoverLetterSystemPrompt),
	resumeGoogleDocId: text("resume_google_doc_id"),
	coverLetterGoogleDocId: text("cover_letter_google_doc_id"),
	googleApiCredential: text("google_api_credential"),
});
