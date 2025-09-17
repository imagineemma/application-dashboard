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

	// Getting job URL
	const url = window.location.href;

	// Get job location
	const locationBase = getTextContent(".detail-region");
	const location = locationBase ? `${locationBase}, Germany` : undefined;

	// Get job title
	const title = getTextContent("#advert-canvas > h1");

	// Get job description
	const jobDescription = getTextContent("#advert-canvas");

	// Get company name
	const companyName = getTextContent(
		"#detail-company-name-region > div:nth-of-type(2)",
	);

	// ✅ Collect all required variables before creating `data`
	const requiredVars = {
		url,
		title,
		jobDescription,
		companyName,
		location,
	};
	const missing = Object.entries(requiredVars)
		.filter(([_, value]) => !value)
		.map(([key]) => key);

	// 🚨 Keep alerting until user acknowledges missing variables
	while (missing.length > 0) {
		alert(`${ALERT_MSG}\nMissing variables: ${missing.join(", ")}`);
		throw new Error(`Missing variables: ${missing.join(", ")}`);
	}

	const data = {
		url,
		title,
		jobDescription,
		companyName,
		location,
		platform: "it-jobs",
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
