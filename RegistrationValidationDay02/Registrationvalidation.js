const nameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const dobInput = document.getElementById("dob");
const genderInput = document.getElementById("gender");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const addressInput = document.getElementById("address");
const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");
const form = document.getElementById("registration-form");
const termsCheckbox = document.getElementById("terms");
const rememberMeCheckbox = document.getElementById("remember-me");
const successMessage = document.getElementById("success-message");

function showError(input, message) {
    const errorElement =
        document.getElementById(`${input.id}-error`) ||
        document.getElementById(`${input.id}Error`);

    if (errorElement) {
        errorElement.textContent = message;
    }
    input.setAttribute("aria-invalid", "true");
}

function clearError(input) {
    const errorElement =
        document.getElementById(`${input.id}-error`) ||
        document.getElementById(`${input.id}Error`);

    if (errorElement) {
        errorElement.textContent = "";
    }
    input.removeAttribute("aria-invalid");
}

function validateName() {
    const name = nameInput.value.trim();

    if (name === "") {
        showError(nameInput, "Name cannot be empty");
        return false;
    }

    if (name.length <3) {
        showError(nameInput, "Name must contain at least 3 characters");
        return false;
    }

    clearError(nameInput);
    return true;
}


function validateEmail() {
    const email = emailInput.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        showError(emailInput, "Email cannot be empty");
        return false;
    }

    if (!emailPattern.test(email)) {
        showError(emailInput, "Invalid email address");
        return false;
    }

    clearError(emailInput);
    return true;
}


function validateMobile() {
    const mobile = mobileInput.value.trim();

    const mobilePattern = /^[0-9]{10}$/;

    if (mobile === "") {
        showError(mobileInput, "Mobile number cannot be empty");
        return false;
    }

    if (!mobilePattern.test(mobile)) {
        showError(mobileInput, "Enter a valid 10 digit mobile number");
        return false;
    }

    clearError(mobileInput);
    return true;
}

function validatePassword() {
    const password = passwordInput.value;

    if (password.trim() === "") {
        showError(passwordInput, "Password cannot be empty");
        return false;
    }

    if (password.length < 8) {
        showError(passwordInput, "Password must contain at least 8 characters");
        return false;
    }

    if (!/[0-9]/.test(password)) {
        showError(passwordInput, "Password must contain at least one number");
        return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        showError(passwordInput, "Password must contain at least one special character");
        return false;
    }

    clearError(passwordInput);
    return true;
}

function validateConfirmPassword() {
    if (confirmPasswordInput.value === "") {
        showError(confirmPasswordInput, "Please confirm your password");
        return false;
    }

    if (confirmPasswordInput.value !== passwordInput.value) {
        showError(confirmPasswordInput, "Passwords do not match");
        return false;
    }

    clearError(confirmPasswordInput);
    return true;
}


async function loadCountries() {
    try {
        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries"
        );

        if (!response.ok) {
            throw new Error(`Country request failed: ${response.status}`);
        }

        const result = await response.json();

        result.data.forEach(function (country) {
            const option = document.createElement("option");

            option.value = country.country;
            option.textContent = country.country;

            countrySelect.appendChild(option);
        });

    } catch (error) {
        showError(countrySelect, "Unable to load countries. Please try again.");
        console.error("Unable to load countries:", error);
    }
}

async function loadStates(country) {
    stateSelect.innerHTML = '<option value="">Select State</option>';
    stateSelect.disabled = true;

    if (!country) {
        return;
    }

    try {
        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries/states",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    country: country
                })
            }
        );

        if (!response.ok) {
            throw new Error(`State request failed: ${response.status}`);
        }

        const result = await response.json();

        result.data.states.forEach(function (state) {
            const option = document.createElement("option");

            option.value = state.name;
            option.textContent = state.name;

            stateSelect.appendChild(option);
        });

        stateSelect.disabled = false;
        clearError(stateSelect);

    } catch (error) {
        showError(stateSelect, "Unable to load states. Please try again.");
        console.error("Unable to load states:", error);
    }
}


loadCountries();


countrySelect.addEventListener("change", function () {
    loadStates(this.value);
    clearError(countrySelect);
    clearError(stateSelect);
});

function togglePassword(input, button) {
    if (input.type === "password") {
        input.type = "text";
        button.textContent = "Hide";
    } else {
        input.type = "password";
        button.textContent = "Show";
    }
}

const passwordToggle = document.getElementById("password-toggle");
const confirmPasswordToggle = document.getElementById("confirm-password-toggle");

if (passwordToggle) {
    passwordToggle.addEventListener("click", function () {
        togglePassword(passwordInput, this);
    });
}

if (confirmPasswordToggle) {
    confirmPasswordToggle.addEventListener("click", function () {
        togglePassword(confirmPasswordInput, this);
    });
}

nameInput.addEventListener("input", validateName);

emailInput.addEventListener("input", validateEmail);

mobileInput.addEventListener("input", validateMobile);

dobInput.addEventListener("change", function () {
    if (dobInput.value) {
        clearError(dobInput);
    }
});

genderInput.addEventListener("change", function () {
    if (genderInput.value) {
        clearError(genderInput);
    }
});

passwordInput.addEventListener("input", function () {
    validatePassword();

    if (confirmPasswordInput.value !== "") {
        validateConfirmPassword();
    }
});

confirmPasswordInput.addEventListener("input", validateConfirmPassword);

addressInput.addEventListener("input", function () {
    if (addressInput.value.trim()) {
        clearError(addressInput);
    }
});

termsCheckbox.addEventListener("change", function () {
    const errorElement = document.getElementById("terms-error");
    errorElement.textContent = "";
    termsCheckbox.removeAttribute("aria-invalid");
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    successMessage.textContent = "";

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMobileValid = validateMobile();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    let isFormValid = true;

    if (!dobInput.value) {
        showError(dobInput, "Please select your date of birth");
        isFormValid = false;
    } else {
        clearError(dobInput);
    }

    if (!genderInput.value) {
        showError(genderInput, "Please select your gender");
        isFormValid = false;
    } else {
        clearError(genderInput);
    }

    if (!addressInput.value.trim()) {
        showError(addressInput, "Address cannot be empty");
        isFormValid = false;
    } else {
        clearError(addressInput);
    }

    if (!countrySelect.value) {
        showError(countrySelect, "Please select a country");
        isFormValid = false;
    } else {
        clearError(countrySelect);
    }

    if (!stateSelect.value) {
        showError(stateSelect, "Please select a state");
        isFormValid = false;
    } else {
        clearError(stateSelect);
    }

    if (!termsCheckbox.checked) {
        document.getElementById("terms-error").textContent =
            "Please accept the Terms & Conditions";
        termsCheckbox.setAttribute("aria-invalid", "true");

        isFormValid = false;
    } else {
        document.getElementById("terms-error").textContent = "";
        termsCheckbox.removeAttribute("aria-invalid");
    }

    if (
        isNameValid &&
        isEmailValid &&
        isMobileValid &&
        isPasswordValid &&
        isConfirmPasswordValid &&
        isFormValid
    ) {

        if (rememberMeCheckbox && rememberMeCheckbox.checked) {

            const userData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                mobile: mobileInput.value.trim(),
                country: countrySelect.value,
                state: stateSelect.value
            }
            localStorage.setItem("userData", JSON.stringify(userData));
        }

        form.reset();

        stateSelect.innerHTML = '<option value="">Select State</option>';
        stateSelect.disabled = true;
        successMessage.textContent = "Registration successful!";
    }
});

form.addEventListener("reset", function () {
    successMessage.textContent = "";
    form.querySelectorAll("small").forEach(function (errorElement) {
        errorElement.textContent = "";
    });
    form.querySelectorAll("[aria-invalid]").forEach(function (input) {
        input.removeAttribute("aria-invalid");
    });
    stateSelect.innerHTML = '<option value="">Select Country first</option>';
    stateSelect.disabled = true;
});