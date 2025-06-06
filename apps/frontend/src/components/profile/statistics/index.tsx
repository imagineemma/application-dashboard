"use client";

import { Alert } from "@heroui/alert";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Bar, BarChart, Tooltip, XAxis } from "recharts";

import { handleApiResponse } from "../../../lib/api";
import { getUserStatistics } from "../../../services/user";

const Statistics = () => {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["user-statistics"],
		queryFn: () => handleApiResponse(getUserStatistics()),
	});

	if (isPending) return <Spinner />;

	if (isError) return <Alert color="danger" title={error.message} />;

	const formattedData = data.lastWeekApplications.map((item) => ({
		...item,
		date: format(item.date, "dd MMM"),
	}));

	return (
		<div className="grid grid-cols-2 gap-2">
			<Card>
				<CardBody className="gap-1">
					<p className="text-sm">Total applied jobs</p>
					<p className="font-semibold text-3xl">{data.totalApplications}</p>
					<p className="font-semibold text-2xl mt-12">Coming soon...</p>
				</CardBody>
			</Card>

			<Card>
				<CardBody className="gap-2">
					<p className="text-sm">Jobs applied last 7 days</p>
					<p className="font-semibold text-3xl">
						{data.lastWeekApplications.reduce(
							(acc, curr) => acc + curr.count,
							0,
						)}
					</p>
					<BarChart
						width={500}
						height={200}
						data={formattedData}
						className="mt-8"
					>
						<XAxis dataKey="date" />
						<Bar dataKey="count" fill="hsl(var(--heroui-primary))" />
						<Tooltip
							contentStyle={{
								borderRadius: "0.5rem",
							}}
						/>
					</BarChart>
				</CardBody>
			</Card>
		</div>
	);
};

export default Statistics;
