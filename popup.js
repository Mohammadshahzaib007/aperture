document.addEventListener("DOMContentLoaded", () => {
  const toggleComments = document.getElementById("toggleComments");
  const toggleRecommendations = document.getElementById(
    "toggleRecommendations"
  );
  const toggleHomepage = document.getElementById("toggleHomepage");
  const toggleShortsMenu = document.getElementById("toggleShortsMenu");
  const toggleEnable = document.getElementById("toggleEnable");
  const selectAll = document.getElementById("selectAll");
  const mainContent = document.querySelector(".main-container");

  const enabledLabel = document.getElementById("enabledLabel");

  function disableMainContent(isEnabled = toggleEnable.checked) {
    const overlay = mainContent.querySelector(".overlay");
    if (isEnabled) {
      mainContent.style.opacity = "1";
      overlay.style.display = "none";
      return;
    }
    mainContent.style.opacity = "0.4";
    overlay.style.display = "block";
  }

  // Load saved states
  chrome.storage.sync.get(
    [
      "hideComments",
      "hideRecommendations",
      "hideHomepage",
      "hideShortsMenu",
      "isExtensionEnabled",
    ],
    (data) => {
      toggleComments.checked = data.hideComments || false;
      toggleRecommendations.checked = data.hideRecommendations || false;
      toggleHomepage.checked = data.hideHomepage || false;
      toggleShortsMenu.checked = data.hideShortsMenu || false;
      toggleEnable.checked = data.isExtensionEnabled || false;
      disableMainContent(data.isExtensionEnabled || false);
      updateSelectAll();
    }
  );

  // Save state when a toggle is switched
  function saveState() {
    chrome.storage.sync.set(
      {
        hideComments: toggleComments.checked,
        hideRecommendations: toggleRecommendations.checked,
        hideHomepage: toggleHomepage.checked,
        hideShortsMenu: toggleShortsMenu.checked,
        isExtensionEnabled: toggleEnable.checked,
      },
      () => {
        // Send a message to the content script to update the page
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "updatePage",
            hideComments: toggleComments.checked,
            hideRecommendations: toggleRecommendations.checked,
            hideHomepage: toggleHomepage.checked,
            hideShortsMenu: toggleShortsMenu.checked,
            isExtensionEnabled: toggleEnable.checked,
          });
        });
      }
    );
  }

  // Update the "Select All" checkbox
  function updateSelectAll() {
    selectAll.checked =
      toggleComments.checked &&
      toggleRecommendations.checked &&
      toggleHomepage.checked &&
      toggleShortsMenu.checked;
  }

  // Add event listeners for individual toggles
  toggleComments.addEventListener("change", () => {
    saveState();
    updateSelectAll();
  });
  toggleRecommendations.addEventListener("change", () => {
    saveState();
    updateSelectAll();
  });
  toggleHomepage.addEventListener("change", () => {
    saveState();
    updateSelectAll();
  });
  toggleShortsMenu.addEventListener("change", () => {
    saveState();
    updateSelectAll();
  });

  toggleEnable.addEventListener("change", (e) => {
    saveState();
    disableMainContent();
    if (toggleEnable.checked) {
      enabledLabel.innerText = "Enabled";
      enabledLabel.style.color = "var(--secondary-color)";
    } else {
      enabledLabel.innerText = "Enable";
      enabledLabel.style.color = "var(--text-secondary-colore)";
    }
  });

  // Add event listener for "Select All"
  selectAll.addEventListener("change", () => {
    toggleComments.checked = selectAll.checked;
    toggleRecommendations.checked = selectAll.checked;
    toggleHomepage.checked = selectAll.checked;
    toggleShortsMenu.checked = selectAll.checked;
    saveState();
  });
});
