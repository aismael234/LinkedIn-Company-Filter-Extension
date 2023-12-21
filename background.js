chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.url.includes("www.linkedin.com/jobs/search/")) {
    chrome.storage.local.get("excludedCompanies", (result) => {
      if (result.excludedCompanies) {
        let currentUrl = new URL(details.url);
        let currentKeywords = currentUrl.searchParams.get("keywords") || "";
        if (currentKeywords !== "") {
          // Use regex to match all occurrences of "NOT [company name]"
          let existingExclusions =
            currentKeywords.match(/NOT '.*?'|NOT ".*?"/g) || [];

          let newExclusions = result.excludedCompanies.filter((company) => {
            return (
              !existingExclusions.includes(`NOT ${company}`) &&
              !existingExclusions.includes(`NOT "${company}"`) &&
              !existingExclusions.includes(`NOT '${company}'`)
            );
          });

          if (newExclusions.length > 0) {
            let newExclusionString = newExclusions.reduce(
              (query, company) => `${query} NOT "${company}"`,
              ""
            );
            let newUrl = modifyUrlParameter(
              details.url,
              "keywords",
              newExclusionString
            );
            chrome.tabs.update(details.tabId, { url: newUrl });
          }
        }
      }
    });
  }
});

function modifyUrlParameter(url, paramName, paramValue) {
  let newUrl = new URL(url);
  let currentParam = newUrl.searchParams.get(paramName);
  if (currentParam) {
    newUrl.searchParams.set(paramName, `${currentParam} ${paramValue}`);
  } else {
    newUrl.searchParams.set(paramName, paramValue);
  }
  return newUrl.href;
}

// Listen for a message from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "refresh") {
    console.log("Refresh action received");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let tabUrl = tabs[0].url;

      chrome.storage.local.get("excludedCompanies", (result) => {
        if (
          result.excludedCompanies &&
          tabUrl.includes("www.linkedin.com/jobs/search/")
        ) {
          let currentUrl = new URL(tabUrl);
          let currentKeywords = currentUrl.searchParams.get("keywords") || "";

          // Use regex to match all occurrences of "NOT [company name]"
          let existingExclusions =
            currentKeywords.match(/NOT '.*?'|NOT ".*?"/g) || [];

          let newExclusions = result.excludedCompanies.filter((company) => {
            return (
              !existingExclusions.includes(`NOT ${company}`) &&
              !existingExclusions.includes(`NOT "${company}"`) &&
              !existingExclusions.includes(`NOT '${company}'`)
            );
          });

          if (newExclusions.length > 0) {
            let newExclusionString = newExclusions.reduce(
              (query, company) => `${query} NOT "${company}"`,
              ""
            );
            let newUrl = modifyUrlParameter(
              tabUrl,
              "keywords",
              newExclusionString
            );
            chrome.tabs.update(tabs[0].tabId, { url: newUrl });
          }
        }
      });
    });

    sendResponse({ status: "Refresh initiated" });
  }
});
