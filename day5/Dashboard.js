const employees = [
    {
        id: 1,
        name: "Mudit Pathak",
        email: "mudit@23gmail.com",
        mobile: "2344566543",
        department: "Engineering",
        joiningDate: "2026-01-12",
        status: "Active",
        projects: [
            { name: "Project A", status: "Active" },
            { name: "Project B", status: "completed" },
            { name: "Project C", status: "Active" }
        ]
    },
    {
        id: 2,
        name: "Vrinda",
        email: "vrinda@gmail.com",
        mobile: "9876543211",
        department: "Finance",
        joiningDate: "2026-02-15",
        status: "Active",
        projects: [
            { name: "Project D", status: "Active" },
            { name: "Project E", status: "Completed" }
        ]
    },
    {
        id: 3,
        name: "Aman Sharma",
        email: "aman@gmail.com",
        mobile: "9876543212",
        department: "HR",
        joiningDate: "2026-03-20",
        status: "Inactive",
        projects: [{ name: "Project F", status: "Completed" }]
    }
];

function normalizeStatus(value) {
    return String(value || "").trim().toLowerCase();
}

function updateDashboard() {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(function (employee) {
        return normalizeStatus(employee.status) === "active";
    }).length;

    const activeProjects = employees.reduce(function (total, employee) {
        return total + employee.projects.filter(function (project) {
            return normalizeStatus(project.status) === "active";
        }).length;
    }, 0);

    const unassignedEmployees = employees.filter(function (employee) {
        return !employee.projects || employee.projects.length === 0;
    }).length;

    document.getElementById("totalEmployees").textContent = totalEmployees;
    document.getElementById("activeEmployees").textContent = activeEmployees;
    document.getElementById("activeProjects").textContent = activeProjects;
    document.getElementById("unassignedEmployees").textContent = unassignedEmployees;
}

function getProjectSummary(employee) {
    if (!employee.projects || employee.projects.length === 0) {
        return "No projects";
    }
    return employee.projects.map(function (project) {
        return project.name;
    }).join(", ");
}

function getFilteredEmployees() {
    const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
    const department = document.getElementById("departmentFilter").value;
    const status = document.getElementById("statusFilter").value;
    const projectStatus = document.getElementById("projectStatusFilter").value;
    const sortValue = document.getElementById("sortFilter").value;

    let filteredEmployees = employees.filter(function (employee) {
        const matchesSearch = !searchValue ||
            employee.name.toLowerCase().includes(searchValue) ||
            employee.email.toLowerCase().includes(searchValue);

        const matchesDepartment = department === "All" || employee.department === department;
        const matchesStatus = status === "All" || employee.status === status;
        const matchesProjectStatus = projectStatus === "All" || employee.projects.some(function (project) {
            return normalizeStatus(project.status) === normalizeStatus(projectStatus);
        });

        return matchesSearch && matchesDepartment && matchesStatus && matchesProjectStatus;
    });

    if (sortValue !== "none") {
        filteredEmployees = [...filteredEmployees].sort(function (a, b) {
            switch (sortValue) {
                case "nameAsc":
                    return a.name.localeCompare(b.name);
                case "nameDesc":
                    return b.name.localeCompare(a.name);
                case "projectsAsc":
                    return a.projects.length - b.projects.length;
                case "projectsDesc":
                    return b.projects.length - a.projects.length;
                case "joiningAsc":
                    return new Date(a.joiningDate) - new Date(b.joiningDate);
                case "joiningDesc":
                    return new Date(b.joiningDate) - new Date(a.joiningDate);
                case "statusAsc":
                    return a.status.localeCompare(b.status);
                case "statusDesc":
                    return b.status.localeCompare(a.status);
                default:
                    return 0;
            }
        });
    }

    return filteredEmployees;
}

function displayEmployees(employeeList) {
    const tableBody = document.getElementById("employeeTableBody");
    tableBody.innerHTML = "";

    if (!employeeList.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">No employees match your filters.</td>
            </tr>
        `;
        return;
    }

    employeeList.forEach(function (employee) {
        const row = `
            <tr>
                <td><strong>${employee.name}</strong></td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${getProjectSummary(employee)}</td>
                <td>
                    <span class="badge ${employee.status === "Active" ? "bg-success" : "bg-secondary"}">${employee.status}</span>
                </td>
                <td>
                    <button class="btn btn-primary btn-sm me-1" type="button">View</button>
                    <button class="btn btn-warning btn-sm me-1" type="button">Edit</button>
                    <button class="btn btn-danger btn-sm" type="button">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function renderDashboard() {
    updateDashboard();
    displayEmployees(getFilteredEmployees());
}

document.getElementById("searchInput").addEventListener("input", renderDashboard);
document.getElementById("departmentFilter").addEventListener("change", renderDashboard);
document.getElementById("statusFilter").addEventListener("change", renderDashboard);
document.getElementById("projectStatusFilter").addEventListener("change", renderDashboard);
document.getElementById("sortFilter").addEventListener("change", renderDashboard);

renderDashboard();
