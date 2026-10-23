const users = [
  {
    id: 1,
    name: "John",
    email: "john@gmail.com",
    status: "Active",
  },
  {
    id: 2,
    name: "David",
    email: "david@gmail.com",
    status: "Active",
  },
  {
    id: 3,
    name: "Sarah",
    email: "sarah@gmail.com",
    status: "Inactive",
  },
];
const userTableBody = document.getElementById("userTableBody");
const searchUser = document.getElementById("searchUser");
const editForm = document.getElementById("editForm");
const editUserId = document.getElementById("editUserId");
const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editStatus = document.getElementById("editStatus");
const editModalElement = document.getElementById("editModal");
const editModal = new bootstrap.Modal(editModalElement);

function displayUsers(userList) {
  userTableBody.innerHTML = "";
  userList.forEach(function (user) {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                ${
                  user.status === "Active"
                    ? '<span class="badge bg-success">Active</span>'
                    : '<span class="badge bg-secondary">Inactive</span>'
                }
            </td>
            <td>
                <button
                    class="btn btn-primary btn-sm edit-btn"
                    onclick="editUser(${user.id})"
                >
                    Edit
                </button>
                <button
                    class="btn btn-danger btn-sm delete-btn"
                    onclick="deleteUser(${user.id})"
                >
                    Delete
                </button>
            </td>
        `;
    userTableBody.appendChild(row);
  });
}
displayUsers(users);
searchUser.addEventListener("input", function () {
  const searchText = searchUser.value.toLowerCase().trim();
  const filteredUsers = users.filter(function (user) {
    return (
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText)
    );
  });
  displayUsers(filteredUsers);
});
function deleteUser(id) {
  const user = users.find(function (user) {
    return user.id === id;
  });
  const confirmDelete = confirm(
    `Are you sure you want to delete ${user.name}?`,
  );

  if (confirmDelete) {
    const userIndex = users.findIndex(function (user) {
      return user.id === id;
    });
    users.splice(userIndex, 1);
    displayUsers(users);
  }
}
function editUser(id) {
  const user = users.find(function (user) {
    return user.id === id;
  });
  editUserId.value = user.id;
  editName.value = user.name;
  editEmail.value = user.email;
  editStatus.value = user.status;
  editModal.show();
}
editForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const id = Number(editUserId.value);
  const user = users.find(function (user) {
    return user.id === id;
  });
  user.name = editName.value;
  user.email = editEmail.value;
  user.status = editStatus.value;
  editModal.hide();
  displayUsers(users);
});
