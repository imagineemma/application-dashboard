import { honoClientJobPosting } from "../lib/api";

export const getJobPostings = honoClientJobPosting.index.$get;
export const getAppliedJobPostings = honoClientJobPosting.applied.$get;
export const markJobPostingAsApplied =
	honoClientJobPosting[":id"].applied.$patch;
export const deleteJobPosting = honoClientJobPosting[":id"].$delete;
export const updateApplicationStatus =
	honoClientJobPosting[":id"]["application-status"].$patch;
export const createJobPosting = honoClientJobPosting.index.$post;
export const reanalyzeJobPosting = honoClientJobPosting[":id"].reanalyze.$post;
export const getUsedResume = honoClientJobPosting[":id"]["used-resume"].$get;
export const getUsedCoverLetter =
	honoClientJobPosting[":id"]["used-cover-letter"].$get;
export const getJobDescription =
	honoClientJobPosting[":id"]["job-description"].$get;
export const downloadResume = honoClientJobPosting["download-resume"].$post;
