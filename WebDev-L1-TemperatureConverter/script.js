(function () {
  var form = document.getElementById("convert-form");
  var input = document.getElementById("temp-input");
  var errorEl = document.getElementById("input-error");
  var results = document.getElementById("results");
  var outC = document.getElementById("out-c");
  var outF = document.getElementById("out-f");
  var outK = document.getElementById("out-k");
  var note = document.getElementById("result-note");

  var ABS_ZERO_C = -273.15;
  var ABS_ZERO_F = -459.67;
  var ABS_ZERO_K = 0;

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    results.hidden = true;
  }

  function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  function toCelsius(value, unit) {
    if (unit === "C") return value;
    if (unit === "F") return ((value - 32) * 5) / 9;
    return value - 273.15; // K → C
  }

  function format(n) {
    if (!Number.isFinite(n)) return "—";
    var rounded = Math.round(n * 100) / 100;
    return String(rounded);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearError();

    var raw = (input.value || "").trim();
    if (raw === "") {
      showError("Please enter a temperature value.");
      input.focus();
      return;
    }

    // Reject non-numeric (allow leading -, decimal)
    if (!/^-?\d*\.?\d+$/.test(raw)) {
      showError("Invalid input — use numbers only (e.g. 36.6 or -40).");
      input.focus();
      return;
    }

    var value = parseFloat(raw);
    if (Number.isNaN(value)) {
      showError("Could not read that number. Try again.");
      return;
    }

    var from = (form.querySelector('input[name="from"]:checked') || {}).value || "C";

    // Absolute zero checks per source unit
    if (from === "C" && value < ABS_ZERO_C) {
      showError("Below absolute zero: nothing can be colder than −273.15 °C.");
      return;
    }
    if (from === "F" && value < ABS_ZERO_F) {
      showError("Below absolute zero: nothing can be colder than −459.67 °F.");
      return;
    }
    if (from === "K" && value < ABS_ZERO_K) {
      showError("Kelvin cannot be negative — absolute zero is 0 K.");
      return;
    }

    var c = toCelsius(value, from);
    var f = (c * 9) / 5 + 32;
    var k = c + 273.15;

    outC.textContent = format(c) + " °C";
    outF.textContent = format(f) + " °F";
    outK.textContent = format(k) + " K";
    results.hidden = false;

    var atAbsZero =
      Math.abs(c - ABS_ZERO_C) < 0.001 ||
      Math.abs(k - ABS_ZERO_K) < 0.001 ||
      Math.abs(f - ABS_ZERO_F) < 0.001;

    note.textContent = atAbsZero
      ? "You’re at absolute zero — the coldest possible temperature."
      : "Converted all three units from your " + from + " input.";
    note.classList.toggle("is-warn", atAbsZero);
  });
})();
