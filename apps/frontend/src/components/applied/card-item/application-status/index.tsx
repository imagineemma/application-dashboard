"use client";

import { format } from "date-fns";

import UpdateStatusModal from "./update-status-modal";

type Status = {
	date: string;
	label: string;
	type: "neutral" | "success" | "danger";
};

type Props = {
	id: number;
	statuses: {
		appliedAt: string;
		failedInterviewAt: string | null;
		invitedAt: string | null;
		jobOfferAt: string | null;
		rejectedAt: string | null;
	};
};

const ApplicationStatus = ({ statuses, id }: Props) => {
	const { appliedAt, failedInterviewAt, invitedAt, jobOfferAt, rejectedAt } =
		statuses;

	const getStatusTimeline = (): Status[] => {
		const timeline: Status[] = [
			{
				date: appliedAt,
				label: "Applied at",
				type: "neutral",
			},
		];

		// Add invitation status if available
		if (rejectedAt) {
			timeline.push({
				date: rejectedAt,
				label: "Rejected at",
				type: "danger",
			});
		} else if (invitedAt) {
			timeline.push({
				date: invitedAt,
				label: "Invited to interview at",
				type: "success",
			});

			// Add interview outcome if available
			if (failedInterviewAt) {
				timeline.push({
					date: failedInterviewAt,
					label: "Failed interview at",
					type: "danger",
				});
			} else if (jobOfferAt) {
				timeline.push({
					date: jobOfferAt,
					label: "Job offer at",
					type: "success",
				});
			}
		}

		return timeline;
	};

	const statusTimeline = getStatusTimeline();
	const showInvitationUpdate = !rejectedAt && !invitedAt;
	const showInterviewUpdate = invitedAt && !failedInterviewAt && !jobOfferAt;

	return (
		<div className="space-y-1">
			{statusTimeline.map((status) => (
				<p
					key={status.label}
					className={`text-sm ${
						status.type === "danger"
							? "text-danger"
							: status.type === "success"
								? "text-success"
								: ""
					}`}
				>
					{status.label}{" "}
					<span className="text-base font-semibold text-foreground">
						{formatDate(status.date)}
					</span>
				</p>
			))}

			{showInvitationUpdate && (
				<UpdateStatusModal
					id={id}
					primaryAction={{
						label: "Invited to interview",
						payloadKey: "invitedAt",
						color: "success",
					}}
					secondaryAction={{
						label: "Application rejected",
						payloadKey: "rejectedAt",
						color: "danger",
					}}
				/>
			)}
			{showInterviewUpdate && (
				<UpdateStatusModal
					id={id}
					primaryAction={{
						label: "Got a job offer",
						payloadKey: "jobOfferAt",
						color: "success",
					}}
					secondaryAction={{
						label: "Failed interview",
						payloadKey: "failedInterviewAt",
						color: "danger",
					}}
				/>
			)}
		</div>
	);
};

export default ApplicationStatus;

const formatDate = (dateStr: string) => {
	return format(new Date(dateStr), "EEEE, dd/MM/yyyy");
};
