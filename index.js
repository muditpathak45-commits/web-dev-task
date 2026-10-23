const taskLinks = Array.from(document.querySelectorAll("[data-task]"));
const taskSelect = document.getElementById("taskSelect");
const openTaskButton = document.getElementById("openTaskBtn");

const tasks = taskLinks.map(function (link) {
  const daySection = link.closest(".day-section");
  const dayHeading = daySection.querySelector("h2");
  const taskHeading = link.closest(".task-card").querySelector("h3");

  return {
    day: dayHeading.textContent.trim(),
    name: taskHeading.textContent.trim(),
    url: link.getAttribute("href"),
  };
});

const taskGroups = new Map();

tasks.forEach(function (task, index) {
  if (!taskGroups.has(task.day)) {
    const group = document.createElement("optgroup");
    group.label = task.day;
    taskGroups.set(task.day, group);
    taskSelect.appendChild(group);
  }

  const option = document.createElement("option");
  option.value = String(index);
  option.textContent = task.name;
  taskGroups.get(task.day).appendChild(option);
});

function getSelectedIndex() {
  return Number(taskSelect.value);
}

function openTask(index) {
  const task = tasks[index];

  if (task) {
    window.location.href = task.url;
  }
}

openTaskButton.addEventListener("click", function () {
  if (taskSelect.value !== "") {
    openTask(getSelectedIndex());
  }
});

openTaskButton.disabled = true;
taskSelect.addEventListener("change", function () {
  openTaskButton.disabled = taskSelect.value === "";
});
