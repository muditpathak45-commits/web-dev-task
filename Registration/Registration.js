// Country and State dropdown
const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");
const countrySearch = document.getElementById("countrySearch");
const stateSearch = document.getElementById("stateSearch");

function togglePasswordVisibility(button) {
  const targetId = button.dataset.toggleTarget;
  const input = document.getElementById(targetId);

  const shouldShow = input.type === "password";
  input.type = shouldShow ? "text" : "password";
  button.textContent = shouldShow ? "Hide" : "Show";
  button.setAttribute("aria-pressed", String(shouldShow));
  button.setAttribute(
    "aria-label",
    `${shouldShow ? "Hide" : "Show"} ${targetId === "confirmPassword" ? "confirm " : ""}password`
  );
}

const passwordToggleButtons = document.querySelectorAll("[data-toggle-target]");
passwordToggleButtons.forEach((button) => {
  button.addEventListener("click", () => togglePasswordVisibility(button));
});

function filterDropdown(selectElement, searchInput) {
  const searchText = (searchInput.value || "").trim().toLowerCase();

  Array.from(selectElement.options).forEach((option) => {
    const optionText = (option.textContent || "").toLowerCase();
    const shouldShow =
      !searchText || option.value === "" || optionText.includes(searchText);

    option.hidden = !shouldShow;
  });
}

countrySearch.addEventListener("input", () => {
  filterDropdown(countrySelect, countrySearch);
});

stateSearch.addEventListener("input", () => {
  filterDropdown(stateSelect, stateSearch);
});

// Load countries from API
fetch("https://countriesnow.space/api/v0.1/countries/positions")
  .then((response) => response.json())
  .then((data) => {
    countrySelect.innerHTML = '<option value="">Select Country</option>';

    data.data.forEach((country) => {
      const option = document.createElement("option");

      option.value = country.name;
      option.textContent = country.name;

      countrySelect.appendChild(option);
    });

    filterDropdown(countrySelect, countrySearch);
  })
  .catch((error) => {
    countrySelect.innerHTML =
      '<option value="">Unable to load countries</option>';

    console.log("Country API Error:", error);
  });

// When country is selected
countrySelect.addEventListener("change", function () {
  const selectedCountry = countrySelect.value;

  if (selectedCountry === "") {
    stateSelect.innerHTML = '<option value="">Select country first</option>';

    stateSelect.disabled = true;
    stateSearch.value = "";
    stateSearch.disabled = true;

    return;
  }

  // Show loading message
  stateSelect.innerHTML = '<option value="">Loading states...</option>';

  stateSelect.disabled = true;
  stateSearch.disabled = false;
  stateSearch.value = "";

  // Get states from API
  fetch("https://countriesnow.space/api/v0.1/countries/states", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      country: selectedCountry,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      stateSelect.innerHTML = '<option value="">Select State</option>';

      if (data.data && data.data.states) {
        data.data.states.forEach((state) => {
          const option = document.createElement("option");

          option.value = state.name;
          option.textContent = state.name;

          stateSelect.appendChild(option);
        });
      }

      filterDropdown(stateSelect, stateSearch);
      stateSelect.disabled = false;
    })
    .catch((error) => {
      stateSelect.innerHTML = '<option value="">Unable to load states</option>';

      console.log("State API Error:", error);
    });
});
