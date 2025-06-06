import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HomeItemCard } from "../components/applied/card-item";
import { jobPostingItemPerPage } from "../data/constants";
import { handleApiResponse } from "../lib/api";
import { getAppliedJobPostings } from "../services/job-posting";

export const Route = createFileRoute("/applied")({
	component: AppliedComponent,
});

function AppliedComponent() {
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm.trim());

			setPage(1);
		}, 500);
		return () => clearTimeout(handler);
	}, [searchTerm]);

	const { data, isPending, isError, error } = useQuery({
		queryKey: ["job-postings", "applied", page, debouncedSearchTerm],
		queryFn: () =>
			handleApiResponse(
				getAppliedJobPostings({
					query: { page: page.toString(), name: debouncedSearchTerm },
				}),
			),
		placeholderData: keepPreviousData,
	});

	if (isPending) return <Spinner />;

	if (isError) return <Alert color="danger" title={error.message} />;

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-medium">Applied jobs</h1>

			<Input
				className="w-1/2"
				label="Search by company"
				labelPlacement="outside"
				type="text"
				value={searchTerm}
				onValueChange={setSearchTerm}
				isRequired
				variant="bordered"
			/>

			{data.length === 0 ? (
				<p className="text-center font-semibold text-2xl">
					No jobs found. Time to go scavenging!
				</p>
			) : (
				<div className="space-y-8">
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
