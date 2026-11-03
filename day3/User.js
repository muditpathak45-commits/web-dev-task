const users = [
  { id: 1, name: "John", email: "john@gmail.com", status: "Active" },
  { id: 2, name: "David", email: "david@gmail.com", status: "Active" },
  { id: 3, name: "Sarah", email: "sarah@gmail.com", status: "Inactive" },
];

const getEl = (id) => document.getElementById(id);

function renderTable() {
  const tbody = getEl("userTableBody");
  const searchBox = getEl("searchUser");
  if (!tbody) return;

  const term = searchBox ? searchBox.value.trim().toLowerCase() : "";

  const matches = users.filter(function (user) {
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  tbody.innerHTML = "";

  if (matches.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.className = "text-center text-muted py-4";
    cell.textContent = "No users found.";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  matches.forEach(function (user) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = user.name;

    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;

    const statusCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className =
      user.status === "Active" ? "badge bg-success" : "badge bg-secondary";
    badge.textContent = user.status;
    statusCell.appendChild(badge);

    const actionCell = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-primary btn-sm edit-btn";
    editBtn.dataset.action = "edit";
    editBtn.dataset.id = user.id;
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-danger btn-sm delete-btn";
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.id = user.id;
    deleteBtn.textContent = "Delete";

    actionCell.append(editBtn, deleteBtn);
    row.append(nameCell, emailCell, statusCell, actionCell);
    tbody.appendChild(row);
  });
}

function deleteUser(id) {
  const index = users.findIndex(function (user) {
    return user.id === id;
  });
  if (index === -1) return;

  const confirmed = confirm(
    "Are you sure you want to delete " + users[index].name + "?",
  );
  if (!confirmed) return;

  users.splice(index, 1);
  renderTable();
}

function openEditModal(id) {
  const user = users.find(function (u) {
    return u.id === id;
  });
  if (!user) return;

  getEl("editUserId").value = user.id;
  getEl("editName").value = user.name;
  getEl("editEmail").value = user.email;
  getEl("editStatus").value = user.status;

  bootstrap.Modal.getOrCreateInstance(getEl("editModal")).show();
}

function saveEdit() {
  const id = Number(getEl("editUserId").value);
  const user = users.find(function (u) {
    return u.id === id;
  });
  if (!user) return;

  user.name = getEl("editName").value.trim();
  user.email = getEl("editEmail").value.trim();
  user.status = getEl("editStatus").value;

  bootstrap.Modal.getOrCreateInstance(getEl("editModal")).hide();
  renderTable();
}

document.addEventListener("input", function (event) {
  if (event.target.id === "searchUser") {
    renderTable();
  }
});

document.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  if (button.dataset.action === "edit") openEditModal(id);
  if (button.dataset.action === "delete") deleteUser(id);
});

document.addEventListener("submit", function (event) {
  if (event.target.id === "editForm") {
    event.preventDefault();
    saveEdit();
  }
});

renderTable();