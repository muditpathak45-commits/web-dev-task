// Demo API URL
const API_URL = "https://jsonplaceholder.typicode.com/users";

// GET: Employees fetch karna
async function getEmployees() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("API request failed. Please try again.");
    }

    return await response.json();
}


// POST: New employee add karna
async function createEmployee(employee) {

    const response = await fetch(API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(employee)
    });

    if (!response.ok) {
        throw new Error("Could not add employee.");
    }

    return await response.json();
}


// PATCH: Employee update karna
async function updateEmployee(id, employee) {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(employee)
    });

    if (!response.ok) {
        throw new Error("Could not update employee.");
    }

    return await response.json();
}


// DELETE: Employee delete karna
async function deleteEmployee(id) {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Could not delete employee.");
    }

    return true;
}
// Employee data
let employees = [];

// Pagination variables
let currentPage = 1;
let employeesPerPage = 10;

// Edit employee ID
let editingEmployeeId = null;


// Bootstrap modal objects
const employeeFormModal = new bootstrap.Modal(
    document.getElementById("employeeFormModal")
);

const viewEmployeeModal = new bootstrap.Modal(
    document.getElementById("viewEmployeeModal")
);


// Normalize status
function normalizeStatus(value) {
    return String(value || "").trim().toLowerCase();
}


// Loading message
function showLoading(show) {
    document.getElementById("loadingMessage")
        .classList.toggle("d-none", !show);
}


// Error message
function showError(message) {

    document.getElementById("errorText").textContent = message;

    document.getElementById("errorMessage")
        .classList.remove("d-none");
}


// Hide error
function hideError() {

    document.getElementById("errorMessage")
        .classList.add("d-none");
}


// API data ko employee format mein convert karna
function mapApiUsers(users) {

    const departments = [
        "Engineering",
        "Finance",
        "HR",
        "Marketing",
        "Sales"
    ];

    return users.map(function (user, index) {

        const projects = [];

        const projectCount = index % 4;

        for (let i = 0; i < projectCount; i++) {

            projects.push({
                name: "Project " + String.fromCharCode(65 + i),

                status: i % 2 === 0
                    ? "Active"
                    : "Completed"
            });
        }

        return {

            id: user.id,

            name: user.name,

            email: user.email,

            mobile: user.phone
                ? user.phone.replace(/\D/g, "").slice(0, 10).padEnd(10, "0")
                : "0000000000",

            department: departments[index % departments.length],

            joiningDate: `202${(index % 4) + 2}-0${(index % 9) + 1}-15`,

            status: index % 4 === 0
                ? "Inactive"
                : "Active",

            projects: projects
        };
    });
}


// API se employees load karna
async function loadEmployees() {

    showLoading(true);
    hideError();

    try {

        const apiUsers = await getEmployees();

        employees = mapApiUsers(apiUsers);

        currentPage = 1;

        renderDashboard();

    } catch (error) {

        showError(error.message);

        document.getElementById("employeeTableBody").innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    Could not load employees.
                </td>
            </tr>
        `;

    } finally {

        showLoading(false);
    }
}


// Dashboard cards update karna
function updateDashboard() {

    // Total employees
    const totalEmployees = employees.length;


    // Active employees
    const activeEmployees = employees.filter(function (employee) {

        return normalizeStatus(employee.status) === "active";

    }).length;


    // Active projects
    const activeProjects = employees.reduce(function (total, employee) {

        return total + (employee.projects || []).filter(function (project) {

            return normalizeStatus(project.status) === "active";

        }).length;

    }, 0);


    // Unassigned employees
    const unassignedEmployees = employees.filter(function (employee) {

        return !employee.projects || employee.projects.length === 0;

    }).length;


    // Display values
    document.getElementById("totalEmployees").textContent = totalEmployees;

    document.getElementById("activeEmployees").textContent = activeEmployees;

    document.getElementById("activeProjects").textContent = activeProjects;

    document.getElementById("unassignedEmployees").textContent = unassignedEmployees;
}


// Search, filter and sorting
function getFilteredEmployees() {

    const search = document.getElementById("searchInput")
        .value.trim().toLowerCase();

    const department = document.getElementById("departmentFilter").value;

    const status = document.getElementById("statusFilter").value;

    const projectStatus = document.getElementById("projectStatusFilter").value;

    const sort = document.getElementById("sortFilter").value;


    // Filtering
    let result = employees.filter(function (employee) {

        const matchesSearch =
            employee.name.toLowerCase().includes(search) ||
            employee.email.toLowerCase().includes(search);


        const matchesDepartment =
            department === "All" ||
            employee.department === department;


        const matchesStatus =
            status === "All" ||
            employee.status === status;


        const matchesProjectStatus =
            projectStatus === "All" ||
            (employee.projects || []).some(function (project) {

                return normalizeStatus(project.status) ===
                    normalizeStatus(projectStatus);

            });


        return matchesSearch &&
            matchesDepartment &&
            matchesStatus &&
            matchesProjectStatus;

    });


    // Sorting
    if (sort !== "none") {

        result = [...result].sort(function (a, b) {

            switch (sort) {

                case "nameAsc":
                    return a.name.localeCompare(b.name);

                case "nameDesc":
                    return b.name.localeCompare(a.name);

                case "projectsAsc":
                    return (a.projects || []).length -
                        (b.projects || []).length;

                case "projectsDesc":
                    return (b.projects || []).length -
                        (a.projects || []).length;

                case "joiningAsc":
                    return new Date(a.joiningDate) -
                        new Date(b.joiningDate);

                case "joiningDesc":
                    return new Date(b.joiningDate) -
                        new Date(a.joiningDate);

                case "statusAsc":
                    return a.status.localeCompare(b.status);

                case "statusDesc":
                    return b.status.localeCompare(a.status);

                default:
                    return 0;
            }

        });
    }

    return result;
}


// Employee table display karna
function displayEmployees(employeeList) {

    const tableBody = document.getElementById("employeeTableBody");

    tableBody.innerHTML = "";


    // No employee found
    if (employeeList.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    No employees found.
                </td>
            </tr>
        `;

        return;
    }


    employeeList.forEach(function (employee) {

        const projectCount = (employee.projects || []).length;

        const badgeClass =
            normalizeStatus(employee.status) === "active"
                ? "active-badge"
                : "inactive-badge";


        const row = document.createElement("tr");


        const nameCell = document.createElement("td");

        const strong = document.createElement("strong");

        strong.textContent = employee.name;

        nameCell.appendChild(strong);


        const emailCell = document.createElement("td");

        emailCell.textContent = employee.email;


        const departmentCell = document.createElement("td");

        departmentCell.textContent = employee.department;


        const projectCell = document.createElement("td");

        projectCell.textContent = projectCount;


        const statusCell = document.createElement("td");

        const badge = document.createElement("span");

        badge.className = `status-badge ${badgeClass}`;

        badge.textContent = employee.status;

        statusCell.appendChild(badge);


        const actionCell = document.createElement("td");

        actionCell.innerHTML = `

            <button class="btn btn-sm view-btn me-1"
                data-action="view"
                data-id="${employee.id}">
                View
            </button>

            <button class="btn btn-sm edit-btn me-1"
                data-action="edit"
                data-id="${employee.id}">
                Edit
            </button>

            <button class="btn btn-sm delete-btn"
                data-action="delete"
                data-id="${employee.id}">
                Delete
            </button>

        `;


        row.append(
            nameCell,
            emailCell,
            departmentCell,
            projectCell,
            statusCell,
            actionCell
        );

        tableBody.appendChild(row);

    });
}


// Pagination
function displayPagination(totalItems) {

    const totalPages = Math.ceil(totalItems / employeesPerPage);

    const container = document.getElementById("paginationButtons");

    container.innerHTML = "";


    if (totalPages === 0) {

        currentPage = 1;

        document.getElementById("previousBtn").disabled = true;

        document.getElementById("nextBtn").disabled = true;

        return;
    }


    if (currentPage > totalPages) {

        currentPage = totalPages;
    }


    for (let page = 1; page <= totalPages; page++) {

        const button = document.createElement("button");

        button.type = "button";

        button.textContent = page;

        button.className = `btn btn-sm ${
            page === currentPage
                ? "btn-primary"
                : "btn-outline-primary"
        }`;


        button.addEventListener("click", function () {

            currentPage = page;

            renderDashboard();

        });


        container.appendChild(button);
    }


    document.getElementById("previousBtn").disabled =
        currentPage === 1;

    document.getElementById("nextBtn").disabled =
        currentPage === totalPages;
}


// Main dashboard render function
function renderDashboard() {

    updateDashboard();

    const filteredEmployees = getFilteredEmployees();


    // Pagination calculation
    const startIndex = (currentPage - 1) * employeesPerPage;

    const endIndex = startIndex + employeesPerPage;

    const paginatedEmployees = filteredEmployees.slice(
        startIndex,
        endIndex
    );


    displayEmployees(paginatedEmployees);

    displayPagination(filteredEmployees.length);


    document.getElementById("resultCount").textContent =
        `${filteredEmployees.length} employees found`;
}


// Search/filter/sort par page reset karna
function resetPageAndRender() {

    currentPage = 1;

    renderDashboard();
}
// HTML text ko safe banana
function escapeHtml(value) {

    return String(value ?? "").replace(/[&<>"']/g, function (char) {

        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];

    });
}


// VIEW EMPLOYEE
function viewEmployee(id) {

    const employee = employees.find(function (e) {
        return String(e.id) === String(id);
    });

    if (!employee) return;

    const projects = employee.projects || [];

    let projectRows = "";

    if (projects.length === 0) {

        projectRows = `
            <tr>
                <td colspan="2" class="text-center">
                    No projects assigned
                </td>
            </tr>
        `;

    } else {

        projectRows = projects.map(function (project) {

            return `
                <tr>
                    <td>${escapeHtml(project.name)}</td>
                    <td>${escapeHtml(project.status)}</td>
                </tr>
            `;

        }).join("");

    }


    document.getElementById("employeeDetailsBody").innerHTML = `

        <div class="row g-3 mb-4">

            <div class="col-sm-6">
                <div class="detail-label">Employee Name</div>
                <div class="detail-value">${escapeHtml(employee.name)}</div>
            </div>

            <div class="col-sm-6">
                <div class="detail-label">Email</div>
                <div class="detail-value">${escapeHtml(employee.email)}</div>
            </div>

            <div class="col-sm-6">
                <div class="detail-label">Mobile</div>
                <div class="detail-value">${escapeHtml(employee.mobile)}</div>
            </div>

            <div class="col-sm-6">
                <div class="detail-label">Department</div>
                <div class="detail-value">${escapeHtml(employee.department)}</div>
            </div>

            <div class="col-sm-6">
                <div class="detail-label">Joining Date</div>
                <div class="detail-value">${escapeHtml(employee.joiningDate)}</div>
            </div>

            <div class="col-sm-6">
                <div class="detail-label">Status</div>
                <div class="detail-value">${escapeHtml(employee.status)}</div>
            </div>

        </div>

        <h6>Assigned Projects (${projects.length})</h6>

        <div class="table-responsive">

            <table class="table table-bordered">

                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Project Status</th>
                    </tr>
                </thead>

                <tbody>
                    ${projectRows}
                </tbody>

            </table>

        </div>

    `;

    viewEmployeeModal.show();
}


// ADD EMPLOYEE FORM
function openAddEmployeeForm() {

    editingEmployeeId = null;

    const form = document.getElementById("employeeForm");

    form.reset();

    form.classList.remove("was-validated");

    document.getElementById("employeeFormTitle").textContent =
        "Add Employee";

    document.getElementById("saveEmployeeBtn").textContent =
        "Add Employee";

    employeeFormModal.show();
}


// EDIT EMPLOYEE FORM
function openEditEmployeeForm(id) {

    const employee = employees.find(function (e) {
        return String(e.id) === String(id);
    });

    if (!employee) return;

    editingEmployeeId = employee.id;

    const form = document.getElementById("employeeForm");

    form.reset();

    form.classList.remove("was-validated");


    document.getElementById("employeeFormTitle").textContent =
        "Edit Employee";

    document.getElementById("saveEmployeeBtn").textContent =
        "Update Employee";


    document.getElementById("employeeName").value = employee.name;

    document.getElementById("employeeEmail").value = employee.email;

    document.getElementById("employeeMobile").value = employee.mobile;

    document.getElementById("employeeDepartment").value =
        employee.department;

    document.getElementById("employeeJoiningDate").value =
        employee.joiningDate;

    document.getElementById("employeeStatus").value =
        employee.status;


    employeeFormModal.show();
}


// ADD AND EDIT FORM SUBMIT
document.getElementById("employeeForm").addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const form = this;

        form.classList.add("was-validated");

        if (!form.checkValidity()) {
            return;
        }


        // Form data collect karna
        const employeeData = {

            name: document.getElementById("employeeName").value.trim(),

            email: document.getElementById("employeeEmail").value.trim(),

            mobile: document.getElementById("employeeMobile").value.trim(),

            department: document.getElementById("employeeDepartment").value,

            joiningDate: document.getElementById("employeeJoiningDate").value,

            status: document.getElementById("employeeStatus").value

        };


        // Duplicate email check
        const duplicateEmail = employees.some(function (employee) {

            return employee.email.toLowerCase() ===
                employeeData.email.toLowerCase() &&
                String(employee.id) !== String(editingEmployeeId);

        });


        if (duplicateEmail) {

            const emailInput = document.getElementById("employeeEmail");

            emailInput.setCustomValidity("Email already exists");

            emailInput.reportValidity();

            emailInput.setCustomValidity("");

            return;
        }


        const saveButton = document.getElementById("saveEmployeeBtn");

        saveButton.disabled = true;


        try {

            // EDIT EMPLOYEE
            if (editingEmployeeId !== null) {

                const existingEmployee = employees.find(function (e) {

                    return String(e.id) === String(editingEmployeeId);

                });

                await updateEmployee(editingEmployeeId, employeeData);

                Object.assign(existingEmployee, employeeData);

            }

            // ADD EMPLOYEE
            else {

                const apiResult = await createEmployee(employeeData);

                employees.unshift({

                    id: apiResult.id || Date.now(),

                    ...employeeData,

                    projects: []

                });

            }


            employeeFormModal.hide();

            form.reset();

            form.classList.remove("was-validated");

            currentPage = 1;

            renderDashboard();

        } catch (error) {

            alert(error.message || "Unable to save employee.");

        } finally {

            saveButton.disabled = false;

        }

    }
);


// DELETE EMPLOYEE
async function removeEmployee(id) {

    const employee = employees.find(function (e) {

        return String(e.id) === String(id);

    });

    if (!employee) return;


    const confirmation = confirm(
        `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmation) return;


    try {

        await deleteEmployee(id);

        employees = employees.filter(function (e) {

            return String(e.id) !== String(id);

        });

        renderDashboard();

    } catch (error) {

        alert(error.message || "Unable to delete employee.");

    }
}


// TABLE BUTTON EVENTS
document.getElementById("employeeTableBody").addEventListener(
    "click",
    function (event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const id = button.dataset.id;

        const action = button.dataset.action;


        if (action === "view") {

            viewEmployee(id);

        }

        else if (action === "edit") {

            openEditEmployeeForm(id);

        }

        else if (action === "delete") {

            removeEmployee(id);

        }

    }
);


// ADD BUTTON
document.getElementById("addEmployeeBtn").addEventListener(
    "click",
    openAddEmployeeForm
);


// REFRESH AND RETRY BUTTONS
document.getElementById("refreshBtn").addEventListener(
    "click",
    loadEmployees
);

document.getElementById("retryBtn").addEventListener(
    "click",
    loadEmployees
);


// SEARCH AND FILTER EVENTS
document.getElementById("searchInput").addEventListener(
    "input",
    resetPageAndRender
);

document.getElementById("departmentFilter").addEventListener(
    "change",
    resetPageAndRender
);

document.getElementById("statusFilter").addEventListener(
    "change",
    resetPageAndRender
);

document.getElementById("projectStatusFilter").addEventListener(
    "change",
    resetPageAndRender
);

document.getElementById("sortFilter").addEventListener(
    "change",
    resetPageAndRender
);


// PAGE SIZE
document.getElementById("pageSize").addEventListener(
    "change",
    function () {

        employeesPerPage = Number(this.value);

        currentPage = 1;

        renderDashboard();

    }
);


// PREVIOUS BUTTON
document.getElementById("previousBtn").addEventListener(
    "click",
    function () {

        if (currentPage > 1) {

            currentPage--;

            renderDashboard();

        }

    }
);


// NEXT BUTTON
document.getElementById("nextBtn").addEventListener(
    "click",
    function () {

        const totalPages = Math.ceil(
            getFilteredEmployees().length / employeesPerPage
        );

        if (currentPage < totalPages) {

            currentPage++;

            renderDashboard();

        }

    }
);


// START DASHBOARD
loadEmployees();