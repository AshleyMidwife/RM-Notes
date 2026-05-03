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

// ===== TRIAGE & ADMISSION NOTE ASSEMBLY =====

// copyTriageNote() - reads all the triage form fields and assembles
// them into a clean formatted note, then copies to clipboard
function copyTriageNote() {
  // Helper function - reads a field by its id and returns its value
  // If the field is empty, returns the fallback text instead
  // This prevents blank lines appearing in the copied note
  function val(id, fallback = "___") {
    const el = document.getElementById(id);
    if (!el) return fallback;
    return el.value.trim() || fallback;
  }

  // Build the note as a template literal (backtick string)
  // Template literals let us write multi-line strings cleanly
  // ${val('id')} inserts the value of each field inline
  const note = `TRIAGE & ADMISSION NOTE
${"=".repeat(40)}

IDENTIFICATION
Patient: ${val("t-name")}
Age: ${val("t-age")}
Gravida/Para: ${val("t-gp")}
Gestational Age: ${val("t-ga")}
Chief Complaint: ${val("t-cc")}${val("t-cc-other") !== "___" ? " - " + val("t-cc-other") : ""}

PRENATAL LABS
ABO/Rh: ${val("t-abo")}
Antibody Screen: ${val("t-abs")}
GBS: ${val("t-gbs")}
GDM Screen: ${val("t-gdm")}
Rubella: ${val("t-rubella")}
Varicella: ${val("t-varicella")}
HBsAg: ${val("t-hbsag")}
HIV: ${val("t-hiv")}
HCV: ${val("t-hcv")}
Syphilis: ${val("t-syph")}
Hgb: ${val("t-hgb")}
Platelets: ${val("t-plt")}${val("t-labs-other") !== "___" ? "\nOther: " + val("t-labs-other") : ""}

HISTORY OF PRESENT ILLNESS
Contractions: ${val("t-ctx")}${val("t-ctx-details") !== "___" ? " - " + val("t-ctx-details") : ""}
Rupture of Membranes: ${val("t-rom")}${val("t-rom-details") !== "___" ? " - " + val("t-rom-details") : ""}
Vaginal Bleeding: ${val("t-bleeding")}
Fetal Movement: ${val("t-fm")}${val("t-hpi-other") !== "___" ? "\nOther: " + val("t-hpi-other") : ""}

CURRENT PREGNANCY
Complications: ${val("t-complications")}
Dating Ultrasound: ${val("t-dating-us")}
FTS/Anatomy/Growth US: ${val("t-other-us")}
Recent BPP: ${val("t-bpp")}

HISTORY
Past Obstetrical History: ${val("t-obhx")}
Medical History: ${val("t-pmhx")}
Surgical History: ${val("t-pshx")}
Medications: ${val("t-meds")}
Allergies: ${val("t-allergies")}

PHYSICAL EXAMINATION
Vitals: BP ${val("t-bp")} | HR ${val("t-hr")} | Temp ${val("t-temp")} | SpO2 ${val("t-spo2")}
Leopold's: ${val("t-leopolds")}
Contractions: ${val("t-ctx-exam")}
FHR: ${val("t-fhr")} baseline | Monitoring: ${monitoringType === "ia" ? "Intermittent Auscultation" : "cEFM"}
${
  monitoringType === "ia"
    ? `Rhythm: ${val("t-rhythm")} | Accelerations: ${val("t-ia-accels")} | Decelerations: ${val("t-ia-decels")}
FHR Classification: ${val("t-ia-class")}`
    : `Variability: ${val("t-variability")} | Accelerations: ${val("t-accels")} | Decelerations: ${val("t-decels")}
FHR Classification: ${val("t-fhr-class")}`
}
Cervical Exam: ${val("t-dilation")} dilated | ${val("t-effacement")} effaced | Station: ${val("t-station")} | Position: ${val("t-position")} | Consistency: ${val("t-consistency")}
Membranes: ${val("t-membranes")}${val("t-exam-other") !== "___" ? "\nOther: " + val("t-exam-other") : ""}

IMPRESSION & PLAN
${val("t-name")} is a ${val("t-age")} year old ${val("t-gp")} at ${val("t-ga")} presenting with ${val("t-cc")}.
Labour State: ${val("t-labour-state")}

Plan: ${val("t-plan")}

Informed Choice Discussion: ${val("t-informed-choice")}
${val("t-consulting") !== "___" ? val("t-consulting") : ""}

${"=".repeat(40)}
Registered Midwife`;

  // Copy the assembled note to clipboard
  navigator.clipboard
    .writeText(note)
    .then(() => {
      // Find the copy button and give visual feedback
      const copyBtn = document.querySelector("#screen-triage .copy-btn");
      copyBtn.textContent = "Copied! ✓";
      copyBtn.classList.add("copied");

      // Reset button after 2 seconds
      setTimeout(() => {
        copyBtn.textContent = "Copy Note to Clipboard";
        copyBtn.classList.remove("copied");
      }, 2000);
    })
    .catch(() => {
      alert("Copy failed - please try again");
    });
}

// ===== MONITORING TYPE TOGGLE =====

// Tracks which monitoring type is currently selected
// Starts as 'ia' because that's the default for low-risk admissions
let monitoringType = "ia";

// setMonitoringType() - switches between IA and cEFM fields
// Called by the segmented control buttons in the triage screen
function setMonitoringType(type) {
  // Update our tracking variable
  monitoringType = type;

  // Get references to both sets of fields
  const iaFields = document.getElementById("t-ia-fields");
  const cefmFields = document.getElementById("t-cefm-fields");

  // Get references to both toggle buttons
  const iaBtn = document.getElementById("t-monitor-ia");
  const cefmBtn = document.getElementById("t-monitor-cefm");

  if (type === "ia") {
    // Show IA fields, hide cEFM fields
    iaFields.style.display = "block";
    cefmFields.style.display = "none";

    // Update button active states
    iaBtn.classList.add("active");
    cefmBtn.classList.remove("active");
  } else {
    // Show cEFM fields, hide IA fields
    iaFields.style.display = "none";
    cefmFields.style.display = "block";

    // Update button active states
    cefmBtn.classList.add("active");
    iaBtn.classList.remove("active");
  }
}

// ===== CLEAR TRIAGE NOTE =====

// Two-tap clear pattern - first tap asks for confirmation,
// second tap within 3 seconds actually clears the form
// If user doesn't confirm within 3 seconds, button resets safely

let clearTriagePending = false; // Tracks whether we're waiting for confirmation

function clearTriageNote() {
  const btn = document.getElementById("triage-clear-btn");

  if (!clearTriagePending) {
    // First tap - ask for confirmation
    clearTriagePending = true;
    btn.textContent = "Confirm Clear?";
    btn.classList.add("confirming"); // Turns button red via CSS

    // If user doesn't confirm within 3 seconds, reset the button
    setTimeout(() => {
      if (clearTriagePending) {
        clearTriagePending = false;
        btn.textContent = "Clear All";
        btn.classList.remove("confirming");
      }
    }, 3000);
  } else {
    // Second tap - actually clear everything
    clearTriagePending = false;

    // Reset all text inputs to empty
    const inputs = document.querySelectorAll("#screen-triage .field-input");
    inputs.forEach((input) => (input.value = ""));

    // Reset all selects to first option (the -- Select -- placeholder)
    const selects = document.querySelectorAll("#screen-triage .field-select");
    selects.forEach((select) => (select.selectedIndex = 0));

    // Reset all textareas to empty
    const textareas = document.querySelectorAll("#screen-triage .field-textarea");
    textareas.forEach((textarea) => (textarea.value = ""));

    // Reset monitoring toggle back to IA default
    setMonitoringType("ia");

    // Reset button appearance
    btn.textContent = "Clear All";
    btn.classList.remove("confirming");
  }
}

// ===== INITIALISATION =====
// Runs once when the page first loads
// Makes sure we start on the home screen with back button hidden
document.addEventListener("DOMContentLoaded", () => {
  navigateTo("screen-home");
});
