// Function to hide/show elements based on selectors
function toggleElements(selectors, shouldHide) {
  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      if (element) {
        const currentDisplay = window.getComputedStyle(element).display;
        const targetDisplay = shouldHide ? "none" : "";
        if (currentDisplay !== targetDisplay) {
          element.style.display = targetDisplay;
        }
      }
    });
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

// Function to apply the saved state
function applySavedState() {
  chrome.storage.sync.get(
    ["hideComments", "hideRecommendations", "hideHomepage", "hideShortsMenu"],
    (data) => {
      // Hide/show comments
      toggleElements(["#comments"], data.hideComments);

      // Hide/show recommendations
      toggleElements(["#related"], data.hideRecommendations);

      // Hide/show homepage
      toggleElements(
        ['#page-manager > ytd-browse[page-subtype="home"]'],
        data.hideHomepage
      );

      // Hide/show Shorts menu item
      toggleElements(['a[title="Shorts"]'], data.hideShortsMenu);
    }
  );
}

// Debounce function to limit how often applySavedState is called
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Debounced version of applySavedState
const debouncedApplySavedState = debounce(applySavedState, 300);

// Use MutationObserver to monitor the DOM
const observer = new MutationObserver((mutations, obs) => {
  // Check if relevant elements are added or modified
  const hasRelevantChanges = mutations.some((mutation) => {
    return (
      mutation.type === "childList" &&
      (mutation.target.querySelector("#comments") ||
        mutation.target.querySelector("#related") ||
        mutation.target.querySelector(
          '#page-manager > ytd-browse[page-subtype="home"]'
        ) ||
        mutation.target.querySelector('a[title="Shorts"]'))
    );
  });

  if (hasRelevantChanges) {
    debouncedApplySavedState();
  }
});

// Start observing the document for changes
observer.observe(document, {
  childList: true,
  subtree: true,
});

// Apply the saved state immediately (in case the DOM is already ready)
applySavedState();
