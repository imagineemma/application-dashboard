import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HomeItemCard } from "../components/home/card-item";
import { jobPostingItemPerPage } from "../data/constants";
import { handleApiResponse } from "../lib/api";
import { getJobPostings } from "../services/job-posting";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const [page, setPage] = useState(1);

	const { data, isPending, isError, error } = useQuery({
		queryKey: ["job-postings", "not-applied", page],
		queryFn: () =>
			handleApiResponse(getJobPostings({ query: { page: page.toString() } })),
		placeholderData: keepPreviousData,
	});

	if (isPending) return <Spinner />;

	if (isError) return <Alert color="danger" title={error.message} />;

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-medium">New jobs</h1>
			{data.length === 0 ? (
				<p className="text-center font-semibold text-2xl">
					No jobs found. Time to go scavenging!
				</p>
			) : (
				<div className="space-y-12">
					{data.map((item) => (
						<HomeItemCard key={item.id} data={item} />
					))}
				</div>
			)}
			<div className="flex items-center gap-4 mx-auto justify-center">
				<Button
					onPress={() => {
						if (page > 1) {
							setPage((prev) => prev - 1);
							window.scrollTo(0, 0);
						}
					}}
					color="primary"
					size="sm"
				>
					Previous page
				</Button>
				{page}
				<Button
					onPress={() => {
						if (data.length === jobPostingItemPerPage) {
							setPage((prev) => prev + 1);
							window.scrollTo(0, 0);
						}
					}}
					color="primary"
					size="sm"
				>
					Next page
				</Button>
			</div>
		</div>
	);
}
