// Function to hide/show elements based on selectors
function toggleElements(selectors, shouldHide) {
  selectors.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = shouldHide ? "none" : "";
    }
  });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updatePage") {
    // Hide/show comments
    toggleElements(["#comments"], message.hideComments);

    // Hide/show recommendations
    toggleElements(["#related"], message.hideRecommendations);

    // Hide/show homepage
    toggleElements(
      ['#page-manager > ytd-browse[page-subtype="home"]'],
      message.hideHomepage
    );

    // Hide/show shorts menu item
    toggleElements(['a[title="Shorts"]'], message.hideShortsMenu);
  }
});

// Apply the initial state when the page loads
chrome.storage.sync.get(
  ["hideComments", "hideRecommendations", "hideHomepage", "hideShortsMenu"],
  (data) => {
    toggleElements(["#comments"], data.hideComments);
    toggleElements(["#related"], data.hideRecommendations);
    toggleElements(
      ['#page-manager > ytd-browse[page-subtype="home"]'],
      data.hideHomepage
    );
    toggleElements(['a[title="Shorts"]'], data.hideShortsMenu);
  }
);
