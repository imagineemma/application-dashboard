document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const statusEl = document.getElementById("status");

  const setStatus = (text, cls = "") => {
    statusEl.textContent = text;
    statusEl.className = cls;
  };

  // Map URL fragments to content scripts
  const scriptMap = [
    { match: "https://jobs.joinimagine.com/", file: "content-imagine.js" },
    { match: "https://www.stepstone.de/jobs", file: "content-stepstone.js" },
    { match: "linkedin.com/jobs/view", file: "content-linkedin-view.js" },
    {
      match: "linkedin.com/jobs",
      file: "content-linkedin-list.js",
      exclude: "linkedin.com/jobs/view",
    },
    { match: "de.indeed.com", file: "content-indeed.js" },
    { match: "xing.com/jobs", file: "content-xing.js" },
    { match: "https://en.it-jobs.de/", file: "content-itjobs.js" },
    {
      match: "https://app.welcometothejungle.com/jobs/",
      file: "content-welcometothejungle.js",
    },
  ];

  // Display error or success message on popup
  chrome.runtime.onMessage.addListener(({ action, error, message }) => {
    if (action === "showError" && error) {
      setStatus(error, "error");
    } else if (action === "showSuccess" && message) {
      setStatus(message, "success");
    }
    return true;
  });

  // Handle parsing data
  startBtn.addEventListener("click", async () => {
    setStatus("Processing...");

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const url = tab.url || "";

      // find the first rule that matches (and doesn’t hit an exclusion)
      const rule = scriptMap.find(
        (r) =>
          url.includes(r.match) && (!r.exclude || !url.includes(r.exclude)),
      );

      // Not supported websites
      if (!rule) {
        return setStatus("This extension only works on Jobs pages.", "error");
      }

      // Process on the suitable file related to the website
      chrome.scripting.executeScript(
        { target: { tabId: tab.id }, files: [rule.file] },
        () => {
          if (chrome.runtime.lastError) {
            setStatus(`Error: ${chrome.runtime.lastError.message}`, "error");
          } else {
            setStatus("Loading!", "success");
          }
        },
      );
    } catch (err) {
      setStatus(`Error: ${err.message}`, "error");
    }
  });
});
