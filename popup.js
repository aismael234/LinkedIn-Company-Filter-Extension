let companies = [];

// Emit event to background worker to force refresh, triggering extension
function refreshBackground() {
  chrome.runtime.sendMessage({ action: "refresh" }, function (response) {
    console.log("Refresh triggered", response);
  });
}

// Event listener for the Refresh button
document
  .getElementById("refreshButton")
  .addEventListener("click", refreshBackground);

function addCompany() {
  let companyName = document.getElementById("companyInput").value.trim();
  if (companyName && !companies.includes(companyName)) {
    companies.push(companyName); // Add the new company to the array
    updateCompanies(); // Update the list
  }
  // Clear the input box regardless of whether the company was added
  document.getElementById("companyInput").value = "";
}

// Event listener for the Add button
document.getElementById("addButton").addEventListener("click", addCompany);

// Event listener for the Enter key in the input box
document
  .getElementById("companyInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addCompany();
    }
  });

function removeCompany(index) {
  companies.splice(index, 1);
  updateCompanies();
}

// Function to update the list of companies in the UI and in Chrome storage
function updateCompanies() {
  let companyList = document.getElementById("companyList");
  companyList.innerHTML = ""; // Clear the existing list

  companies.forEach((name, index) => {
    let div = document.createElement("div");
    div.className = "company-item";

    let nameSpan = document.createElement("span");
    nameSpan.textContent = name;
    nameSpan.className = "company-name";

    let removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "remove-button";
    removeButton.onclick = function () {
      removeCompany(index);
    };

    div.appendChild(nameSpan);
    div.appendChild(removeButton);

    companyList.appendChild(div);
  });

  chrome.storage.local.set({ excludedCompanies: companies });
}

// Load companies from storage when popup opens
chrome.storage.local.get("excludedCompanies", (result) => {
  if (result.excludedCompanies) {
    companies = result.excludedCompanies;
    updateCompanies();
  }
});

// When the DOM is fully loaded, focus the input box
document.addEventListener("DOMContentLoaded", function () {
  let searchInput = document.getElementById("companyInput");
  if (searchInput) {
    searchInput.focus();
  }
});
