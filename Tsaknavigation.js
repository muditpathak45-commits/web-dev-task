
const taskPages = [
  
  { day: "Day 1", title: "Registration", path: "day1/Registration.html", icon: "▤" },
  { day: "Day 1", title: "Login", path: "day1/Login.html", icon: "↪" },
  { day: "Day 2", title: "Registration Validation", path: "day2/RegistrationValidation.html", icon: "✓" },
  { day: "Day 2", title: "Login Validation", path: "day2/Loginvalidation.html", icon: "✓" },
  { day: "Day 3", title: "User Management", path: "day3/User.html", icon: "♙" },
  { day: "Day 4", title: "API Integration", path: "day4/api.html", icon: "⌘" }
];

const currentPath = window.location.pathname;
const isTaskFolder = /\/day\d+\//i.test(currentPath);
const rootPrefix = isTaskFolder ? "../" : "";

const currentRelativePath = currentPath
  .split("/")
  .filter(Boolean)
  .slice(-2)
  .join("/");

function getTaskUrl(path) {
  return rootPrefix + path;
}

function renderTaskNavigation() {
  document.body.classList.add("task-page");

  const header = document.createElement("header");
  header.className = "workspace-header";
  header.innerHTML = `
    <a class="workspace-brand" href="${getTaskUrl("index.html")}">
      <span class="brand-symbol">W</span>
      <span>
        <strong>WebDev Workspace</strong>
        <small>Learning & Development</small>
      </span>
    </a>

    <div class="header-right">
      <span class="workspace-status">
        <span class="status-dot"></span>
        Training Workspace
      </span>
      <span class="profile-avatar" aria-label="User profile">MP</span>
    </div>
  `;

  const sidebar = document.createElement("aside");
  sidebar.className = "workspace-sidebar";
  sidebar.setAttribute("aria-label", "Task navigation");

  const navItems = taskPages.map((task) => {
    const taskPath = task.path;
    const isCurrent =
      currentPath.endsWith("/" + taskPath) ||
      currentPath.endsWith("/" + taskPath.split("/").pop());

    return `
      <a
        class="workspace-link ${isCurrent ? "active" : ""}"
        href="${getTaskUrl(taskPath)}"
        ${isCurrent ? 'aria-current="page"' : ""}
      >
        <span class="nav-symbol" aria-hidden="true">${task.icon}</span>
        <span class="nav-label">${task.title}</span>
        ${isCurrent ? '<span class="active-indicator"></span>' : ""}
      </a>
    `;
  }).join("");

  sidebar.innerHTML = `
    <div class="sidebar-heading">
      <span class="sidebar-eyebrow">WORKSPACE</span>
      <h2>Task Navigation</h2>
      <p>Open any task page</p>
    </div>
    <nav class="workspace-nav">
      ${navItems}
    </nav>
    <div class="sidebar-footer">
      <span class="footer-mark">✓</span>
      <div>
        <strong>Keep learning</strong>
        <small>One task at a time</small>
      </div>
    </div>
  `;

  document.body.prepend(sidebar);
  document.body.prepend(header);

  const menuButton = document.createElement("button");
  menuButton.className = "mobile-menu-button";
  menuButton.type = "button";
  menuButton.setAttribute("aria-label", "Toggle task navigation");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.textContent = "☰";

  header.querySelector(".workspace-brand").after(menuButton);

  menuButton.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("sidebar-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile sidebar after choosing a task.
  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("sidebar-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderTaskNavigation);
} else {
  renderTaskNavigation();
}
