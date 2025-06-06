import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";

type Props = {
	data: {
		imagineApplicationId: string | null;
		imagineApplicationStatus: string | null;
		imagineCoachComment: string | null;
	};
};

const ImagineDetails = ({ data }: Props) => {
	const {
		imagineApplicationId,
		imagineApplicationStatus,
		imagineCoachComment,
	} = data;

	return (
		<Card className="border border-gray-700 p-4 space-y-2">
			<span className="font-semibold">Imagine details</span>
			{imagineApplicationId ? (
				<div className="text-sm">Id: {imagineApplicationId}</div>
			) : null}
			{imagineApplicationStatus ? (
				<Chip color={getStatusColor(imagineApplicationStatus)}>
					{imagineApplicationStatus}
				</Chip>
			) : null}
			{imagineCoachComment ? (
				<div className="text-sm">Coach comment: {imagineCoachComment}</div>
			) : null}
		</Card>
	);
};

export default ImagineDetails;

const getStatusColor = (status: string) => {
	switch (status) {
		case "Find better match":
			return "danger";
		case "Recommended":
			return "success";
		case "To be recommended":
			return "warning";
		default:
			return "default";
	}
};
