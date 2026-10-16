const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");
async function loadCountries() {
    try {
        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries"
        );

        const result = await response.json();

        result.data.forEach(function (country) {
            const option = document.createElement("option");
            option.value = country.country;
            option.textContent = country.country;
            countrySelect.appendChild(option);
        });
    } catch (error) {
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

        const result = await response.json();
        result.data.states.forEach(function (state) {
            const option = document.createElement("option");
            option.value = state.name;
            option.textContent = state.name;
            stateSelect.appendChild(option);
        });
        stateSelect.disabled = false;
    } catch (error) {
        console.log("Unable to load states");
    }
}
loadCountries();
countrySelect.addEventListener("change", function () {
    loadStates(this.value);
});
