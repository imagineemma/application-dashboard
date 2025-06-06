import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { formatDistanceToNow } from "date-fns";

type Props = {
	data: {
		title: string;
		postingDate: string | null;
		platform: string;
		overallMatch: number;
		location: string;
		relocationAvailable: boolean;
		languageMatch: boolean;
		postingLanguage: string;
		companyName: string;
		recruiter: string | null;
		companyUrl: string | null;
		keySkillsMatched: string[];
		keySkillsMissing: string[];
	};
};

const PostingCardDetails = ({ data }: Props) => {
	const {
		title,
		postingDate,
		platform,
		overallMatch,
		location,
		relocationAvailable,
		languageMatch,
		postingLanguage,
		companyName,
		recruiter,
		companyUrl,
		keySkillsMatched,
		keySkillsMissing,
	} = data;
	return (
		<>
			<div className="p-4 flex gap-8 items-start">
				<div className="flex-1 items-start space-y-2">
					<p className="text-xl">{title}</p>
					<div className="flex gap-2 items-center">
						{postingDate ? (
							<p>Posted {formatDistanceToNow(new Date(postingDate))} ago</p>
						) : null}
						<Chip color="primary" size="sm">
							{platform}
						</Chip>
					</div>
					<Chip
						color={
							overallMatch >= 80
								? "success"
								: overallMatch >= 50
									? "warning"
									: "danger"
						}
						size="lg"
					>
						{overallMatch}% match
					</Chip>
				</div>

				<div className="flex flex-col flex-1 items-start">
					<div className="flex gap-2">
						<div>{location}</div>
						<Chip color={relocationAvailable ? "success" : "danger"} size="sm">
							Foreigners {relocationAvailable ? "accepted" : "not accepted"}
						</Chip>
					</div>
					<p className="text-muted-foreground">
						Post language{" "}
						<span className="font-semibold">{postingLanguage}</span>
					</p>
					<p>
						Additional language is{" "}
						{languageMatch ? (
							<span className="text-success">optional</span>
						) : (
							<span className="text-danger">mandatory</span>
						)}
					</p>
				</div>

				<div className="flex flex-col items-end gap-2">
					<div className="text-2xl font-semibold">{companyName}</div>
					<div className="flex items-center gap-2">
						{recruiter ? (
							<a target="_blank" rel="noopener noreferrer" href={recruiter}>
								<Button size="sm">Recruiter</Button>
							</a>
						) : null}
						{companyUrl ? (
							<a target="_blank" rel="noopener noreferrer" href={companyUrl}>
								<Button size="sm" color="primary">
									Company details
								</Button>
							</a>
						) : null}
					</div>
				</div>
			</div>

			<div className="p-4 space-y-4">
				<div className="space-y-2">
					<div className="flex gap-2">
						<div className="basis-28">Matched skills</div>
						<div className="flex flex-wrap gap-2">
							{keySkillsMatched.map((item) => (
								<Chip key={item} color="success" size="sm">
									{item}
								</Chip>
							))}
						</div>
					</div>
					<div className="flex gap-2">
						<div className="basis-28">Missing skills</div>
						<div className="flex flex-wrap gap-2">
							{keySkillsMissing.map((item) => (
								<Chip key={item} color="warning" size="sm">
									{item}
								</Chip>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PostingCardDetails;
