(function () {
  var expressionEl = document.getElementById("expression");
  var resultEl = document.getElementById("result");
  var keysEl = document.getElementById("keys");

  // State — no eval(); we track operands and operator ourselves
  var current = "0";      // string being typed
  var previous = null;    // number operand
  var operator = null;    // "+", "−", "×", "÷"
  var shouldReset = false; // next digit starts fresh after =
  var lastOperand = null;  // for repeated = (operator chaining style)
  var lastOperator = null;

  function render() {
    expressionEl.textContent =
      previous !== null && operator
        ? formatNum(previous) + " " + operator
        : " ";
    resultEl.textContent = current;
    resultEl.classList.remove("is-error");
  }

  function formatNum(n) {
    if (!Number.isFinite(n)) return "Error";
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
    return String(Math.round(n * 1e10) / 1e10);
  }

  function showError(msg) {
    current = msg;
    resultEl.textContent = msg;
    resultEl.classList.add("is-error");
    previous = null;
    operator = null;
    shouldReset = true;
    expressionEl.textContent = " ";
  }

  function applyOperator(a, op, b) {
    switch (op) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷":
        if (b === 0) return null;
        return a / b;
      default: return b;
    }
  }

  function inputDigit(d) {
    if (shouldReset || current === "Error") {
      current = d;
      shouldReset = false;
    } else if (current === "0") {
      current = d;
    } else if (current === "-0") {
      current = "-" + d;
    } else if (current.replace(/[-.]/g, "").length < 12) {
      current += d;
    }
    render();
  }

  function inputDecimal() {
    if (shouldReset || current === "Error") {
      current = "0.";
      shouldReset = false;
    } else if (current.indexOf(".") === -1) {
      current += ".";
    }
    render();
  }

  function setOperator(op) {
    if (current === "Error") return;
    var value = parseFloat(current);

    if (previous !== null && operator && !shouldReset) {
      var out = applyOperator(previous, operator, value);
      if (out === null) {
        showError("Cannot divide by zero");
        return;
      }
      previous = out;
      current = formatNum(out);
    } else {
      previous = value;
    }

    operator = op;
    shouldReset = true;
    render();
  }

  function equals() {
    if (current === "Error") return;
    var value = parseFloat(current);

    if (previous !== null && operator) {
      lastOperator = operator;
      lastOperand = value;
      var out = applyOperator(previous, operator, value);
      if (out === null) {
        showError("Cannot divide by zero");
        return;
      }
      previous = null;
      operator = null;
      current = formatNum(out);
      shouldReset = true;
      expressionEl.textContent = formatNum(lastOperand) !== "undefined"
        ? ""
        : " ";
      // show what was computed briefly in expression line
      expressionEl.innerHTML = "&nbsp;";
      render();
      // keep expression as the completed calc
      expressionEl.textContent = "";
      return;
    }

    // Repeat last equals: 5 + = → 10, = → 15 …
    if (lastOperator !== null && lastOperand !== null) {
      var base = parseFloat(current);
      var again = applyOperator(base, lastOperator, lastOperand);
      if (again === null) {
        showError("Cannot divide by zero");
        return;
      }
      current = formatNum(again);
      render();
    }
  }

  function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    shouldReset = false;
    lastOperand = null;
    lastOperator = null;
    render();
  }

  function backspace() {
    if (current === "Error" || shouldReset) {
      render();
      return;
    }
    if (current.length <= 1 || (current.length === 2 && current[0] === "-")) {
      current = "0";
    } else {
      current = current.slice(0, -1);
    }
    render();
  }

  function percent() {
    if (current === "Error") return;
    var v = parseFloat(current);
    if (Number.isNaN(v)) return;
    current = formatNum(v / 100);
    render();
  }

  // Event listeners on buttons (no inline onclick)
  keysEl.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn || !keysEl.contains(btn)) return;

    if (btn.hasAttribute("data-digit")) {
      inputDigit(btn.getAttribute("data-digit"));
      return;
    }
    if (btn.hasAttribute("data-operator")) {
      setOperator(btn.getAttribute("data-operator"));
      return;
    }
    var action = btn.getAttribute("data-action");
    if (action === "clear") clearAll();
    else if (action === "backspace") backspace();
    else if (action === "decimal") inputDecimal();
    else if (action === "equals") equals();
    else if (action === "percent") percent();
  });

  // Keyboard support
  document.addEventListener("keydown", function (e) {
    if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
    else if (e.key === ".") inputDecimal();
    else if (e.key === "+") setOperator("+");
    else if (e.key === "-") setOperator("−");
    else if (e.key === "*") setOperator("×");
    else if (e.key === "/") { e.preventDefault(); setOperator("÷"); }
    else if (e.key === "Enter" || e.key === "=") equals();
    else if (e.key === "Backspace") backspace();
    else if (e.key === "Escape" || e.key === "c" || e.key === "C") clearAll();
    else if (e.key === "%") percent();
  });

  render();
})();
