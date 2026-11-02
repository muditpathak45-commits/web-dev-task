const API_BASE_URL = 'https://dummyjson.com';
const PAGE_SIZE = 10;
const employees = [];
const state = {
    currentPage: 1,
    editingId: null,
    deletingId: null,
    isLoading: false,
};

const defaultEmployees = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john@gmail.com',
        mobile: '9876543210',
        department: 'Engineering',
        joiningDate: '2026-01-12',
        status: 'Active',
        projects: [
            { name: 'Project A', status: 'Active' },
            { name: 'Project B', status: 'Completed' },
            { name: 'Project C', status: 'Active' }
        ]
    },
    {
        id: 2,
        name: 'David Lee',
        email: 'david@gmail.com',
        mobile: '9876543211',
        department: 'Finance',
        joiningDate: '2025-06-08',
        status: 'Active',
        projects: [
            { name: 'Project D', status: 'Completed' },
            { name: 'Project E', status: 'In Progress' },
            { name: 'Project F', status: 'Active' }
        ]
    },
    {
        id: 3,
        name: 'Sarah Khan',
        email: 'sarah@gmail.com',
        mobile: '9876543212',
        department: 'HR',
        joiningDate: '2024-09-18',
        status: 'Inactive',
        projects: [
            { name: 'Project G', status: 'Completed' },
            { name: 'Project H', status: 'Completed' }
        ]
    },
    {
        id: 4,
        name: 'Priya Sharma',
        email: 'priya@gmail.com',
        mobile: '9876543213',
        department: 'Engineering',
        joiningDate: '2025-03-01',
        status: 'Active',
        projects: [
            { name: 'Project I', status: 'In Progress' },
            { name: 'Project J', status: 'Active' }
        ]
    },
    {
        id: 5,
        name: 'Nikhil Roy',
        email: 'nikhil@gmail.com',
        mobile: '9876543214',
        department: 'Marketing',
        joiningDate: '2024-11-10',
        status: 'Active',
        projects: [
            { name: 'Project K', status: 'Completed' }
        ]
    },
    {
        id: 6,
        name: 'Aisha Ali',
        email: 'aisha@gmail.com',
        mobile: '9876543215',
        department: 'Operations',
        joiningDate: '2022-01-22',
        status: 'Inactive',
        projects: []
    },
    {
        id: 7,
        name: 'Rohit Verma',
        email: 'rohit@gmail.com',
        mobile: '9876543216',
        department: 'Engineering',
        joiningDate: '2023-08-14',
        status: 'Active',
        projects: [
            { name: 'Project L', status: 'Active' },
            { name: 'Project M', status: 'Active' },
            { name: 'Project N', status: 'In Progress' }
        ]
    },
    {
        id: 8,
        name: 'Meera Singh',
        email: 'meera@gmail.com',
        mobile: '9876543217',
        department: 'Finance',
        joiningDate: '2025-02-04',
        status: 'Active',
        projects: [
            { name: 'Project O', status: 'Completed' },
            { name: 'Project P', status: 'Completed' },
            { name: 'Project Q', status: 'Completed' },
            { name: 'Project R', status: 'Active' }
        ]
    },
    {
        id: 9,
        name: 'Arjun Patel',
        email: 'arjun@gmail.com',
        mobile: '9876543218',
        department: 'HR',
        joiningDate: '2024-05-13',
        status: 'Inactive',
        projects: [
            { name: 'Project S', status: 'Completed' }
        ]
    },
    {
        id: 10,
        name: 'Laura Gomez',
        email: 'laura@gmail.com',
        mobile: '9876543219',
        department: 'Marketing',
        joiningDate: '2021-12-16',
        status: 'Active',
        projects: [
            { name: 'Project T', status: 'Active' },
            { name: 'Project U', status: 'Completed' }
        ]
    },
    {
        id: 11,
        name: 'Karan Malhotra',
        email: 'karan@gmail.com',
        mobile: '9876543220',
        department: 'Operations',
        joiningDate: '2024-07-25',
        status: 'Active',
        projects: [
            { name: 'Project V', status: 'In Progress' },
            { name: 'Project W', status: 'Active' },
            { name: 'Project X', status: 'Completed' }
        ]
    },
    {
        id: 12,
        name: 'Neha Rao',
        email: 'neha@gmail.com',
        mobile: '9876543221',
        department: 'Engineering',
        joiningDate: '2023-01-08',
        status: 'Inactive',
        projects: []
    }
];

const elements = {
    totalEmployees: document.getElementById('totalEmployees'),
    activeEmployees: document.getElementById('activeEmployees'),
    activeProjects: document.getElementById('activeProjects'),
    unassignedEmployees: document.getElementById('unassignedEmployees'),
    searchInput: document.getElementById('searchInput'),
    departmentFilter: document.getElementById('departmentFilter'),
    statusFilter: document.getElementById('statusFilter'),
    projectStatusFilter: document.getElementById('projectStatusFilter'),
    sortFilter: document.getElementById('sortFilter'),
    employeeTableBody: document.getElementById('employeeTableBody'),
    pagination: document.getElementById('pagination'),
    paginationInfo: document.getElementById('paginationInfo'),
    alertBox: document.getElementById('alertBox'),
    detailModal: document.getElementById('detailModal'),
    detailModalBody: document.getElementById('detailModalBody'),
    employeeFormModal: document.getElementById('employeeFormModal'),
    employeeForm: document.getElementById('employeeForm'),
    employeeFormTitle: document.getElementById('employeeFormTitle'),
    formError: document.getElementById('formError'),
    addEmployeeBtn: document.getElementById('addEmployeeBtn'),
    deleteModal: document.getElementById('deleteModal'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
    employeeName: document.getElementById('employeeName'),
    employeeEmail: document.getElementById('employeeEmail'),
    employeeMobile: document.getElementById('employeeMobile'),
    employeeDepartment: document.getElementById('employeeDepartment'),
    employeeJoiningDate: document.getElementById('employeeJoiningDate'),
    employeeStatus: document.getElementById('employeeStatus'),
};

function normalizeValue(value) {
    return String(value || '').trim().toLowerCase();
}

function formatDisplayDate(dateValue) {
    if (!dateValue) return 'N/A';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);
}

function formatProjectSummary(employee) {
    if (!employee.projects || !employee.projects.length) return '0';
    return String(employee.projects.length);
}

function getProjectStatusMatches(employee, projectStatus) {
    if (projectStatus === 'All') return true;

    if (!Array.isArray(employee.projects) || !employee.projects.length) {
        return false;
    }

    return employee.projects.some(function (project) {
        return normalizeValue(project.status) === normalizeValue(projectStatus);
    });
}

function showAlert(message, type, isRetryable) {
    const box = elements.alertBox;
    box.className = `alert ${type === 'success' ? 'alert-success' : type === 'error' ? 'alert-danger' : 'alert-warning'} ${message ? '' : 'd-none'}`;

    if (!message) {
        box.textContent = '';
        box.classList.add('d-none');
        return;
    }

    const retryButtonMarkup = isRetryable
        ? '<button type="button" id="retryLoadBtn" class="btn btn-sm btn-outline-light ms-3">Retry</button>'
        : '';

    box.innerHTML = `${message}${retryButtonMarkup}`;
    box.classList.remove('d-none');

    if (isRetryable) {
        const retryBtn = document.getElementById('retryLoadBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', function () {
                loadEmployees();
            });
        }
    }
}

function getDefaultProjectList(seed) {
    const projectNames = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta'];
    return projectNames.map(function (name, index) {
        return {
            name: name,
            status: index % 2 === 0 ? 'Active' : 'Completed'
        };
    }).map(function (project, index) {
        return {
            name: project.name + ' ' + (seed % 10 + index + 1),
            status: project.status
        };
    });
}

function mapApiUserToEmployee(user) {
    const fullName = user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Employee';
    const department = user.department || user.company?.department || ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations'][(user.id || 1) % 5];
    const rawProjects = Array.isArray(user.projects) && user.projects.length
        ? user.projects
        : getDefaultProjectList(user.id || 1);

    return {
        id: user.id || Date.now() + Math.random(),
        name: fullName,
        email: user.email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        mobile: user.phone || user.mobile || '0000000000',
        department: department,
        joiningDate: user.joiningDate || user.createdAt || '2025-01-01',
        status: user.status || ((user.id || 1) % 2 === 0 ? 'Active' : 'Inactive'),
        projects: rawProjects.map(function (project, index) {
            return {
                name: project.name || `Project ${index + 1}`,
                status: project.status || (index % 2 === 0 ? 'Active' : 'Completed')
            };
        })
    };
}

async function getEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/users?limit=50`);
        if (!response.ok) throw new Error('Failed to fetch users');

        const payload = await response.json();
        const users = Array.isArray(payload.users) ? payload.users : Array.isArray(payload) ? payload : [];

        if (!users.length) {
            throw new Error('No employee data returned');
        }

        return users.map(mapApiUserToEmployee);
    } catch (error) {
        console.warn('Using fallback employee data', error);
        return defaultEmployees.map(function (employee) {
            return {
                ...employee,
                projects: employee.projects ? employee.projects.map(function (project) {
                    return { ...project };
                }) : []
            };
        });
    }
}

async function createEmployee(employee) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });

        if (!response.ok) {
            throw new Error('Create failed');
        }

        const created = await response.json();
        return mapApiUserToEmployee(created);
    } catch (error) {
        const fallbackId = Date.now();
        const fallback = {
            ...employee,
            id: fallbackId,
            projects: [{ name: 'New Project', status: 'Active' }],
            status: employee.status || 'Active'
        };
        employees.unshift(fallback);
        return fallback;
    }
}

async function updateEmployee(id, employee) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });

        if (!response.ok) {
            throw new Error('Update failed');
        }

        const updated = await response.json();
        return mapApiUserToEmployee(updated);
    } catch (error) {
        const index = employees.findIndex(function (item) {
            return item.id === id;
        });

        if (index !== -1) {
            employees[index] = {
                ...employees[index],
                ...employee,
                projects: employees[index].projects || [{ name: 'Updated Project', status: 'Active' }]
            };
            return employees[index];
        }

        return employee;
    }
}

async function deleteEmployee(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Delete failed');
        }

        return true;
    } catch (error) {
        return true;
    }
}

function getFilteredEmployees() {
    const searchValue = normalizeValue(elements.searchInput.value);
    const departmentValue = elements.departmentFilter.value;
    const statusValue = elements.statusFilter.value;
    const projectStatusValue = elements.projectStatusFilter.value;
    const sortValue = elements.sortFilter.value;

    let filtered = employees.filter(function (employee) {
        const matchSearch = !searchValue ||
            normalizeValue(employee.name).includes(searchValue) ||
            normalizeValue(employee.email).includes(searchValue);

        const matchDepartment = departmentValue === 'All' || normalizeValue(employee.department) === normalizeValue(departmentValue);
        const matchStatus = statusValue === 'All' || normalizeValue(employee.status) === normalizeValue(statusValue);
        const matchProjectStatus = getProjectStatusMatches(employee, projectStatusValue);

        return matchSearch && matchDepartment && matchStatus && matchProjectStatus;
    });

    if (sortValue && sortValue !== 'none') {
        filtered = [...filtered].sort(function (a, b) {
            switch (sortValue) {
                case 'nameAsc':
                    return a.name.localeCompare(b.name);
                case 'nameDesc':
                    return b.name.localeCompare(a.name);
                case 'projectsAsc':
                    return (a.projects || []).length - (b.projects || []).length;
                case 'projectsDesc':
                    return (b.projects || []).length - (a.projects || []).length;
                case 'joiningAsc':
                    return new Date(a.joiningDate) - new Date(b.joiningDate);
                case 'joiningDesc':
                    return new Date(b.joiningDate) - new Date(a.joiningDate);
                case 'statusAsc':
                    return normalizeValue(a.status).localeCompare(normalizeValue(b.status));
                case 'statusDesc':
                    return normalizeValue(b.status).localeCompare(normalizeValue(a.status));
                default:
                    return 0;
            }
        });
    }

    return filtered;
}

function updateDashboardStats() {
    elements.totalEmployees.textContent = employees.length;
    elements.activeEmployees.textContent = employees.filter(function (employee) {
        return normalizeValue(employee.status) === 'active';
    }).length;

    elements.activeProjects.textContent = employees.reduce(function (total, employee) {
        const projectList = Array.isArray(employee.projects) ? employee.projects : [];
        return total + projectList.filter(function (project) {
            return normalizeValue(project.status) === 'active';
        }).length;
    }, 0);

    elements.unassignedEmployees.textContent = employees.filter(function (employee) {
        return !employee.projects || employee.projects.length === 0;
    }).length;
}

function renderPagination(filteredEmployees) {
    const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
    state.currentPage = Math.min(state.currentPage, totalPages);

    elements.pagination.innerHTML = '';

    const previousItem = document.createElement('li');
    previousItem.className = `page-item ${state.currentPage === 1 ? 'disabled' : ''}`;
    previousItem.innerHTML = '<button class="page-link" type="button" aria-label="Previous" ' + (state.currentPage === 1 ? 'disabled' : '') + '>Previous</button>';
    previousItem.querySelector('button').addEventListener('click', function () {
        if (state.currentPage > 1) {
            state.currentPage -= 1;
            renderDashboard();
        }
    });
    elements.pagination.appendChild(previousItem);

    for (let page = 1; page <= totalPages; page += 1) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${page === state.currentPage ? 'active' : ''}`;
        pageItem.innerHTML = '<button class="page-link" type="button" aria-label="Page ' + page + '">' + page + '</button>';
        pageItem.querySelector('button').addEventListener('click', function () {
            state.currentPage = page;
            renderDashboard();
        });
        elements.pagination.appendChild(pageItem);
    }

    const nextItem = document.createElement('li');
    nextItem.className = `page-item ${state.currentPage === totalPages ? 'disabled' : ''}`;
    nextItem.innerHTML = '<button class="page-link" type="button" aria-label="Next" ' + (state.currentPage === totalPages ? 'disabled' : '') + '>Next</button>';
    nextItem.querySelector('button').addEventListener('click', function () {
        if (state.currentPage < totalPages) {
            state.currentPage += 1;
            renderDashboard();
        }
    });
    elements.pagination.appendChild(nextItem);

    const totalCount = filteredEmployees.length;
    if (!totalCount) {
        elements.paginationInfo.textContent = 'No employees found';
        return;
    }

    const startItem = (state.currentPage - 1) * PAGE_SIZE + 1;
    const endItem = Math.min(state.currentPage * PAGE_SIZE, totalCount);
    elements.paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${totalCount}`;
}

function renderTable(filteredEmployees) {
    const tableBody = elements.employeeTableBody;
    tableBody.innerHTML = '';

    if (!filteredEmployees.length) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No employees match your filters.</td></tr>';
        return;
    }

    const startIndex = (state.currentPage - 1) * PAGE_SIZE;
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + PAGE_SIZE);

    paginatedEmployees.forEach(function (employee) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${employee.name}</strong></td>
            <td>${employee.email}</td>
            <td>${employee.department}</td>
            <td>${formatProjectSummary(employee)}</td>
            <td><span class="badge ${employee.status === 'Active' ? 'active-badge' : 'inactive-badge'}">${employee.status}</span></td>
            <td>
                <button type="button" class="btn btn-sm me-1 view-btn" data-action="view" data-id="${employee.id}">View</button>
                <button type="button" class="btn btn-sm me-1 edit-btn" data-action="edit" data-id="${employee.id}">Edit</button>
                <button type="button" class="btn btn-sm delete-btn" data-action="delete" data-id="${employee.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderDashboard() {
    updateDashboardStats();

    const filteredEmployees = getFilteredEmployees();
    if (!filteredEmployees.length) {
        state.currentPage = 1;
    }

    renderTable(filteredEmployees);
    renderPagination(filteredEmployees);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    const openedModals = document.querySelectorAll('.modal.show');
    document.body.classList.toggle('modal-open', openedModals.length > 0);
}

function showEmployeeDetails(employeeId) {
    const employee = employees.find(function (item) {
        return item.id === employeeId;
    });

    if (!employee) return;

    const projectRows = employee.projects && employee.projects.length
        ? employee.projects.map(function (project) {
            return `
                <div class="project-row d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span>${project.name}</span>
                    <span class="badge ${project.status === 'Active' ? 'active-badge' : 'inactive-badge'}">${project.status}</span>
                </div>
            `;
        }).join('')
        : '<p class="text-muted mb-0">No projects assigned.</p>';

    elements.detailModalBody.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6"><strong>Name:</strong><div>${employee.name}</div></div>
            <div class="col-md-6"><strong>Email:</strong><div>${employee.email}</div></div>
            <div class="col-md-6"><strong>Department:</strong><div>${employee.department}</div></div>
            <div class="col-md-6"><strong>Joining Date:</strong><div>${formatDisplayDate(employee.joiningDate)}</div></div>
            <div class="col-md-6"><strong>Status:</strong><div><span class="badge ${employee.status === 'Active' ? 'active-badge' : 'inactive-badge'}">${employee.status}</span></div></div>
            <div class="col-md-6"><strong>Mobile:</strong><div>${employee.mobile}</div></div>
        </div>
        <div class="mt-4">
            <h6 class="mb-3">Projects</h6>
            ${projectRows}
        </div>
    `;

    openModal('detailModal');
}

function resetEmployeeForm() {
    elements.employeeForm.reset();
    state.editingId = null;
    elements.employeeFormTitle.textContent = 'Add Employee';
    elements.formError.classList.add('d-none');
    elements.formError.textContent = '';
}

function populateFormForEdit(employeeId) {
    const employee = employees.find(function (item) {
        return item.id === employeeId;
    });

    if (!employee) return;

    state.editingId = employee.id;
    elements.employeeFormTitle.textContent = 'Edit Employee';
    elements.employeeName.value = employee.name;
    elements.employeeEmail.value = employee.email;
    elements.employeeMobile.value = employee.mobile;
    elements.employeeDepartment.value = employee.department;
    elements.employeeJoiningDate.value = employee.joiningDate;
    elements.employeeStatus.value = employee.status;
    elements.formError.classList.add('d-none');
    elements.formError.textContent = '';
    openModal('employeeFormModal');
}

function getEmployeeFormValues() {
    return {
        name: elements.employeeName.value.trim(),
        email: elements.employeeEmail.value.trim(),
        mobile: elements.employeeMobile.value.trim(),
        department: elements.employeeDepartment.value,
        joiningDate: elements.employeeJoiningDate.value,
        status: elements.employeeStatus.value
    };
}

function validateEmployeeForm(values) {
    if (!values.name) return 'Name is required.';
    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return 'Please enter a valid email.';
    if (!values.mobile || values.mobile.replace(/\D/g, '').length < 10) return 'Mobile number must contain at least 10 digits.';
    if (!values.department) return 'Please select a department.';
    if (!values.joiningDate) return 'Joining date is required.';
    if (!values.status) return 'Please select a status.';
    return '';
}

async function handleEmployeeSubmit(event) {
    event.preventDefault();
    const values = getEmployeeFormValues();
    const error = validateEmployeeForm(values);

    if (error) {
        elements.formError.textContent = error;
        elements.formError.classList.remove('d-none');
        return;
    }

    const payload = {
        ...values,
        mobile: values.mobile.replace(/\D/g, '')
    };

    try {
        let savedEmployee;

        if (state.editingId !== null) {
            const existing = employees.find(function (employee) {
                return employee.id === state.editingId;
            });

            savedEmployee = await updateEmployee(state.editingId, {
                ...existing,
                ...payload,
                projects: existing ? existing.projects : [{ name: 'Updated Project', status: 'Active' }]
            });
        } else {
            savedEmployee = await createEmployee(payload);
        }

        const index = employees.findIndex(function (employee) {
            return employee.id === savedEmployee.id;
        });

        if (state.editingId !== null && index !== -1) {
            employees[index] = savedEmployee;
        } else if (index === -1) {
            employees.unshift(savedEmployee);
        }

        resetEmployeeForm();
        closeModal('employeeFormModal');
        renderDashboard();
        showAlert('Employee saved successfully.', 'success', false);
    } catch (error) {
        elements.formError.textContent = 'Unable to save employee. Please try again.';
        elements.formError.classList.remove('d-none');
    }
}

function confirmDeleteEmployee(employeeId) {
    state.deletingId = employeeId;
    openModal('deleteModal');
}

async function handleDeleteConfirmation() {
    if (state.deletingId === null) return;

    try {
        await deleteEmployee(state.deletingId);
        const index = employees.findIndex(function (employee) {
            return employee.id === state.deletingId;
        });

        if (index !== -1) {
            employees.splice(index, 1);
        }

        state.deletingId = null;
        closeModal('deleteModal');
        renderDashboard();
        showAlert('Employee deleted successfully.', 'success', false);
    } catch (error) {
        showAlert('Unable to delete employee. Please try again.', 'error', false);
    }
}

async function loadEmployees() {
    state.isLoading = true;
    showAlert('Loading employees...', 'warning', false);

    try {
        const loadedEmployees = await getEmployees();
        employees.splice(0, employees.length, ...loadedEmployees);
        state.currentPage = 1;
        renderDashboard();
        showAlert('', 'success', false);
    } catch (error) {
        showAlert('Unable to load employees. Please try again.', 'error', true);
    } finally {
        state.isLoading = false;
    }
}

function bindEvents() {
    elements.searchInput.addEventListener('input', function () {
        state.currentPage = 1;
        renderDashboard();
    });

    elements.departmentFilter.addEventListener('change', function () {
        state.currentPage = 1;
        renderDashboard();
    });

    elements.statusFilter.addEventListener('change', function () {
        state.currentPage = 1;
        renderDashboard();
    });

    elements.projectStatusFilter.addEventListener('change', function () {
        state.currentPage = 1;
        renderDashboard();
    });

    elements.sortFilter.addEventListener('change', function () {
        state.currentPage = 1;
        renderDashboard();
    });

    elements.addEmployeeBtn.addEventListener('click', function () {
        resetEmployeeForm();
        openModal('employeeFormModal');
    });

    elements.employeeForm.addEventListener('submit', handleEmployeeSubmit);
    elements.confirmDeleteBtn.addEventListener('click', handleDeleteConfirmation);

    document.body.addEventListener('click', function (event) {
        const actionTarget = event.target.closest('[data-action]');
        if (actionTarget) {
            const action = actionTarget.getAttribute('data-action');
            const employeeId = Number(actionTarget.getAttribute('data-id'));

            if (action === 'view') {
                showEmployeeDetails(employeeId);
            }

            if (action === 'edit') {
                populateFormForEdit(employeeId);
            }

            if (action === 'delete') {
                confirmDeleteEmployee(employeeId);
            }
        }

        const closeTrigger = event.target.closest('[data-close]');
        if (closeTrigger) {
            const modalId = closeTrigger.getAttribute('data-close');
            closeModal(modalId);
        }
    });
}

function initializeDefaults() {
    elements.departmentFilter.value = 'All';
    elements.statusFilter.value = 'All';
    elements.projectStatusFilter.value = 'All';
    elements.sortFilter.value = 'nameAsc';
}

function init() {
    initializeDefaults();
    bindEvents();
    loadEmployees();
}

init();