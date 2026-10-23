const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const form = document.getElementById("login-form");
const statusMessage = document.getElementById("form-status");
const rememberError = document.getElementById("remember-error");

function showError(input, message) {
    const errorElement = document.getElementById(`${input.id}-error`);

    errorElement.textContent = message;
    input.setAttribute("aria-invalid", "true");
}

function clearError(input) {
    const errorElement = document.getElementById(`${input.id}-error`);

    errorElement.textContent = "";
    input.removeAttribute("aria-invalid");
}

function validateEmail() {
    const email = emailInput.value.trim();

    if (email === "") {
        showError(emailInput, "Email is required.");
        return false;
    }

    if (emailInput.validity.typeMismatch) {
        showError(emailInput, "Enter a valid email address.");
        return false;
    }

    clearError(emailInput);
    return true;
}

function validatePassword() {
    const password = passwordInput.value;

    if (password.trim() === "") {
        showError(passwordInput, "Password is required.");
        return false;
    }

    if (password.length < 8) {
        showError(passwordInput, "Password must be at least 8 characters long.");
        return false;
    }

    if (!/[1-9]/.test(password)) {
        showError(passwordInput, "Password must contain at least one number from 1 to 9.");
        return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>[\]\\/_+=~`';-]/.test(password)) {
        showError(passwordInput, "Password must contain at least one special character.");
        return false;
    }

    clearError(passwordInput);
    return true;
}

emailInput.addEventListener("input", function () {
    validateEmail();
    statusMessage.textContent = "";
});

passwordInput.addEventListener("input", function () {
    validatePassword();
    statusMessage.textContent = "";
});

rememberInput.addEventListener("change", function () {
    rememberError.textContent = "";
    rememberInput.removeAttribute("aria-invalid");
    statusMessage.textContent = "";
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isRememberChecked = rememberInput.checked;

    if (!isRememberChecked) {
        rememberError.textContent = "Please select Remember Me to continue.";
        rememberInput.setAttribute("aria-invalid", "true");
    } else {
        rememberError.textContent = "";
        rememberInput.removeAttribute("aria-invalid");
    }

    if (isEmailValid && isPasswordValid && isRememberChecked) {
        window.location.href = "../RegistrationValidationDay02/RegistrationValidation.html";
    } else {
        statusMessage.textContent = "";
    }
});
