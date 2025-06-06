import type { InferSelectModel } from "drizzle-orm";
import type { availableResumeList } from "../constants";
import type {
	jobPostingAnalyzeTable,
	jobPostingTable,
	userTable,
} from "../database/schema";
import type coverLetterRoute from "../routes/cover-letter";
import type jobPostingRoute from "../routes/job-posting";
import type userRoute from "../routes/user";

export type CoverLetterRouteType = typeof coverLetterRoute;
export type UserRouteType = typeof userRoute;
export type JobPostingRouteType = typeof jobPostingRoute;

export type UserType = InferSelectModel<typeof userTable>;
export type JobPostingType = InferSelectModel<typeof jobPostingTable>;
export type JobPostingAnalyzeType = InferSelectModel<
	typeof jobPostingAnalyzeTable
>;

export type AvailableResumeListType = (typeof availableResumeList)[number];
export type ImagineBridgeApiStatusType = {
	rowId: string;
	email: string;
	status: string;
	comment: string;
}[];

export type ImagineBridgeApiInsertedRowType = {
	rowNumber: string;
};
