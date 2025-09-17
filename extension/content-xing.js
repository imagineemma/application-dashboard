(async () => {
	const ALERT_MSG =
		"Website has been changed. Please contact farhadham2@gmail.com for new updates.";

	const getTextContent = (selector) => {
		const element = document.querySelector(selector);
		if (!element) {
			return undefined;
		}
		return element.textContent.trim();
	};

	const getElementByIndex = (selector, index = 0) => {
		const elements = document.querySelectorAll(selector);
		if (!elements || elements.length <= index) {
			return undefined;
		}
		return elements[index].textContent.trim();
	};

	// Getting job ID (full URL)
	const url = window.location.href;

	// Posting date
	const postingDateText = getTextContent(
		"[data-testid='job-details-published-date']",
	);
	const postingDate = postingDateText
		? relativeTimeToISO(postingDateText)
		: undefined;

	// Location
	const location = getTextContent("[data-testid='job-fact-location']");

	// Job Title
	const title = getTextContent("[data-testid='job-details-title'] > h1");

	// Job Description
	const jobDescription = getElementByIndex(
		"[data-testid='expandable-content']",
		0,
	);

	// Company Name
	const companyName = getTextContent(
		"[data-testid='job-details-company-info-name']",
	);

	// ✅ Collect all required variables before creating `data`
	const requiredVars = {
		url,
		title,
		jobDescription,
		companyName,
		postingDate,
		location,
	};
	const missing = Object.entries(requiredVars)
		.filter(([_, value]) => !value)
		.map(([key]) => key);

	while (missing.length > 0) {
		alert(`${ALERT_MSG}\nMissing variables: ${missing.join(", ")}`);
		throw new Error(`Missing variables: ${missing.join(", ")}`);
	}

	const data = {
		url,
		title,
		jobDescription,
		companyName,
		postingDate,
		location,
		platform: "Xing",
	};

	// Send data to local API
	chrome.runtime.sendMessage(
		{
			action: "postJobData",
			data,
		},
		(response) => {
			if (response) {
				if (!response.success && response.error) {
					chrome.runtime.sendMessage({
						action: "showError",
						error: response.error,
					});
				} else {
					chrome.runtime.sendMessage({
						action: "showSuccess",
						message: "Job data saved successfully!",
					});
				}
			}
		},
	);
})();

function relativeTimeToISO(relativeTime) {
	const now = new Date();

	const match = relativeTime.match(
		/(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s+ago/,
	);

	if (match) {
		const value = Number.parseInt(match[1], 10);
		const unit = match[2].toLowerCase();

		switch (true) {
			case unit.startsWith("minute"):
				now.setMinutes(now.getMinutes() - value);
				break;
			case unit.startsWith("hour"):
				now.setHours(now.getHours() - value);
				break;
			case unit.startsWith("day"):
				now.setDate(now.getDate() - value);
				break;
			case unit.startsWith("week"):
				now.setDate(now.getDate() - value * 7);
				break;
			case unit.startsWith("month"):
				now.setMonth(now.getMonth() - value);
				break;
			case unit.startsWith("year"):
				now.setFullYear(now.getFullYear() - value);
				break;
			default:
				return undefined;
		}

		return now.toISOString();
	}

	return undefined;
}
