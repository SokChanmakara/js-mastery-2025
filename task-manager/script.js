//=========== task array to hold task in memory ==========
let tasks = [];

//=============== DOM REFERENCES ========================
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");

// ========== COOKIE HELPER FUNCTIONS ===================
function setCookie(name, value, maxAgeSeconds) {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; max-age=${maxAgeSeconds}; path=/;`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return decodeURIComponent(parts.pop().split(";").shift());
  return null;
}

// ========== FUNCTION TO SAVE TASKS TO COOKIE ===========

function saveTaskToCookie() {
  const json = JSON.stringify(tasks);
  setCookie("tasks", json, 3600);
}

// ========== FUNCTION TO LOAD TASKS FROM COOKIE =========

function loadTaskFromCookie() {
  const tasksCookie = getCookie("tasks");
  if (tasksCookie) {
    try {
      tasks = JSON.parse(tasksCookie);
    } catch (error) {
      tasks = [];
    }
  }
}

// ========== FUNCTION TO RENDER ========================
function renderTask() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    //============checkbox=============================
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed || false;
    checkbox.addEventListener("change", () => {
      toggleComplete(index);
    });
    li.appendChild(checkbox);

    const span = document.createElement("span");
    span.textContent = task.title;
    span.className = "task-title";
    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.color = "#888";
    }

    //================= CLICK EDIT TITLE ==============
    span.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.title;

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });

      input.addEventListener("blur", ()=>{
        updateTask(index, input.value.trim());
      });

      li.replaceChild(input, span);
      input.focus();
    });
    li.appendChild(span);

    //================= DELETE BUTTON =================
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      deleteTask(index);
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

//============== FUNCTION TO ADD TASK ===================
function addTask(title) {
  tasks.push({ title, completed:false });
  saveTaskToCookie();
  renderTask();
}

//============== FUNCTION TO DELETE TASK =================
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTaskToCookie();
  renderTask();
}

//================ TOGGLE COMPLETE ========================
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTaskToCookie();
  renderTask();
}
//================ UPDATE TASK ============================
function updateTask(index, newTitle) {
  if (newTitle) {
    tasks[index].title = newTitle;
    saveTaskToCookie();
    renderTask();
  }
}
//================ HANDLE FORM SUBMIT =====================
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (title) {
    addTask(title);
    taskInput.value = "";
    taskInput.focus();
  }
});
loadTaskFromCookie();
renderTask();
