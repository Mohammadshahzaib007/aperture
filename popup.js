document.addEventListener("DOMContentLoaded", () => {
  const toggleComments = document.getElementById("toggleComments");
  const toggleRecommendations = document.getElementById(
    "toggleRecommendations"
  );
  const toggleHomepage = document.getElementById("toggleHomepage");
  const selectAll = document.getElementById("selectAll");

  // Load saved states
  chrome.storage.sync.get(
    ["hideComments", "hideRecommendations", "hideHomepage"],
    (data) => {
      toggleComments.checked = data.hideComments || false;
      toggleRecommendations.checked = data.hideRecommendations || false;
      toggleHomepage.checked = data.hideHomepage || false;
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
      },
      () => {
        // Send a message to the content script to update the page
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "updatePage",
            hideComments: toggleComments.checked,
            hideRecommendations: toggleRecommendations.checked,
            hideHomepage: toggleHomepage.checked,
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
      toggleHomepage.checked;
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

  // Add event listener for "Select All"
  selectAll.addEventListener("change", () => {
    toggleComments.checked = selectAll.checked;
    toggleRecommendations.checked = selectAll.checked;
    toggleHomepage.checked = selectAll.checked;
    saveState();
  });
});
