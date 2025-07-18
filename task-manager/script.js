//=========== task array to hold task in memory ==========
let tasks = [];

//=============== DOM REFERENCES ========================
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const categoryInput = document.getElementById("category-input");
const sortSelect = document.getElementById("sort-select");
const STORAGE_KEY = "taskManager.tasks";

// ========== COOKIE HELPER FUNCTIONS ===================
function setLocalStorage(name, value) {
  localStorage.setItem(name, JSON.stringify(value));
}

function getLocalStorage(name) {
  const data = localStorage.getItem(name);
  return data ? JSON.parse(data) : null;
}

// ========== FUNCTION TO SAVE TASKS TO COOKIE ===========

function saveTaskToLocalStorage() {
  setLocalStorage(STORAGE_KEY, tasks);
}

// ========== FUNCTION TO LOAD TASKS FROM COOKIE =========

function loadTaskFromLocalStorage() {
  const saved = getLocalStorage(STORAGE_KEY);
  tasks = saved || [];
}

// ========== FUNCTION TO RENDER ========================
function renderTask() {
  taskList.innerHTML = "";
  let sortedTasks = [...tasks];
  const sortValue = sortSelect.value;

  //============== SORTED BY TITLE & DUE DATE ==========================
  if (sortValue === "title") {
    sortedTasks.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
  } else if (sortValue === "dueDate") {
    sortedTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }

  sortedTasks.forEach((task, index) => {
    const originalIndex = tasks.indexOf(task);
    const li = document.createElement("li");

    //============checkbox=============================
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed || false;
    checkbox.addEventListener("change", () => {
      toggleComplete(originalIndex);
    });
    li.appendChild(checkbox);

    //==== TITLE =====
    const titleSpan = document.createElement("span");
    titleSpan.textContent = task.title;
    titleSpan.className = "task-title";
    if (task.completed) {
      titleSpan.style.textDecoration = "line-through";
      titleSpan.style.color = "#888";
    }

    //==== DUE DATE ======
    const dateSpan = document.createElement('span');
    dateSpan.textContent = task.dueDate? `Due: ${task.dueDate}`: "";
    dateSpan.className = "task-due-date";

    //===== CATEGORY ======
    const categorySpan = document.createElement('span');
    categorySpan.textContent = task.category? task.category: "";
    categorySpan.className = "task-category";

    //====== WRAP TEXT ELEMENT ===========
    const taskDetailDiv = document.createElement('div');
    taskDetailDiv.className = "task-details";
    taskDetailDiv.appendChild(titleSpan);
    if(task.dueDate) taskDetailDiv.appendChild(dateSpan);
    if(task.category) taskDetailDiv.appendChild(categorySpan);

    //================= CLICK EDIT TITLE ==============
    titleSpan.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.title;

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });

      input.addEventListener("blur", () => {
        updateTask(originalIndex, input.value.trim());
      });

      taskDetailDiv.replaceChild(input, titleSpan);
      input.focus();
    });
    li.appendChild(taskDetailDiv);

    //================= DELETE BUTTON =================
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      deleteTask(originalIndex);
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

//============== FUNCTION TO ADD TASK ===================
function addTask(title, dueDate, category) {
  tasks.push({
    title,
    dueDate: dueDate || null,
    category: category || "",
    completed: false,
  });
  saveTaskToLocalStorage();
  renderTask();
}

//============== FUNCTION TO DELETE TASK =================
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTaskToLocalStorage();
  renderTask();
}

//================ TOGGLE COMPLETE ========================
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTaskToLocalStorage();
  renderTask();
}
//================ UPDATE TASK ============================
function updateTask(index, newTitle) {
  if (newTitle) {
    tasks[index].title = newTitle;
    saveTaskToLocalStorage();
    renderTask();
  }
}
//================ HANDLE FORM SUBMIT =====================
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const category = categoryInput.value.trim();
  if (title) {
    addTask(title, dueDate, category);
    taskInput.value = "";
    dueDateInput.value = "";
    categoryInput.value = "";
    taskInput.focus();
  }
});
loadTaskFromLocalStorage();
renderTask();
