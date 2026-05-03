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

// ===== LABOUR PROGRESS NOTE =====

// Tracks monitoring type for progress note independently from triage note
let progressMonitoringType = "ia";

// setProgressMonitoringType() - same toggle pattern as triage note
// but uses progress note specific element ids (p- prefix)
function setProgressMonitoringType(type) {
  progressMonitoringType = type;

  const iaFields = document.getElementById("p-ia-fields");
  const cefmFields = document.getElementById("p-cefm-fields");
  const iaBtn = document.getElementById("p-monitor-ia");
  const cefmBtn = document.getElementById("p-monitor-cefm");

  if (type === "ia") {
    iaFields.style.display = "block";
    cefmFields.style.display = "none";
    iaBtn.classList.add("active");
    cefmBtn.classList.remove("active");
  } else {
    iaFields.style.display = "none";
    cefmFields.style.display = "block";
    cefmBtn.classList.add("active");
    iaBtn.classList.remove("active");
  }
}

// copyProgressNote() - assembles progress note fields into
// a clean SOAP formatted note and copies to clipboard
function copyProgressNote() {
  // Same helper function as triage note - reads field by id,
  // returns fallback if empty
  function val(id, fallback = "___") {
    const el = document.getElementById(id);
    if (!el) return fallback;
    return el.value.trim() || fallback;
  }

  // Build the fetal assessment section based on monitoring type
  // This is pulled out into its own variable to keep the note
  // template readable
  const fetalAssessment =
    progressMonitoringType === "ia"
      ? `FHR: ${val("p-fhr")} baseline | Monitoring: Intermittent Auscultation
Rhythm: ${val("p-rhythm")} | Accelerations: ${val("p-ia-accels")} | Decelerations: ${val("p-ia-decels")}
FHR Classification: ${val("p-ia-class")}`
      : `FHR: ${val("p-fhr")} baseline | Monitoring: cEFM
Variability: ${val("p-variability")} | Accelerations: ${val("p-accels")} | Decelerations: ${val("p-decels")}
FHR Classification: ${val("p-fhr-class")}`;

  const note = `LABOUR PROGRESS NOTE
${"=".repeat(40)}

${val("p-gp")} at ${val("p-ga")} — ${val("p-labour-state")}

SUBJECTIVE
Pain/Coping: ${val("p-coping")}
Contractions: ${val("p-ctx-reported")}
Fetal Movement: ${val("p-fm")}${val("p-subjective-other") !== "___" ? "\nOther: " + val("p-subjective-other") : ""}

OBJECTIVE
Vitals: BP ${val("p-bp")} | HR ${val("p-hr")} | Temp ${val("p-temp")}
Contractions: ${val("p-ctx-exam")}
${fetalAssessment}
Cervical Exam: ${val("p-dilation")} dilated | Station: ${val("p-station")}${val("p-cx-details") !== "___" ? " | " + val("p-cx-details") : ""}
Membranes: ${val("p-membranes")}
Fetal Position: ${val("p-position")}

ASSESSMENT
Progress: ${val("p-progress")}
Fetal Status: ${val("p-fetal-status")}
Impression: ${val("p-impression")}

PLAN
Analgesia: ${val("p-analgesia")}${val("p-interventions") !== "___" ? "\nInterventions: " + val("p-interventions") : ""}
${val("p-reassess")}
${val("p-informed-choice") !== "___" ? "\nInformed Choice: " + val("p-informed-choice") : ""}
${val("p-other-notes") !== "___" ? "\nOTHER NOTES\n" + val("p-other-notes") : ""}

${"=".repeat(40)}
Registered Midwife`;

  navigator.clipboard
    .writeText(note)
    .then(() => {
      const copyBtn = document.querySelector("#screen-progress .copy-btn");
      copyBtn.textContent = "Copied! ✓";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy Note to Clipboard";
        copyBtn.classList.remove("copied");
      }, 2000);
    })
    .catch(() => {
      alert("Copy failed - please try again");
    });
}

// clearProgressNote() - two-tap clear pattern
// identical to triage clear but targets progress note fields
let clearProgressPending = false;

function clearProgressNote() {
  const btn = document.getElementById("progress-clear-btn");

  if (!clearProgressPending) {
    // First tap - ask for confirmation
    clearProgressPending = true;
    btn.textContent = "Confirm Clear?";
    btn.classList.add("confirming");

    setTimeout(() => {
      if (clearProgressPending) {
        clearProgressPending = false;
        btn.textContent = "Clear All";
        btn.classList.remove("confirming");
      }
    }, 3000);
  } else {
    // Second tap - clear all fields
    clearProgressPending = false;

    const inputs = document.querySelectorAll("#screen-progress .field-input");
    inputs.forEach((input) => (input.value = ""));

    const selects = document.querySelectorAll("#screen-progress .field-select");
    selects.forEach((select) => (select.selectedIndex = 0));

    const textareas = document.querySelectorAll("#screen-progress .field-textarea");
    textareas.forEach((textarea) => (textarea.value = ""));

    // Reset monitoring toggle back to IA default
    setProgressMonitoringType("ia");

    btn.textContent = "Clear All";
    btn.classList.remove("confirming");
  }
}

// ===== DELIVERY NOTE =====

// Tracks whether shoulder dystocia and PPH sections are active
let shoulderDystocia = false;
let pphOccurred = false;

// setShoulderDystocia() - shows/hides shoulder dystocia fields
function setShoulderDystocia(active) {
  shoulderDystocia = active;

  const fields = document.getElementById("d-sd-fields");
  const noBtn = document.getElementById("d-sd-no");
  const yesBtn = document.getElementById("d-sd-yes");

  if (active) {
    fields.style.display = "block";
    yesBtn.classList.add("active");
    noBtn.classList.remove("active");
  } else {
    fields.style.display = "none";
    noBtn.classList.add("active");
    yesBtn.classList.remove("active");
  }
}

// setPPH() - shows/hides PPH fields
function setPPH(active) {
  pphOccurred = active;

  const fields = document.getElementById("d-pph-fields");
  const noBtn = document.getElementById("d-pph-no");
  const yesBtn = document.getElementById("d-pph-yes");

  if (active) {
    fields.style.display = "block";
    yesBtn.classList.add("active");
    noBtn.classList.remove("active");
  } else {
    fields.style.display = "none";
    noBtn.classList.add("active");
    yesBtn.classList.remove("active");
  }
}

// copyDeliveryNote() - assembles all delivery note fields into
// a clean formatted note and copies to clipboard
function copyDeliveryNote() {
  // Same helper as other notes - reads field value or returns fallback
  function val(id, fallback = "___") {
    const el = document.getElementById(id);
    if (!el) return fallback;
    return el.value.trim() || fallback;
  }

  // Helper for checkboxes - returns label text if checked
  // Used to build the maneuvers and uterotonics lists
  function checked(id) {
    const el = document.getElementById(id);
    return el && el.checked;
  }

  // Build shoulder dystocia maneuvers list from checkboxes
  // Only includes maneuvers that were checked
  const sdManeuvers =
    [
      checked("d-sd-mcroberts") && "McRoberts",
      checked("d-sd-spp") && "Suprapubic Pressure",
      checked("d-sd-posterior-arm") && "Delivery of Posterior Arm",
      checked("d-sd-rubin") && "Rubin II",
      checked("d-sd-woods") && "Woods Screw",
      checked("d-sd-gaskin") && "Gaskin (All Fours)",
      checked("d-sd-zavanelli") && "Zavanelli",
      checked("d-sd-other-maneuver") && "Other"
    ]
      .filter(Boolean) // Remove unchecked (false) values
      .join(", ") || "None documented";

  // Build PPH uterotonics list from checkboxes
  const pphUterotonics =
    [
      checked("d-pph-oxytocin") && "Oxytocin IV",
      checked("d-pph-carbetocin") && "Carbetocin",
      checked("d-pph-misoprostol") && "Misoprostol",
      checked("d-pph-ergometrine") && "Ergometrine",
      checked("d-pph-txa") && "Tranexamic Acid",
      checked("d-pph-other-drug") && "Other"
    ]
      .filter(Boolean)
      .join(", ") || "None documented";

  // Build shoulder dystocia section - only included if toggle is on
  const sdSection = shoulderDystocia
    ? `
SHOULDER DYSTOCIA
Time of Head Delivery: ${val("d-sd-head-time")}
Time of Body Delivery: ${val("d-sd-body-time")}
Maneuvers Attempted: ${sdManeuvers}
Sequence & Details: ${val("d-sd-narrative")}
Personnel Present: ${val("d-sd-personnel")}
Neonatal Outcome: ${val("d-sd-neonatal-outcome")}`
    : `
SHOULDER DYSTOCIA
Not encountered`;

  // Build PPH section - only included if toggle is on
  const pphSection = pphOccurred
    ? `
POSTPARTUM HEMORRHAGE (>500ml)
Total EBL: ${val("d-pph-ebl")}
Suspected Cause: ${val("d-pph-cause")}
Uterotonics Given: ${pphUterotonics}
Additional Interventions: ${val("d-pph-interventions")}
OB Consulted: ${val("d-pph-ob")}
Response to Treatment: ${val("d-pph-response")}`
    : `
POSTPARTUM HEMORRHAGE
Not applicable`;

  const note = `DELIVERY NOTE
${"=".repeat(40)}

ANTEPARTUM CONTEXT
Patient: ${val("d-name")}
Gravida/Para: ${val("d-gp")}
Gestational Age: ${val("d-ga")}
GBS Status: ${val("d-gbs")}
Relevant History: ${val("d-hx")}

LABOUR SUMMARY
Duration: ${val("d-labour-duration")}
Membranes: ${val("d-membranes")}${val("d-rom-details") !== "___" ? " - " + val("d-rom-details") : ""}
Augmentation: ${val("d-augmentation")}${val("d-augmentation-details") !== "___" ? " - " + val("d-augmentation-details") : ""}
Analgesia: ${val("d-analgesia")}
GBS Antibiotics: ${val("d-antibiotics")}

SECOND STAGE
Duration: ${val("d-second-stage")}
Pushing Position: ${val("d-pushing-position")}
Perineal Support: ${val("d-perineal-support")}
Fetal Position at Delivery: ${val("d-fetal-position")}

BIRTH
Time of Birth: ${val("d-tob")}
Sex: ${val("d-sex")}
Presentation: ${val("d-presentation")}
Nuchal Cord: ${val("d-nuchal")}
Delayed Cord Clamping: ${val("d-dcc")}${val("d-dcc-details") !== "___" ? " - " + val("d-dcc-details") : ""}
${sdSection}

IMMEDIATE NEWBORN
Apgar Scores: ${val("d-apgar1")} at 1 min | ${val("d-apgar5")} at 5 min | ${val("d-apgar10")} at 10 min
Resuscitation: ${val("d-resus")}${val("d-resus-details") !== "___" ? " - " + val("d-resus-details") : ""}
Skin to Skin: ${val("d-sts")}

THIRD STAGE
Management: ${val("d-third-stage")}
Oxytocin/Uterotonics: ${val("d-oxytocin")}
Time of Placenta Delivery: ${val("d-placenta-time")}
Placenta Completeness: ${val("d-placenta-complete")}
Membranes: ${val("d-placenta-membranes")}
Cord Vessels: ${val("d-cord-vessels")}
Cord Insertion: ${val("d-cord-insertion")}
Estimated Blood Loss: ${val("d-ebl")}
Uterine Tone: ${val("d-tone")}
${pphSection}

PERINEUM
Status: ${val("d-perineum")}
Repair: ${val("d-repair")}${val("d-repair-details") !== "___" ? " - " + val("d-repair-details") : ""}

IMMEDIATE POSTPARTUM
Vitals: ${val("d-pp-vitals")}
Pain: ${val("d-pp-pain")}
Bleeding: ${val("d-pp-bleeding")}
Feeding: ${val("d-feeding")}

PLAN & INFORMED CHOICE
Disposition: ${val("d-disposition")}${val("d-consulting") !== "___" ? "\nConsulting Provider: " + val("d-consulting") : ""}
Informed Choice: ${val("d-informed-choice")}
${val("d-other-notes") !== "___" ? "\nOTHER NOTES\n" + val("d-other-notes") : ""}

${"=".repeat(40)}
Registered Midwife`;

  navigator.clipboard
    .writeText(note)
    .then(() => {
      const copyBtn = document.querySelector("#screen-delivery .copy-btn");
      copyBtn.textContent = "Copied! ✓";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy Note to Clipboard";
        copyBtn.classList.remove("copied");
      }, 2000);
    })
    .catch(() => {
      alert("Copy failed - please try again");
    });
}

// clearDeliveryNote() - two-tap clear pattern
let clearDeliveryPending = false;

function clearDeliveryNote() {
  const btn = document.getElementById("delivery-clear-btn");

  if (!clearDeliveryPending) {
    clearDeliveryPending = true;
    btn.textContent = "Confirm Clear?";
    btn.classList.add("confirming");

    setTimeout(() => {
      if (clearDeliveryPending) {
        clearDeliveryPending = false;
        btn.textContent = "Clear All";
        btn.classList.remove("confirming");
      }
    }, 3000);
  } else {
    clearDeliveryPending = false;

    // Clear all inputs, selects, textareas
    const inputs = document.querySelectorAll("#screen-delivery .field-input");
    inputs.forEach((input) => (input.value = ""));

    const selects = document.querySelectorAll("#screen-delivery .field-select");
    selects.forEach((select) => (select.selectedIndex = 0));

    const textareas = document.querySelectorAll("#screen-delivery .field-textarea");
    textareas.forEach((textarea) => (textarea.value = ""));

    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll("#screen-delivery input[type='checkbox']");
    checkboxes.forEach((cb) => (cb.checked = false));

    // Reset toggles to default states
    setShoulderDystocia(false);
    setPPH(false);

    btn.textContent = "Clear All";
    btn.classList.remove("confirming");
  }
}

// ===== MATERNAL DISCHARGE SUMMARY =====

// copyMaternalDischarge() - assembles all maternal discharge fields
// into a clean formatted note and copies to clipboard
function copyMaternalDischarge() {
  // Same helper as other notes
  function val(id, fallback = "___") {
    const el = document.getElementById(id);
    if (!el) return fallback;
    return el.value.trim() || fallback;
  }

  // Helper for checkboxes
  function checked(id) {
    const el = document.getElementById(id);
    return el && el.checked;
  }

  // Build discharge teaching list from checkboxes
  // Only includes topics that were checked
  const teachingTopics =
    [
      checked("md-teach-fever") && "Fever/signs of infection",
      checked("md-teach-bleeding") && "Excessive bleeding/clots",
      checked("md-teach-headache") && "Headache/visual changes/epigastric pain",
      checked("md-teach-dvt") && "DVT signs",
      checked("md-teach-perineum") && "Perineal care and wound healing",
      checked("md-teach-feeding") && "Feeding support and resources",
      checked("md-teach-mood") && "Mood changes/baby blues/PPD",
      checked("md-teach-activity") && "Activity restrictions and return to exercise",
      checked("md-teach-contraception") && "Contraception counselling",
      checked("md-teach-emergency") && "When to seek emergency care",
      val("md-teach-other") !== "___" && val("md-teach-other")
    ]
      .filter(Boolean)
      .join("\n- ") || "Not documented";

  const note = `MATERNAL DISCHARGE SUMMARY
${"=".repeat(40)}

IDENTIFICATION
Patient: ${val("md-name")}
Gravida/Para: ${val("md-gp")}
Gestational Age at Delivery: ${val("md-ga")}
Date of Delivery: ${val("md-dod")}
Day Postpartum: ${val("md-day-pp")}

DELIVERY SUMMARY
Mode of Delivery: ${val("md-mode")}
Complications: ${val("md-complications")}
GBS Status: ${val("md-gbs")}
ABO/Rh: ${val("md-abo")}

VITALS AT DISCHARGE
BP: ${val("md-bp")} | HR: ${val("md-hr")} | Temp: ${val("md-temp")}

POSTPARTUM ASSESSMENT (BUBBLE-HEADS)
B - Breasts: ${val("md-breasts")}${val("md-breasts-details") !== "___" ? " - " + val("md-breasts-details") : ""}
  Feeding: ${val("md-feeding")}
U - Uterus: ${val("md-uterus")}
B - Bowels: ${val("md-bowels")}
B - Bladder: ${val("md-bladder")}
L - Lochia: ${val("md-lochia")}
E - Epis/Laceration: ${val("md-perineum")}${val("md-perineum-details") !== "___" ? " - " + val("md-perineum-details") : ""}
H - Homans/DVT: ${val("md-homans")}${val("md-homans-details") !== "___" ? " - " + val("md-homans-details") : ""}
E - Emotions: ${val("md-emotions")}${val("md-emotions-details") !== "___" ? " - " + val("md-emotions-details") : ""}
A - Affect: ${val("md-affect")}
D - Diet: ${val("md-diet")}
S - Support: ${val("md-support")}

DISCHARGE TEACHING
Topics covered:
- ${teachingTopics}

PLAN & FOLLOW UP
Disposition: ${val("md-disposition")}
Follow Up: ${val("md-followup")}${val("md-consulting") !== "___" ? "\nConsulting Provider: " + val("md-consulting") : ""}
Informed Choice: ${val("md-informed-choice")}
${val("md-other-notes") !== "___" ? "\nOTHER NOTES\n" + val("md-other-notes") : ""}

${"=".repeat(40)}
Registered Midwife`;

  navigator.clipboard
    .writeText(note)
    .then(() => {
      const copyBtn = document.querySelector("#screen-maternal-discharge .copy-btn");
      copyBtn.textContent = "Copied! ✓";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy Note to Clipboard";
        copyBtn.classList.remove("copied");
      }, 2000);
    })
    .catch(() => {
      alert("Copy failed - please try again");
    });
}

// clearMaternalDischarge() - two-tap clear pattern
let clearMaternalDischargePending = false;

function clearMaternalDischarge() {
  const btn = document.getElementById("maternal-discharge-clear-btn");

  if (!clearMaternalDischargePending) {
    clearMaternalDischargePending = true;
    btn.textContent = "Confirm Clear?";
    btn.classList.add("confirming");

    setTimeout(() => {
      if (clearMaternalDischargePending) {
        clearMaternalDischargePending = false;
        btn.textContent = "Clear All";
        btn.classList.remove("confirming");
      }
    }, 3000);
  } else {
    clearMaternalDischargePending = false;

    const inputs = document.querySelectorAll("#screen-maternal-discharge .field-input");
    inputs.forEach((input) => (input.value = ""));

    const selects = document.querySelectorAll("#screen-maternal-discharge .field-select");
    selects.forEach((select) => (select.selectedIndex = 0));

    const textareas = document.querySelectorAll("#screen-maternal-discharge .field-textarea");
    textareas.forEach((textarea) => (textarea.value = ""));

    const checkboxes = document.querySelectorAll("#screen-maternal-discharge input[type='checkbox']");
    checkboxes.forEach((cb) => (cb.checked = false));

    btn.textContent = "Clear All";
    btn.classList.remove("confirming");
  }
}

// ===== NEWBORN ADMISSION H&P =====

// copyNewbornAdmission() - assembles all newborn admission fields
// into a clean formatted note and copies to clipboard
function copyNewbornAdmission() {
  function val(id, fallback = "___") {
    const el = document.getElementById(id);
    if (!el) return fallback;
    return el.value.trim() || fallback;
  }

  function checked(id) {
    const el = document.getElementById(id);
    return el && el.checked;
  }

  // Build newborn care completed list from checkboxes
  const newbornCare =
    [
      checked("na-vitk") && "Vitamin K 1mg IM administered",
      checked("na-nms") && "Newborn Metabolic Screen (NMS)",
      checked("na-hearing") && "Newborn Hearing Screen (EHDI)",
      checked("na-jaundice") && "Jaundice Screening (TCB/TSB)",
      checked("na-cchd") && "CCHD Screen"
    ]
      .filter(Boolean)
      .join("\n- ") || "Not documented";

  const note = `NEWBORN ADMISSION H&P
${"=".repeat(40)}

IDENTIFICATION
Baby of: ${val("na-parent")}
Date of Birth: ${val("na-dob")}
Time of Birth: ${val("na-tob")}
Gestational Age: ${val("na-ga")}
Sex: ${val("na-sex")}
Birth Weight: ${val("na-weight")}
Apgar Scores: ${val("na-apgars")}

MATERNAL HISTORY
Maternal Age/GP: ${val("na-maternal-gp")}
GBS Status: ${val("na-gbs")}
GBS Antibiotics: ${val("na-antibiotics")}
ABO/Rh: ${val("na-abo")}
Prenatal Care: ${val("na-pnc")}
Pregnancy Complications: ${val("na-preg-complications")}
Perinatal Complications: ${val("na-perinatal-complications")}
Mode of Delivery: ${val("na-mode")}
Membranes: ${val("na-membranes")}
ROM to Delivery: ${val("na-rom-duration")}
Maternal Medications: ${val("na-meds")}

IMMEDIATE NEWBORN CARE
Delayed Cord Clamping: ${val("na-dcc")}
Skin to Skin: ${val("na-sts")}
Resuscitation: ${val("na-resus")}${val("na-resus-details") !== "___" ? " - " + val("na-resus-details") : ""}
Newborn Care Completed:
- ${newbornCare}${val("na-screening-details") !== "___" ? "\nScreening Details: " + val("na-screening-details") : ""}

PHYSICAL EXAMINATION
Vitals: ${val("na-vitals")}

${val("na-exam")}

FEEDING
Type: ${val("na-feeding-type")}
Course: ${val("na-feeding-details")}
Void: ${val("na-void")}
Meconium: ${val("na-mec")}
${val("na-other-notes") !== "___" ? "\nOTHER NOTES\n" + val("na-other-notes") : ""}

${"=".repeat(40)}
Registered Midwife`;

  navigator.clipboard
    .writeText(note)
    .then(() => {
      const copyBtn = document.querySelector("#screen-newborn-admission .copy-btn");
      copyBtn.textContent = "Copied! ✓";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy Note to Clipboard";
        copyBtn.classList.remove("copied");
      }, 2000);
    })
    .catch(() => {
      alert("Copy failed - please try again");
    });
}

// clearNewbornAdmission() - two-tap clear pattern
// Note: clears form fields but resets physical exam to normal findings
let clearNewbornAdmissionPending = false;

// Store the default exam text so we can restore it on clear
const defaultNewbornExam = `General: Well-appearing newborn, vigorous cry, no distress.
HEENT: Normocephalic. No caput or cephalohematoma.
  Anterior fontanelle soft and flat. Sutures mobile.
  Eyes: No subconjunctival hemorrhage.
  Ears: Normal set and shape.
  Oropharynx: Palate intact. No cleft. Tongue normal.
Neck: Supple, no masses, normal range of motion. Clavicles palpate intact.
Chest: Equal rise bilaterally. No retractions.
CVS: Normal S1 S2. No murmur. Femoral and brachial pulses palpable bilaterally.
Resp: Clear to auscultation bilaterally. No adventitious sounds.
Abdomen: Soft, non-distended, with normal bowel sounds. No organomegaly. Cord intact.
GU: Normal [male/female] genitalia. [Testes descended bilaterally.]
MSK: Full range of motion all limbs. No fractures appreciated or suspected.
  Hips: Negative Barlow and Ortolani bilaterally.
  Spine: Straight. No sacral dimple.
Neuro: Normal tone. Moro, grasp, and suck reflexes present.
Skin: Pink, well-perfused. No rashes or birthmarks.`;

function clearNewbornAdmission() {
  const btn = document.getElementById("newborn-admission-clear-btn");

  if (!clearNewbornAdmissionPending) {
    clearNewbornAdmissionPending = true;
    btn.textContent = "Confirm Clear?";
    btn.classList.add("confirming");

    setTimeout(() => {
      if (clearNewbornAdmissionPending) {
        clearNewbornAdmissionPending = false;
        btn.textContent = "Clear All";
        btn.classList.remove("confirming");
      }
    }, 3000);
  } else {
    clearNewbornAdmissionPending = false;

    const inputs = document.querySelectorAll("#screen-newborn-admission .field-input");
    inputs.forEach((input) => (input.value = ""));

    const selects = document.querySelectorAll("#screen-newborn-admission .field-select");
    selects.forEach((select) => (select.selectedIndex = 0));

    // Clear freetext areas but restore exam to default normal findings
    // rather than leaving it blank - this is the key difference from
    // other clear functions
    const textareas = document.querySelectorAll("#screen-newborn-admission .field-textarea");
    textareas.forEach((textarea) => (textarea.value = ""));

    // Restore the pre-populated exam text specifically
    document.getElementById("na-exam").value = defaultNewbornExam;

    const checkboxes = document.querySelectorAll("#screen-newborn-admission input[type='checkbox']");
    checkboxes.forEach((cb) => (cb.checked = false));

    btn.textContent = "Clear All";
    btn.classList.remove("confirming");
  }
}
