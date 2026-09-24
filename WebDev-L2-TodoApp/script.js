(function () {
  var STORAGE_KEY = "oibsip-todo-v1";

  var form = document.getElementById("add-form");
  var input = document.getElementById("task-input");
  var addError = document.getElementById("add-error");
  var pendingList = document.getElementById("pending-list");
  var doneList = document.getElementById("done-list");
  var pendingEmpty = document.getElementById("pending-empty");
  var doneEmpty = document.getElementById("done-empty");
  var pendingCount = document.getElementById("pending-count");
  var doneCount = document.getElementById("done-count");

  var tasks = load();
  var editingId = null;

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter(function (t) {
        return t && typeof t.id === "string" && typeof t.text === "string";
      });
    } catch (e) {
      return [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function uid() {
    return "t-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function showAddError(msg) {
    if (!msg) {
      addError.hidden = true;
      addError.textContent = "";
      return;
    }
    addError.hidden = false;
    addError.textContent = msg;
  }

  function addItem(task) {
    var li = document.createElement("li");
    li.className = "item" + (task.done ? " is-done" : "");
    li.dataset.id = task.id;

    var isEditing = editingId === task.id;

    li.innerHTML =
      '<input type="checkbox" class="toggle" aria-label="Mark complete"' +
      (task.done ? " checked" : "") +
      " />" +
      (isEditing
        ? '<input class="row-edit" type="text" maxlength="200" value="' +
          escapeHtml(task.text) +
          '" />'
        : '<span class="item__text">' + escapeHtml(task.text) + "</span>") +
      '<div class="item__actions">' +
      (isEditing
        ? '<button type="button" class="item__edit item__edit--ok" data-action="save">Save</button>' +
          '<button type="button" class="item__edit" data-action="cancel">Cancel</button>'
        : '<button type="button" class="item__edit" data-action="edit">Edit</button>' +
          '<button type="button" class="item__edit item__edit--danger" data-action="delete">Delete</button>') +
      "</div>";

    (task.done ? doneList : pendingList).appendChild(li);

    if (isEditing) {
      var editInput = li.querySelector(".row-edit");
      if (editInput) {
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
      }
    }
  }

  function render() {
    pendingList.innerHTML = "";
    doneList.innerHTML = "";

    var pending = tasks.filter(function (t) { return !t.done; });
    var done = tasks.filter(function (t) { return t.done; });

    pending.forEach(addItem);
    done.forEach(addItem);

    pendingCount.textContent = pending.length + " pending";
    doneCount.textContent = done.length + " completed";
    pendingEmpty.hidden = pending.length > 0;
    doneEmpty.hidden = done.length > 0;
  }

  function findTask(id) {
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) return tasks[i];
    }
    return null;
  }

  // Add
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) {
      showAddError("Task cannot be empty.");
      return;
    }
    showAddError("");
    tasks.unshift({ id: uid(), text: text, done: false, createdAt: Date.now() });
    input.value = "";
    input.focus();
    save();
    render();
  });

  // List interactions (event delegation)
  function onListClick(e) {
    var li = e.target.closest(".item");
    if (!li) return;
    var id = li.dataset.id;
    var task = findTask(id);
    if (!task) return;

    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");

    if (action === "edit") {
      editingId = id;
      render();
    } else if (action === "cancel") {
      editingId = null;
      render();
    } else if (action === "save") {
      var field = li.querySelector(".row-edit");
      var val = field ? field.value.trim() : "";
      if (!val) {
        showAddError("Task cannot be empty.");
        return;
      }
      showAddError("");
      task.text = val;
      editingId = null;
      save();
      render();
    } else if (action === "delete") {
      tasks = tasks.filter(function (t) { return t.id !== id; });
      if (editingId === id) editingId = null;
      save();
      render();
    }
  }

  function onListChange(e) {
    if (!e.target.classList.contains("toggle")) return;
    var li = e.target.closest(".item");
    if (!li) return;
    var task = findTask(li.dataset.id);
    if (!task) return;
    task.done = e.target.checked;
    if (editingId === task.id) editingId = null;
    save();
    render();
  }

  function onListKeydown(e) {
    if (!e.target.classList.contains("row-edit")) return;
    var li = e.target.closest(".item");
    if (!li) return;
    if (e.key === "Enter") {
      e.preventDefault();
      var saveBtn = li.querySelector('[data-action="save"]');
      if (saveBtn) saveBtn.click();
    } else if (e.key === "Escape") {
      editingId = null;
      render();
    }
  }

  pendingList.addEventListener("click", onListClick);
  doneList.addEventListener("click", onListClick);
  pendingList.addEventListener("change", onListChange);
  doneList.addEventListener("change", onListChange);
  pendingList.addEventListener("keydown", onListKeydown);
  doneList.addEventListener("keydown", onListKeydown);

  render();
})();
