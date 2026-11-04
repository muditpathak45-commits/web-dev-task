const API_BASE_URL = 'https://dummyjson.com';
const PAGE_SIZE = 10;
const DEPARTMENTS = ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations'];
const PROJECT_STATUSES = ['Active', 'Completed', 'In Progress'];

const employees = [];
const state = {
    currentPage: 1,
    editingId: null,
    deletingId: null,
    isLoading: false,
};
let alertTimer = null;

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
    detailModalBody: document.getElementById('detailModalBody'),
    employeeForm: document.getElementById('employeeForm'),
    employeeFormTitle: document.getElementById('employeeFormTitle'),
    formError: document.getElementById('formError'),
    addEmployeeBtn: document.getElementById('addEmployeeBtn'),
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

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = String(value === undefined || value === null ? '' : value);
    return div.innerHTML;
}

function formatDisplayDate(dateValue) {
    if (!dateValue) return 'N/A';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date).replace(/ /g, '-');
}

function formatProjectSummary(employee) {
    return String(Array.isArray(employee.projects) ? employee.projects.length : 0);
}

function projectBadgeClass(status) {
    if (status === 'Active') return 'active-badge';
    if (status === 'In Progress') return 'bg-warning text-dark';
    return 'bg-secondary';
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
    clearTimeout(alertTimer);

    if (!message) {
        box.textContent = '';
        box.className = 'alert d-none';
        return;
    }

    const alertClass = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-danger' : 'alert-warning';
    box.className = 'alert ' + alertClass;

    const retryButtonMarkup = isRetryable
        ? '<button type="button" id="retryLoadBtn" class="btn btn-sm btn-outline-danger ms-3">Retry</button>'
        : '';

    box.innerHTML = escapeHtml(message) + retryButtonMarkup;

    if (isRetryable) {
        document.getElementById('retryLoadBtn').addEventListener('click', loadEmployees);
    }

    if (type === 'success') {
        alertTimer = setTimeout(function () {
            showAlert('', 'success', false);
        }, 3000);
    }
}

function buildProjectList(seed) {
    const count = seed % 7 === 0 ? 0 : (seed % 7) % 4 + 1;
    return Array.from({ length: count }, function (_, index) {
        return {
            name: 'Project ' + seed + '-' + (index + 1),
            status: PROJECT_STATUSES[(seed + index) % 3]
        };
    });
}

function buildJoiningDate(seed) {
    const year = 2021 + (seed % 5);
    const month = String((seed * 3) % 12 + 1).padStart(2, '0');
    const day = String((seed * 7) % 28 + 1).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function mapApiUserToEmployee(user) {
    const id = user.id || Date.now();
    const fullName = user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Employee';

    return {
        id: id,
        name: fullName,
        email: user.email || fullName.toLowerCase().replace(/\s+/g, '.') + '@example.com',
        mobile: user.mobile || user.phone || '0000000000',
        department: DEPARTMENTS.includes(user.department) ? user.department : DEPARTMENTS[id % 5],
        joiningDate: user.joiningDate || buildJoiningDate(id),
        status: user.status || (id % 2 === 0 ? 'Active' : 'Inactive'),
        projects: Array.isArray(user.projects) ? user.projects : buildProjectList(id)
    };
}

async function apiRequest(path, options) {
    const response = await fetch(API_BASE_URL + path, options);
    if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
    }
    return response.json();
}

async function getEmployees() {
    const payload = await apiRequest('/users?limit=50');
    const users = Array.isArray(payload.users) ? payload.users : [];

    if (!users.length) {
        throw new Error('No employee data returned');
    }

    return users.map(mapApiUserToEmployee);
}

async function getEmployeeById(id) {
    const localEmployee = employees.find(function (item) {
        return item.id === id;
    });

    if (!localEmployee) return null;
    if (localEmployee.local) return localEmployee;

    const fresh = mapApiUserToEmployee(await apiRequest('/users/' + id));
    return { ...fresh, ...localEmployee };
}

async function createEmployee(values) {
    await apiRequest('/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
    });

    return { ...values, id: Date.now(), projects: [], local: true };
}

async function updateEmployee(id, values) {
    const existing = employees.find(function (item) {
        return item.id === id;
    });
    if (!existing) throw new Error('Employee not found');

    if (!existing.local) {
        await apiRequest('/users/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });
    }

    return { ...existing, ...values };
}

async function deleteEmployee(id) {
    const existing = employees.find(function (item) {
        return item.id === id;
    });

    if (existing && !existing.local) {
        await apiRequest('/users/' + id, { method: 'DELETE' });
    }

    return true;
}

function getFilteredEmployees() {
    const searchValue = normalizeValue(elements.searchInput.value);
    const departmentValue = elements.departmentFilter.value;
    const statusValue = elements.statusFilter.value;
    const projectStatusValue = elements.projectStatusFilter.value;
    const sortValue = elements.sortFilter.value;

    const filtered = employees.filter(function (employee) {
        const matchSearch = !searchValue ||
            normalizeValue(employee.name).includes(searchValue) ||
            normalizeValue(employee.email).includes(searchValue);

        const matchDepartment = departmentValue === 'All' || normalizeValue(employee.department) === normalizeValue(departmentValue);
        const matchStatus = statusValue === 'All' || normalizeValue(employee.status) === normalizeValue(statusValue);
        const matchProjectStatus = getProjectStatusMatches(employee, projectStatusValue);

        return matchSearch && matchDepartment && matchStatus && matchProjectStatus;
    });

    return filtered.sort(function (a, b) {
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

    elements.pagination.innerHTML = '';

    const previousItem = document.createElement('li');
    previousItem.className = 'page-item ' + (state.currentPage === 1 ? 'disabled' : '');
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
        pageItem.className = 'page-item ' + (page === state.currentPage ? 'active' : '');
        pageItem.innerHTML = '<button class="page-link" type="button" aria-label="Page ' + page + '">' + page + '</button>';
        pageItem.querySelector('button').addEventListener('click', function () {
            state.currentPage = page;
            renderDashboard();
        });
        elements.pagination.appendChild(pageItem);
    }

    const nextItem = document.createElement('li');
    nextItem.className = 'page-item ' + (state.currentPage === totalPages ? 'disabled' : '');
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
    elements.paginationInfo.textContent = 'Showing ' + startItem + '-' + endItem + ' of ' + totalCount;
}

function renderTable(filteredEmployees) {
    const tableBody = elements.employeeTableBody;
    tableBody.innerHTML = '';

    if (!filteredEmployees.length) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No employees found.</td></tr>';
        return;
    }

    const startIndex = (state.currentPage - 1) * PAGE_SIZE;
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + PAGE_SIZE);

    paginatedEmployees.forEach(function (employee) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${escapeHtml(employee.name)}</strong></td>
            <td>${escapeHtml(employee.email)}</td>
            <td>${escapeHtml(employee.department)}</td>
            <td>${formatProjectSummary(employee)}</td>
            <td><span class="badge ${employee.status === 'Active' ? 'active-badge' : 'inactive-badge'}">${escapeHtml(employee.status)}</span></td>
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

    const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
    state.currentPage = Math.min(Math.max(state.currentPage, 1), totalPages);

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

async function showEmployeeDetails(employeeId) {
    let employee;

    try {
        employee = await getEmployeeById(employeeId);
    } catch (error) {
        showAlert('Unable to load employee details. Please try again.', 'error', false);
        return;
    }

    if (!employee) return;

    const projectRows = employee.projects && employee.projects.length
        ? employee.projects.map(function (project) {
            return `
                <div class="project-row d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span>${escapeHtml(project.name)}</span>
                    <span class="badge ${projectBadgeClass(project.status)}">${escapeHtml(project.status)}</span>
                </div>
            `;
        }).join('')
        : '<p class="text-muted mb-0">No projects assigned.</p>';

    elements.detailModalBody.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6"><strong>Name:</strong><div>${escapeHtml(employee.name)}</div></div>
            <div class="col-md-6"><strong>Email:</strong><div>${escapeHtml(employee.email)}</div></div>
            <div class="col-md-6"><strong>Department:</strong><div>${escapeHtml(employee.department)}</div></div>
            <div class="col-md-6"><strong>Joining Date:</strong><div>${formatDisplayDate(employee.joiningDate)}</div></div>
            <div class="col-md-6"><strong>Status:</strong><div><span class="badge ${employee.status === 'Active' ? 'active-badge' : 'inactive-badge'}">${escapeHtml(employee.status)}</span></div></div>
            <div class="col-md-6"><strong>Mobile:</strong><div>${escapeHtml(employee.mobile)}</div></div>
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
    if (values.name.length < 2) return 'Name must be at least 2 characters.';
    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return 'Please enter a valid email.';

    const emailTaken = employees.some(function (employee) {
        return normalizeValue(employee.email) === normalizeValue(values.email) && employee.id !== state.editingId;
    });
    if (emailTaken) return 'This email is already used by another employee.';

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

    const submitButton = elements.employeeForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        if (state.editingId !== null) {
            const updated = await updateEmployee(state.editingId, payload);
            const index = employees.findIndex(function (employee) {
                return employee.id === state.editingId;
            });
            if (index !== -1) employees[index] = updated;
        } else {
            const created = await createEmployee(payload);
            employees.unshift(created);
        }

        resetEmployeeForm();
        closeModal('employeeFormModal');
        renderDashboard();
        showAlert('Employee saved successfully.', 'success', false);
    } catch (saveError) {
        elements.formError.textContent = 'Unable to save employee. Please try again.';
        elements.formError.classList.remove('d-none');
    } finally {
        submitButton.disabled = false;
    }
}

function confirmDeleteEmployee(employeeId) {
    state.deletingId = employeeId;
    openModal('deleteModal');
}

async function handleDeleteConfirmation() {
    if (state.deletingId === null) return;

    const idToDelete = state.deletingId;

    try {
        await deleteEmployee(idToDelete);

        const index = employees.findIndex(function (employee) {
            return employee.id === idToDelete;
        });
        if (index !== -1) {
            employees.splice(index, 1);
        }

        state.deletingId = null;
        closeModal('deleteModal');
        renderDashboard(); 
        showAlert('Employee deleted successfully.', 'success', false);
    } catch (error) {
        state.deletingId = null;
        closeModal('deleteModal');
        showAlert('Unable to delete employee. Please try again.', 'error', false);
    }
}

function showLoadingState() {
    showAlert('', 'warning', false);
    elements.employeeTableBody.innerHTML =
        '<tr><td colspan="6" class="text-center text-muted py-4">' +
        '<div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>' +
        'Loading employees...</td></tr>';
    elements.pagination.innerHTML = '';
    elements.paginationInfo.textContent = '';
}

function showErrorState() {
    employees.splice(0, employees.length);
    updateDashboardStats();
    elements.employeeTableBody.innerHTML =
        '<tr><td colspan="6" class="text-center text-danger py-4">Unable to load employees.</td></tr>';
    elements.pagination.innerHTML = '';
    elements.paginationInfo.textContent = '';
    showAlert('Unable to load employees.', 'error', true);
}

async function loadEmployees() {
    state.isLoading = true;
    showLoadingState();

    try {
        const loadedEmployees = await getEmployees();
        employees.splice(0, employees.length, ...loadedEmployees);
        state.currentPage = 1;
        showAlert('', 'success', false);
        renderDashboard();
    } catch (error) {
        console.error(error);
        showErrorState();
    } finally {
        state.isLoading = false;
    }
}

function bindEvents() {
    [elements.departmentFilter, elements.statusFilter, elements.projectStatusFilter, elements.sortFilter].forEach(function (select) {
        select.addEventListener('change', function () {
            state.currentPage = 1;
            renderDashboard();
        });
    });

    elements.searchInput.addEventListener('input', function () {
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

            if (action === 'view') showEmployeeDetails(employeeId);
            if (action === 'edit') populateFormForEdit(employeeId);
            if (action === 'delete') confirmDeleteEmployee(employeeId);
        }

        const closeTrigger = event.target.closest('[data-close]');
        if (closeTrigger) {
            closeModal(closeTrigger.getAttribute('data-close'));
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