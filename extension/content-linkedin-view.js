(async () => {
  const ALERT_MSG =
    "Website has been changed. Please contact farhadham2@gmail.com for new updates.";

  const getTextContent = (selectors) => {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.textContent.trim();
      }
    }
    return undefined;
  };

  const getAttribute = (selectors, attr) => {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.getAttribute(attr);
      }
    }
    return undefined;
  };

  // Get job ID
  const parts = window.location.href.split("/");
  const jobIdIndex = parts.indexOf("view") + 1;
  const jobId = parts[jobIdIndex];
  const url = `https://linkedin.com/jobs/view/${jobId}`;

  // Get posting date
  const postingDateText = getTextContent([
    "[class='t-black--light mt2 job-details-jobs-unified-top-card__tertiary-description-container'] > span > span:nth-child(3)",
  ]);
  const postingDate = postingDateText
    ? relativeTimeToISO(postingDateText)
    : undefined;

  // Get location
  const location = getTextContent([
    "[class='t-black--light mt2 job-details-jobs-unified-top-card__tertiary-description-container'] > span > span:nth-child(1)",
  ]);

  // Get title
  const title = getTextContent(["h1"]);

  // Get job description
  const jobDescription = getTextContent(["#job-details > div.mt4 > p"]);

  // Get company info
  const companyElement = getTextContent([
    "[class='job-details-jobs-unified-top-card__company-name'] > a",
  ]);
  let companyName, companyUrl;
  if (companyElement) {
    companyName = companyElement;
    const el = document.querySelector(
      "[class='job-details-jobs-unified-top-card__company-name'] > a"
    );
    companyUrl = el?.getAttribute("href")?.replace(/\/life\/?$/, "");
  }

  // Get recruiter info
  const recruiter = getAttribute(
    ["div.hirer-card__hirer-information > a"],
    "href"
  );

  // ✅ Collect all missing variables before creating `data`
  const requiredVars = {
    url,
    title,
    jobDescription,
    companyName,
    companyUrl,
    postingDate,
    location,
  };
  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    alert(`${ALERT_MSG}\nMissing variables: ${missing.join(", ")}`);
    throw new Error(`Missing variables: ${missing.join(", ")}`);
  }

  const data = {
    url,
    title,
    jobDescription,
    companyName,
    companyUrl,
    postingDate,
    recruiter,
    location,
    platform: "LinkedIn",
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

function relativeTimeToISO(relativeTime) {
  const now = new Date();

  if (relativeTime.startsWith("Reposted ")) {
    relativeTime = relativeTime.slice("Reposted ".length);
  }

  const match = relativeTime.match(
    /(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s+ago/
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
