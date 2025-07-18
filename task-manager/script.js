//=========== task array to hold task in memory ==========
let tasks = [];

//=============== DOM REFERENCES ========================
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");


// ========== COOKIE HELPER FUNCTIONS ===================
function setCookie(name, value, maxAgeSeconds){
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/;`;
}

function getCookie(name){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if(parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null
}


// ========== FUNCTION TO SAVE TASKS TO COOKIE ===========

function saveTaskToCookie(){
    const taskTitles = tasks.map(t => t.title).join('\n');
    setCookie('tasks', taskTitles, 3600);
}


// ========== FUNCTION TO LOAD TASKS FROM COOKIE =========

function loadTaskFromCookie(){
    const tasksCookie = getCookie('tasks');
    if (tasksCookie){
        const taskTitles = tasksCookie.split('\n');
        tasks = taskTitles.map(title => ({title}));
    }
}

// ========== FUNCTION TO RENDER ========================
function renderTask() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    const span = document.createElement("span");

    span.textContent = task.title;
    span.className = "task-title";

    //================= DELETE BUTTON =================
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      deleteTask(index);
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

//============== FUNCTION TO ADD TASK ===================
function addTask(title) {
  tasks.push({ title });
  saveTaskToCookie();
  renderTask();
}

//============== FUNCTION TO DELETE TASK =================
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTaskToCookie();
  renderTask();
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
