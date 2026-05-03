// ===== RM NOTES - APP LOGIC =====
// This file handles two things:
// 1. Navigation between screens (navigateTo / goBack)
// 2. Copying template text to clipboard (copyTemplate)

// ===== NAVIGATION =====

// Keeps track of which screen we're currently on
// Starts as 'screen-home' because that's what loads first
let currentScreen = "screen-home";

// navigateTo() - shows the requested screen, hides everything else
// Called by onclick on every button in index.html
function navigateTo(screenId) {
  // Hide the current screen by removing 'active' class
  document.getElementById(currentScreen).classList.remove("active");

  // Show the new screen by adding 'active' class
  document.getElementById(screenId).classList.add("active");

  // Remember which screen we're now on
  currentScreen = screenId;

  // Show the back button when we're not on the home screen
  // Hide it when we are on the home screen
  const backBtn = document.getElementById("backBtn");
  if (screenId === "screen-home") {
    backBtn.style.display = "none";
  } else {
    backBtn.style.display = "block";
  }

  // Scroll to top of page when navigating to a new screen
  window.scrollTo(0, 0);
}

// goBack() - always goes back to home screen
// Called by the back button in the header
function goBack() {
  navigateTo("screen-home");
}

// ===== COPY TO CLIPBOARD =====

// copyTemplate() - copies the template textarea content to clipboard
// textareaId is the id of the textarea we want to copy from
// e.g. copyTemplate('text-triage') copies the triage note
function copyTemplate(textareaId) {
  // Find the textarea element by its id
  const textarea = document.getElementById(textareaId);

  // Get the text content from the textarea
  const text = textarea.value;

  // navigator.clipboard is the modern browser API for clipboard access
  // .writeText() writes our text to the clipboard
  // .then() runs after the copy succeeds
  // .catch() runs if something goes wrong
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Find the copy button that was clicked
      // It's the button in the same screen as our textarea
      const copyBtn = textarea.nextElementSibling;

      // Temporarily change button text and colour to confirm copy worked
      copyBtn.textContent = "Copied! ✓";
      copyBtn.classList.add("copied"); // Turns button green via CSS

      // After 2 seconds, reset button back to original state
      setTimeout(() => {
        copyBtn.textContent = "Copy to Clipboard";
        copyBtn.classList.remove("copied");
      }, 2000);
    })
    .catch(() => {
      // If clipboard access fails, alert the user
      // This can happen on some older browsers or http connections
      alert("Copy failed - please select the text manually and copy");
    });
}

// ===== INITIALISATION =====
// Runs once when the page first loads
// Makes sure we start on the home screen with back button hidden
document.addEventListener("DOMContentLoaded", () => {
  navigateTo("screen-home");
});
