let taskInput = document.getElementById("new-task");
let addButton = document.getElementById("addButton");
let incompleteTasks = document.getElementById("incomplete-tasks");
let completedTasks = document.getElementById("completed-tasks");
let clearButton = document.getElementById("clear");

function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
 }

let createNewTask = function(taskName, completed = false) {
    let listItem = document.createElement("li");
    let checkBox = document.createElement("input");
    let label = document.createElement("label");
    let editInput = document.createElement("input");
    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    checkBox.type = "checkBox";
    checkBox.checked = completed;
    editInput.type = "text";
    editButton.innerText = "Edit";
    editButton.className = "edit";
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";
    label.innerText = taskName;
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
}

let addTask = function() {
    if (taskInput.value == "") {
        alert("Task to be added should not be empty!");
        return;
    }
    let listItem = createNewTask(taskInput.value);
    incompleteTasks.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    let tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskInput.value, completed: false });
    saveTasksToLocalStorage(tasks);

    taskInput.value ="";
}

let editTask = function() {

    let listItem = this.parentNode;
    let editInput = listItem.querySelector("input[type=text]");
    let label = listItem.querySelector("label");
    let containsClass = listItem.classList.contains("editMode");
    if (containsClass) {
        label.innerText = editInput.value;
    } else {
        editInput.value = label.innerText;
    }
    listItem.classList.toggle("editMode");

    let tasks = getTasksFromLocalStorage();
    tasks = editInput.value;
}


let deleteTask = function() {
    let listItem = this.parentNode;
    let ul = listItem.parentNode;
    ul.removeChild(listItem);

    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.text !== listItem.querySelector("label").innerText);
    saveTasksToLocalStorage(tasks);
}


let taskCompleted = function() {
    let listItem = this.parentNode;
    completedTasks.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);

    let tasks = getTasksFromLocalStorage();
    let taskText = listItem.querySelector("label").innerText;
    tasks = tasks.map(task => (task.text === taskText ? { ...task, completed: true } : task));
    saveTasksToLocalStorage(tasks);
}

let taskIncomplete = function() {
    let listItem = this.parentNode;
    incompleteTasks.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    let tasks = getTasksFromLocalStorage();
    let taskText = listItem.querySelector("label").innerText;
    tasks = tasks.map(task => (task.text === taskText ? { ...task, completed: false } : task));
    saveTasksToLocalStorage(tasks);
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

let bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
    let checkBox = taskListItem.querySelector('input[type="checkbox"]');
    let editButton = taskListItem.querySelector("button.edit");
    let deleteButton = taskListItem.querySelector("button.delete");
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = checkBoxEventHandler;
}

let clear = function() {
    incompleteTasks.innerHTML = "";
    completedTasks.innerHTML = ""; 

    localStorage.removeItem('tasks');
}

let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
displayTasks(storedTasks);

function displayTasks(tasks) {
    let incompleteTasks = document.getElementById("incomplete-tasks");
    let completedTasks = document.getElementById("completed-tasks");

    tasks.forEach(task => {
        let listItem = createNewTask(task.text, task.completed);
        if (task.completed) {
            completedTasks.appendChild(listItem);
            bindTaskEvents(listItem, taskIncomplete);
        } else {
            incompleteTasks.appendChild(listItem);
            bindTaskEvents(listItem, taskCompleted);
        }
    });
}

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

addButton.addEventListener("click", addTask);
clearButton.addEventListener('click', clear);
