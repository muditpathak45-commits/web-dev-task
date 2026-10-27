const API_URL = "https://jsonplaceholder.typicode.com/users";
let users = [];
let currentPage = 2;
const usersPerPage = 4;

const userTableBody = document.getElementById("userTableBody");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const retryButton = document.getElementById("retryButton");
const emptyMessage = document.getElementById("emptyMessage");
const tableContainer = document.getElementById("tableContainer");
const paginationContainer = document.getElementById("paginationContainer");
const pagination = document.getElementById("pagination");
const statusFilter = document.getElementById("statusFilter");
const sortBy = document.getElementById("sortBy");

async function fetchUsers() {
    loadingMessage.classList.remove("d-none");
    errorMessage.classList.add("d-none");
    emptyMessage.classList.add("d-none");
    tableContainer.classList.add("d-none");
    paginationContainer.classList.add("d-none");
    paginationContainer.classList.remove("d-flex");

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error("API response did not contain a user list");
        }

        users = data.map(function (user, index) {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                status: index % 2 === 0 ? "Active" : "Inactive"
            };
        });

        currentPage = 1;
        processUsers();
    } catch (error) {
        console.error("Unable to load users:", error);
        errorMessage.classList.remove("d-none");
    } finally {
        loadingMessage.classList.add("d-none");
    }
}

function processUsers() {
    let processedUsers = [...users];
    const selectedStatus = statusFilter.value;

    if (selectedStatus !== "All") {
        processedUsers = processedUsers.filter(function (user) {
            return user.status === selectedStatus;
        });
    }

    const selectedSort = sortBy.value;
    if (selectedSort === "nameAsc") {
        processedUsers.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    } else if (selectedSort === "nameDesc") {
        processedUsers.sort(function (a, b) {
            return b.name.localeCompare(a.name);
        });
    } else if (selectedSort === "newest") {
        processedUsers.sort(function (a, b) {
            return b.id - a.id;
        });
    } else if (selectedSort === "oldest") {
        processedUsers.sort(function (a, b) {
            return a.id - b.id;
        });
    }

    if (processedUsers.length === 0) {
        tableContainer.classList.add("d-none");
        paginationContainer.classList.add("d-none");
        paginationContainer.classList.remove("d-flex");
        emptyMessage.classList.remove("d-none");
        return;
    }

    emptyMessage.classList.add("d-none");
    const totalPages = Math.ceil(processedUsers.length / usersPerPage);
    currentPage = Math.min(currentPage, totalPages);

    const startIndex = (currentPage - 1) * usersPerPage;
    const pageUsers = processedUsers.slice(startIndex, startIndex + usersPerPage);

    displayUsers(pageUsers);
    createPagination(totalPages);
    tableContainer.classList.remove("d-none");
    paginationContainer.classList.remove("d-none");
    paginationContainer.classList.add("d-flex");
}

function displayUsers(userList) {
    userTableBody.innerHTML = "";

    userList.forEach(function (user) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const emailCell = document.createElement("td");
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        nameCell.textContent = user.name;
        emailCell.textContent = user.email;
        statusBadge.className = user.status === "Active"
            ? "badge bg-success"
            : "badge bg-secondary";
        statusBadge.textContent = user.status;
        statusCell.appendChild(statusBadge);

        row.append(nameCell, emailCell, statusCell);
        userTableBody.appendChild(row);
    });
}

function createPagination(totalPages) {
    pagination.innerHTML = "";

    const previousItem = document.createElement("li");
    previousItem.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    previousItem.innerHTML = `<button class="page-link" type="button" ${currentPage === 1 ? "disabled" : ""}>Previous</button>`;
    previousItem.querySelector("button").addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            processUsers();
        }
    });
    pagination.appendChild(previousItem);

    const currentPageItem = document.createElement("li");
    currentPageItem.className = "page-item active";
    currentPageItem.innerHTML = `<button class="page-link" type="button" aria-current="page">${currentPage}</button>`;
    pagination.appendChild(currentPageItem);

    const nextItem = document.createElement("li");
    nextItem.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    nextItem.innerHTML = `<button class="page-link" type="button" ${currentPage === totalPages ? "disabled" : ""}>Next</button>`;
    nextItem.querySelector("button").addEventListener("click", function () {
        if (currentPage < totalPages) {
            currentPage++;
            processUsers();
        }
    });
    pagination.appendChild(nextItem);
}

statusFilter.addEventListener("change", function () {
    currentPage = 1;
    processUsers();
});

sortBy.addEventListener("change", function () {
    currentPage = 1;
    processUsers();
});

retryButton.addEventListener("click", fetchUsers);

fetchUsers();
