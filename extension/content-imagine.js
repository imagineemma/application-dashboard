(async () => {
    const ALERT_MSG =
        "Website has been changed. Please contact farhadham2@gmail.com for new updates.";

    const getTextContent = (selectors, index = 0) => {
        // Normalize to array
        const selectorList = Array.isArray(selectors) ? selectors : [selectors];

        for (const selector of selectorList) {
            let element;
            if (index === null) {
                element = document.querySelector(selector);
            } else {
                const elements = document.querySelectorAll(selector);
                element = elements[index];
            }

            if (element) {
                const text = element.textContent?.trim();
                if (text) return text;
            }
        }

        // Return undefined if none matched
        return undefined;
    };

    // Getting job URL
    const jobUrl = new URL(window.location.href);
    const url = jobUrl.origin + jobUrl.pathname;

    // Get posting date text and convert to ISO format
    const postingDateText = getTextContent(["[color='text.subtle']", ".posting-date"], null);
    let postingDate;
    if (postingDateText) {
        try {
            postingDate = new Date(
                postingDateText.replace(/^Posted on /, "")
            ).toISOString();
        } catch {
            postingDate = undefined;
        }
    }

    // Get location (3rd element in the matching list)
    const location = getTextContent(["[class='sc-beqWaB bpXRKw']", "[class='sc-aXZVg dKubqp']"], 2);

    // Get job title (first h2)
    const title = getTextContent(["h2", ".job-title"], null);

    // Get job description
    const jobDescription = getTextContent(
        ["[data-testid='careerPage']", ".job-description"],
        null
    );

    // Get company name (1st element in the matching list)
    const companyName = getTextContent(["[class='sc-beqWaB bpXRKw']", "[class='sc-aXZVg dKubqp']"], 0);

    // ✅ Collect all missing variables before creating data
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

    // 🚨 Alert and throw error if variables are missing
    if (missing.length > 0) {
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
        platform: "Imagine jobs",
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
        }
    );
})();