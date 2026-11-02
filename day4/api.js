const API_URLS = [
    "https://dummyjson.com/users?limit=30&select=id,firstName,lastName,email",
    "https://jsonplaceholder.typicode.com/users"
];
let users = [];
let currentPage = 1;
const usersPerPage = 10;

const userTableBody = document.getElementById("userTableBody");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const retryButton = document.getElementById("retryButton");
const emptyMessage = document.getElementById("emptyMessage");
const tableContainer = document.getElementById("tableContainer");
const paginationContainer = document.getElementById("paginationContainer");
const paginationInfo = document.getElementById("paginationInfo");
const pagination = document.getElementById("pagination");
const statusFilter = document.getElementById("statusFilter");
const sortBy = document.getElementById("sortBy");
const searchInput = document.getElementById("searchInput");

async function fetchUsers() {
    loadingMessage.classList.remove("d-none");
    errorMessage.classList.add("d-none");
    emptyMessage.classList.add("d-none");
    tableContainer.classList.add("d-none");
    paginationContainer.classList.add("d-none");
    paginationContainer.classList.remove("d-flex");

    let lastError = null;

    try {
        for (const apiUrl of API_URLS) {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                const userList = Array.isArray(data)
                    ? data
                    : data && Array.isArray(data.users)
                        ? data.users
                        : null;

                if (!userList) {
                    throw new Error("API response did not contain a user list");
                }

                users = userList.map(function (user, index) {
                    const fullName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();
                    return {
                        id: user.id,
                        name: fullName || `User ${index + 1}`,
                        email: user.email,
                        status: index % 2 === 0 ? "Active" : "Inactive"
                    };
                });

                currentPage = 1;
                processUsers();
                return;
            } catch (error) {
                lastError = error;
                console.error(`Unable to load users from ${apiUrl}:`, error);
            }
        }

        console.error("Unable to load users:", lastError);
        errorMessage.classList.remove("d-none");
    } finally {
        loadingMessage.classList.add("d-none");
    }
}

function processUsers() {
    let processedUsers = [...users];
    const selectedStatus = statusFilter.value;
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (selectedStatus !== "All") {
        processedUsers = processedUsers.filter(function (user) {
            return user.status === selectedStatus;
        });
    }

    if (searchTerm) {
        processedUsers = processedUsers.filter(function (user) {
            return user.name.toLowerCase().includes(searchTerm)
                || user.email.toLowerCase().includes(searchTerm);
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
    currentPage = Math.min(currentPage, totalPages || 1);

    const startIndex = (currentPage - 1) * usersPerPage;
    const pageUsers = processedUsers.slice(startIndex, startIndex + usersPerPage);

    displayUsers(pageUsers);
    createPagination(totalPages, processedUsers.length);
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

function createPagination(totalPages, filteredCount) {
    pagination.innerHTML = "";
    const startItem = (currentPage - 1) * usersPerPage + 1;
    const endItem = Math.min(currentPage * usersPerPage, filteredCount);

    paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredCount}`;

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

    const pageNumbers = Array.from({ length: totalPages }, function (_, index) {
        return index + 1;
    });

    pageNumbers.forEach(function (pageNumber) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item ${pageNumber === currentPage ? "active" : ""}`;
        pageItem.innerHTML = `
            <button
                class="page-link"
                type="button"
                aria-label="Page ${pageNumber}"
                ${pageNumber === currentPage ? "aria-current=\"page\"" : ""}
            >
                ${pageNumber}
            </button>
        `;
        pageItem.querySelector("button").addEventListener("click", function () {
            currentPage = pageNumber;
            processUsers();
        });
        pagination.appendChild(pageItem);
    });

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

searchInput.addEventListener("input", function () {
    currentPage = 1;
    processUsers();
});

retryButton.addEventListener("click", fetchUsers);

fetchUsers();
