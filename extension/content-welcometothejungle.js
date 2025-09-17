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

	// Get job URL
	const url = window.location.href;

	// Get job title and company
	const titleAndCompanyElement = document.querySelector(
		"[data-testid='job-title']",
	);

	let title, companyName, companyUrl;
	if (titleAndCompanyElement) {
		const titleNode = titleAndCompanyElement.childNodes[0];
		title = titleNode?.textContent?.trim();

		const companyElement = titleAndCompanyElement.querySelector("a");
		if (companyElement) {
			companyName = companyElement.textContent.trim();
			companyUrl = companyElement.getAttribute("href");
		}
	}

	// Get location
	const location = getTextContent("[data-testid='job-location-tag']");

	// Get job description
	let jobDescription;
	const roleHeading = Array.from(document.querySelectorAll("h2")).find(
		(el) => el.textContent.trim() === "Role",
	);
	if (roleHeading && roleHeading.nextElementSibling) {
		jobDescription = roleHeading.nextElementSibling.innerText.trim();
	}

	// ✅ Collect all missing variables before creating `data`
	const requiredVars = {
		url,
		title,
		jobDescription,
		companyName,
		location,
		companyUrl,
	};
	const missing = Object.entries(requiredVars)
		.filter(([_, value]) => !value)
		.map(([key]) => key);

	// 🚨 Keep alerting until user acknowledges the missing variables
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
		companyUrl,
		platform: "welcometothejungle",
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
