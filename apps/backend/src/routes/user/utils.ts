import { format, subDays } from "date-fns";

type LastWeekCount = {
	date: string;
	count: number;
};

export const populateCompleteWeek = (
	rawData: LastWeekCount[],
): LastWeekCount[] => {
	const result: LastWeekCount[] = [];

	for (let i = 6; i >= 0; i--) {
		const currentDate = subDays(new Date(), i);
		const formattedCurrentDate = format(currentDate, "yyyy-MM-dd");
		const rawDateCurrentDate = rawData.find(
			(item) => item.date === formattedCurrentDate,
		);

		result.push(rawDateCurrentDate ?? { count: 0, date: formattedCurrentDate });
	}

	return result;
};
