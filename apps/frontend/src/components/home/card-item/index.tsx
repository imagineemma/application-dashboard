"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import type { InferResponseType } from "hono";
import { MoveRight } from "lucide-react";

import type { getJobPostings } from "../../../services/job-posting";
import PostingCardDetails from "../../common/posting-card-details";
import { CoverLetter } from "./cover-letter";
import { DeleteDialog } from "./delete";
// import DownloadResume from "./download-resume";
import JobDescription from "./job-description";
import { MarkAsApplied } from "./mark-as-applied";
import Reanalyze from "./reanalyze";

export const HomeItemCard = ({
	data,
}: {
	data: InferResponseType<typeof getJobPostings, 200>[number];
}) => {
	const { suggestions, companyName, id, recruiter, url } = data;

	return (
		<Card className="border-1 border-divider" shadow="md">
			<PostingCardDetails data={data} />
			<div className="px-4">
				<Accordion variant="bordered">
					<AccordionItem
						key="1"
						aria-label="Suggestion accordion"
						title="Suggestions"
					>
						<ul className="list-disc pl-5">
							{suggestions.map((item, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<li key={index}>{item}</li>
							))}
						</ul>
					</AccordionItem>
				</Accordion>
			</div>

			<div className="flex items-end gap-4 p-4">
				<div className="flex items-center ml-auto gap-2">
					{/* <DownloadResume title={title} /> */}
					<Reanalyze id={id} />
					<CoverLetter id={id} companyName={companyName} />
					<MarkAsApplied id={id} recruiter={recruiter} />
					<DeleteDialog id={id} />
					<JobDescription id={id} />
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
