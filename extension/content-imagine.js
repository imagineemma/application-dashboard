(async () => {
  const ALERT_MSG =
    "Website has been changed. Please contact farhadham2@gmail.com for new updates.";

  const getTextContent = (selector, index = 0, required = true) => {
    let element;
    if (index === null) {
      element = document.querySelector(selector);
    } else {
      const elements = document.querySelectorAll(selector);
      element = elements[index];
    }
    if (!element) {
      if (required) alert(ALERT_MSG);
      return undefined;
    }
    return element.textContent.trim();
  };

  // Getting job URL
  const jobUrl = new URL(window.location.href);
  const url = jobUrl.origin + jobUrl.pathname;

  // Get posting date text and convert to ISO format
  const postingDateText = getTextContent("[color='text.subtle']", null);
  let postingDate;
  if (postingDateText) {
    try {
      postingDate = new Date(
        postingDateText.replace(/^Posted on /, ""),
      ).toISOString();
    } catch {
      alert(ALERT_MSG);
      postingDate = undefined;
    }
  }

  // Get location (3rd element in the matching list)
  const location = getTextContent("[class='sc-beqWaB bpXRKw']", 2);

  // Get job title (first h2)
  const title = getTextContent("h2", null);

  // Get job description
  const jobDescription = getTextContent("[data-testid='careerPage']", null);

  // Get company name (1st element in the matching list)
  const companyName = getTextContent("[class='sc-beqWaB bpXRKw']", 0);

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
    },
  );
})();
