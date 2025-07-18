//=========== task array to hold task in memory ==========
let tasks = [];

//=============== DOM REFERENCES ========================
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date-input");
const sortSelect = document.getElementById("sort-select");
const categorySelect = document.getElementById("category-select");
const customCategoryInput = document.getElementById("custom-category-input");
const STORAGE_KEY = "taskManager.tasks";

// ========== COOKIE HELPER FUNCTIONS ===================
function setLocalStorage(name, value) {
  localStorage.setItem(name, JSON.stringify(value));
}

function getLocalStorage(name) {
  const data = localStorage.getItem(name);
  return data ? JSON.parse(data) : null;
}

// ========== FUNCTION TO SAVE TASKS TO LOCALSTOREAGE ===========

function saveTaskToLocalStorage() {
  setLocalStorage(STORAGE_KEY, tasks);
}

// ========== FUNCTION TO LOAD TASKS FROM LOCALSTORAGE =========

function loadTaskFromLocalStorage() {
  const saved = getLocalStorage(STORAGE_KEY);
  tasks = saved || [];
}

// ========== FUNCTION TO RENDER ========================
function renderTask() {
  taskList.innerHTML = "";
  let sortedTasks = [...tasks];
  const sortValue = sortSelect.value;

  //============== SORTED BY TITLE & DUE DATE & COMPLETED ==========================
  if (sortValue === "title") {
    sortedTasks.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  } else if (sortValue === "dueDate") {
    sortedTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  } else if (sortValue === 'completed'){
    sortedTasks.sort((a,b)=>{
      return b.completed - a.completed;
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
    const dateSpan = document.createElement("span");
    dateSpan.textContent = task.dueDate ? `Due: ${task.dueDate}` : "";
    dateSpan.className = "task-due-date";

    //===== CATEGORY ======
    const categorySpan = document.createElement("span");
    categorySpan.textContent = task.category ? task.category : "";
    categorySpan.className = `task-category ${getCategoryClass(task.category)}`;

    //====== WRAP TEXT ELEMENT ===========
    const taskDetailDiv = document.createElement("div");
    taskDetailDiv.className = "task-details";
    taskDetailDiv.appendChild(titleSpan);
    if (task.dueDate) taskDetailDiv.appendChild(dateSpan);
    if (task.category) taskDetailDiv.appendChild(categorySpan);

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
sortSelect.addEventListener("change", renderTask);
//====================END OF RENDER FUNCTION =============================

//================= CATEGORY SELECT FOR OTHER, CUSTOM INPUT ===============
categorySelect.addEventListener("change", () => {
  if (categorySelect.value === "other") {
    customCategoryInput.style.display = "inline-block";
  } else {
    customCategoryInput.style.display = "none";
    customCategoryInput.value = "";
  }
});

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
  const selectedCategory = categorySelect.value;
  const customCategory = customCategoryInput.value.trim();
  const finalCategory =
    selectedCategory === "other" ? customCategory : selectedCategory;
  if (title) {
    addTask(title, dueDate, finalCategory);
    taskInput.value = "";
    dueDateInput.value = "";
    categorySelect.value = "";
    customCategoryInput.value = "";
    customCategoryInput.style.display = "none";
    taskInput.focus();
  }
});

//================= GET COLOR BY CATEGORY ====================
function getCategoryClass(category) {
  const cat = category.toLowerCase();
  if (cat.includes("work")) return "badge-work";
  if (cat.includes("personal")) return "badge-personal";
  if (cat.includes("travel") || cat.includes("trip")) return "badge-travel";
  if (cat.includes("school") || cat.includes("study")) return "badge-school";
  if (cat.includes("urgent")) return "badge-urgent";
  return "badge-default";
}
loadTaskFromLocalStorage();
renderTask();
