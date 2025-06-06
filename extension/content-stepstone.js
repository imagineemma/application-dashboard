(async () => {
  const safeTextContent = (getElementFn, required = true) => {
    try {
      const el = getElementFn();
      if (!el && required) {
        alert(ALERT_MSG);
        return undefined;
      }
      return el?.textContent.trim();
    } catch {
      if (required) alert(ALERT_MSG);
      return undefined;
    }
  };

  const url = window.location.href;

  // Posting date
  const postingDate = relativeTimeToISO(
    safeTextContent(() =>
      document
        .querySelector('svg[data-genesis-element="CalendarIcon"]')
        ?.parentElement?.parentElement?.querySelector(
          ':scope > *:not(:has(svg[data-genesis-element="CalendarIcon"])) span',
        ),
    ),
  );

  // Location
  const location = safeTextContent(() =>
    document
      .querySelectorAll('svg[data-genesis-element="MapMarkerIcon"]')[1]
      ?.parentElement?.parentElement?.querySelector(
        ':scope > *:not(:has(svg[data-genesis-element="MapMarkerIcon"])) span',
      ),
  );

  // Title
  const title = safeTextContent(() =>
    document.querySelector("span[data-at='header-job-title']"),
  );

  // Job description
  const jobDescription = safeTextContent(() =>
    document.querySelector("[data-at='job-ad-content']"),
  );

  // Company name
  const companyName = safeTextContent(() =>
    document
      .querySelectorAll('svg[data-genesis-element="BriefcaseIcon"]')[0]
      ?.parentElement?.parentElement?.querySelector(
        ':scope > *:not(:has(svg[data-genesis-element="BriefcaseIcon"])) span',
      ),
  );

  const data = {
    url,
    title,
    jobDescription,
    companyName,
    postingDate,
    location,
    platform: "Stepstone",
  };

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

  if (!relativeTime) return undefined;

  if (relativeTime.startsWith("Reposted ")) {
    relativeTime = relativeTime.slice("Reposted ".length);
  }

  const match = relativeTime.match(
    /(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s+ago/,
  );

  if (match) {
    const value = parseInt(match[1], 10);
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
