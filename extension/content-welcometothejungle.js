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

  // Get job URL
  const url = window.location.href;

  // Get job title and company
  const titleAndCompanyElement = document.querySelector(
    "[data-testid='job-title']",
  );
  if (!titleAndCompanyElement) {
    alert(ALERT_MSG);
    return;
  }

  const titleNode = titleAndCompanyElement.childNodes[0];
  const title = titleNode?.textContent?.trim();

  if (!title) {
    alert(ALERT_MSG);
    return;
  }

  const companyElement = titleAndCompanyElement.querySelector("a");
  if (!companyElement) {
    alert(ALERT_MSG);
    return;
  }

  const companyName = companyElement.textContent.trim();
  const companyUrl = companyElement.getAttribute("href");

  // Get location
  const location = getTextContent("[data-testid='job-location-tag']");

  // Get job description
  const roleHeading = Array.from(document.querySelectorAll("h2")).find(
    (el) => el.textContent.trim() === "Role",
  );

  if (!roleHeading || !roleHeading.nextElementSibling) {
    alert(ALERT_MSG);
    return;
  }

  const jobDescription = roleHeading.nextElementSibling.innerText.trim();

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
