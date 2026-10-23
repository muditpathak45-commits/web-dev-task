window.taskItems = [
    {
        day: 1,
        name: "Registration",
        url: "day1/Registration.html"
    },
    {
        day: 1,
        name: "Login",
        url: "day1/Login.html"
    },
    {
        day: 2,
        name: "Registration Validation - Day 02",
        url: "day2/RegistrationValidation.html"
    },
    {
        day: 2,
        name: "Login Validation - Day 02",
        url: "day2/Loginvalidation.html"
    },
    {
        day: 3,
        name: "User Management",
        url: "day3/User.html"
    }
];

const navigationScript = document.currentScript;
const currentTaskIndex = window.taskItems.findIndex(function (task) {
    const taskUrl = new URL(task.url, navigationScript.src);
    return taskUrl.pathname.toLowerCase() === window.location.pathname.toLowerCase();
});

if (currentTaskIndex !== -1) {
    const style = document.createElement("style");
    style.textContent = `
        .task-navigation {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
            width: min(100% - 2rem, 1200px);
            margin: 2rem auto 1.5rem;
        }
        .task-navigation .btn {
            border-radius: 0.5rem;
            box-shadow: 0 2px 6px rgb(33 37 41 / 12%);
            transition: transform 150ms ease, box-shadow 150ms ease;
        }
        .task-navigation .btn:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgb(33 37 41 / 18%);
        }
        .task-navigation .btn:disabled {
            cursor: not-allowed;
            opacity: 0.55;
        }
        @media (max-width: 420px) {
            .task-navigation {
                width: calc(100% - 1rem);
                gap: 0.4rem;
            }
            .task-navigation .btn {
                flex: 1 1 0;
                padding: 0.375rem 0.25rem;
                font-size: 0.8rem;
            }
        }
    `;
    document.head.appendChild(style);

    const navigation = document.createElement("nav");
    navigation.className = "task-navigation";
    navigation.setAttribute("aria-label", "Task navigation");

    function addButton(label, targetIndex, disabled, className) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `btn ${className}`;
        button.textContent = label;
        button.disabled = disabled;
        button.addEventListener("click", function () {
            window.location.href = new URL(
                window.taskItems[targetIndex].url,
                navigationScript.src
            ).href;
        });
        navigation.appendChild(button);
    }

    addButton(
        "← Previous",
        currentTaskIndex - 1,
        currentTaskIndex === 0,
        "btn-outline-secondary"
    );

    const dashboardButton = document.createElement("button");
    dashboardButton.type = "button";
    dashboardButton.className = "btn btn-outline-dark";
    dashboardButton.textContent = "Dashboard";
    dashboardButton.addEventListener("click", function () {
        window.location.href = new URL("index.html", navigationScript.src).href;
    });
    navigation.appendChild(dashboardButton);

    addButton(
        "Next →",
        currentTaskIndex + 1,
        currentTaskIndex === window.taskItems.length - 1,
        "btn-outline-primary"
    );

    document.body.appendChild(navigation);
}
