"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import type { InferResponseType } from "hono";
import { MoveRight } from "lucide-react";

import PostingCardDetails from "../../common/posting-card-details";

import type { getAppliedJobPostings } from "../../../services/job-posting";
import ApplicationStatus from "./application-status";
import ImagineDetails from "./imagine-details";
import JobDescription from "./job-description";
import UsedCoverLetter from "./used-cover-letter";
import UsedResume from "./used-resume";

export const HomeItemCard = ({
	data,
}: {
	data: InferResponseType<typeof getAppliedJobPostings, 200>[number];
}) => {
	const {
		appliedAt,
		id,
		url,
		failedInterviewAt,
		invitedAt,
		jobOfferAt,
		rejectedAt,
		applyComment,
		imagineApplicationStatus,
		imagineApplicationId,
		imagineCoachComment,
	} = data;

	return (
		<Card className="border-1 border-divider" shadow="md">
			<PostingCardDetails data={data} />

			<div className="p-4 space-y-4">
				<p>
					Apply comment:{" "}
					{applyComment ? (
						<span className="text-sm whitespace-pre">{applyComment}</span>
					) : null}
				</p>

				<ImagineDetails
					data={{
						imagineApplicationStatus,
						imagineApplicationId,
						imagineCoachComment,
					}}
				/>
			</div>

			<div className="flex items-end gap-4 p-4">
				<div className="space-y-4 flex-1">
					{appliedAt ? (
						<ApplicationStatus
							id={id}
							statuses={{
								appliedAt,
								failedInterviewAt,
								invitedAt,
								jobOfferAt,
								rejectedAt,
							}}
						/>
					) : null}
				</div>

				<div className="flex items-center ml-auto gap-2">
					<JobDescription id={id} />
					<UsedCoverLetter id={id} />
					<UsedResume id={id} />
					<a target="_blank" rel="noopener noreferrer" href={url}>
						<Button color="primary" endContent={<MoveRight size={20} />}>
							Visit posting
						</Button>
					</a>
				</div>
			</div>
		</Card>
	);
};
