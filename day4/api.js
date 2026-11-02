const API_URLS = [
    "https://dummyjson.com/users?limit=50&select=id,firstName,lastName,email",
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

function normalizeUsers(rawUsers) {
    return rawUsers.map(function (user, index) {
        const fullName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || `User ${index + 1}`;
        return {
            id: user.id,
            name: fullName,
            email: user.email || "N/A",
            // API mein status nahi hota, isliye alternate Active/Inactive
            status: index % 2 === 0 ? "Active" : "Inactive"
        };
    });
}

function hideAllResults() {
    errorMessage.classList.add("d-none");
    emptyMessage.classList.add("d-none");
    tableContainer.classList.add("d-none");
    paginationContainer.classList.add("d-none");
    paginationContainer.classList.remove("d-flex");
}

async function fetchUsers() {
    // Loading state
    hideAllResults();
    loadingMessage.classList.remove("d-none");

    let loadedUsers = null;

    for (const apiUrl of API_URLS) {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: { Accept: "application/json" }
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const userList = Array.isArray(data)
                ? data
                : data && Array.isArray(data.users)
                    ? data.users
                    : null;

            if (!userList || !userList.length) {
                throw new Error("API response did not contain any users");
            }

            loadedUsers = normalizeUsers(userList);
            break; // success, doosri API try karne ki zaroorat nahi
        } catch (error) {
            console.error(`Unable to load users from ${apiUrl}:`, error);
        }
    }

    // Loading hamesha band hogi
    loadingMessage.classList.add("d-none");

    // Error state (Retry button errorMessage ke andar hai)
    if (!loadedUsers) {
        users = [];
        errorMessage.classList.remove("d-none");
        return;
    }

    // Success state
    users = loadedUsers;
    currentPage = 1;
    processUsers();
}

function processUsers() {
    // Data aane se pehle (loading/error ke time) kuch render mat karo
    if (!users.length) {
        return;
    }

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
        // API mein date nahi hoti, isliye bada id = newest
        processedUsers.sort(function (a, b) {
            return b.id - a.id;
        });
    } else if (selectedSort === "oldest") {
        processedUsers.sort(function (a, b) {
            return a.id - b.id;
        });
    }

    // Empty state
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

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item ${pageNumber === currentPage ? "active" : ""}`;
        pageItem.innerHTML = `
            <button
                class="page-link"
                type="button"
                aria-label="Page ${pageNumber}"
                ${pageNumber === currentPage ? 'aria-current="page"' : ""}
            >
                ${pageNumber}
            </button>
        `;
        pageItem.querySelector("button").addEventListener("click", function () {
            currentPage = pageNumber;
            processUsers();
        });
        pagination.appendChild(pageItem);
    }

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