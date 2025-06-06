(async () => {
  const ALERT_MSG =
    "Website has been changed. Please contact farhadham2@gmail.com for new updates.";

  const getTextContent = (selector, required = true) => {
    const element = document.querySelector(selector);
    if (!element) {
      if (required) alert(ALERT_MSG);
      return undefined;
    }
    return element.textContent.trim();
  };

  // Getting job ID
  const jobUrl = new URL(window.location.href);
  const vjk = jobUrl.searchParams.get("vjk");
  const url = `https://indeed.com/viewjob?jk=${vjk}`;

  // Getting location: try primary selector, fallback to secondary
  let location = getTextContent(
    "[data-testid='jobsearch-JobInfoHeader-companyLocation']",
    false,
  );
  if (!location) {
    location = getTextContent(
      "[data-testid='inlineHeader-companyLocation']",
      false,
    );
  }
  if (!location) alert(ALERT_MSG);

  // Find the job title
  const title = getTextContent("[data-testid='jobsearch-JobInfoHeader-title']");

  // Job description
  const jobDescription = getTextContent("#jobDescriptionText");

  // Company name
  const companyName = getTextContent("[data-company-name='true']");

  const data = {
    url,
    title,
    jobDescription,
    companyName,
    location,
    platform: "Indeed",
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
