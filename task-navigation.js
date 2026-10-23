const navigationScript = document.currentScript;
const pages = [
  { name: "Dashboard", path: "index.html" },
  { name: "Day 1 Registration", path: "day1/Registration.html" },
  { name: "Day 1 Login", path: "day1/Login.html" },
  { name: "Day 2 Registration", path: "day2/RegistrationValidation.html" },
  { name: "Day 2 Login", path: "day2/Loginvalidation.html" },
  { name: "Day 3 User Management", path: "day3/User.html" },
];

const pageUrls = pages.map(function (page) {
  return new URL(page.path, navigationScript.src);
});
const currentPageIndex = pageUrls.findIndex(function (url) {
  return url.pathname.toLowerCase() === window.location.pathname.toLowerCase();
});

if (currentPageIndex !== -1) {
  const style = document.createElement("style");
  style.textContent = `
    .page-navigation {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      max-width: 900px;
      margin: 20px auto 0;
      padding: 15px 20px;
      border-top: 1px solid #ccc;
      background: #e5e5e5;
    }
    .page-navigation a,
    .page-navigation span {
      display: inline-block;
      padding: 8px 12px;
      border: 1px solid #aaa;
      border-radius: 3px;
      background: #fff;
      color: #222;
      font: inherit;
      text-decoration: none;
    }
    .page-navigation a:hover {
      background: #f2f2f2;
    }
    .page-navigation .disabled {
      color: #777;
      cursor: not-allowed;
      opacity: 0.6;
    }
    @media (max-width: 940px) {
      .page-navigation {
        margin-right: 5%;
        margin-left: 5%;
      }
    }
  `;
  document.head.appendChild(style);

  const navigation = document.createElement("nav");
  navigation.className = "page-navigation";
  navigation.setAttribute("aria-label", "Page navigation");

  function addPageLink(label, pageIndex, disabled) {
    const link = document.createElement(disabled ? "span" : "a");
    link.textContent = label;

    if (disabled) {
      link.className = "disabled";
      link.setAttribute("aria-disabled", "true");
    } else {
      link.href = pageUrls[pageIndex].href;
    }

    navigation.appendChild(link);
  }

  addPageLink(
    "← Previous Page",
    currentPageIndex - 1,
    currentPageIndex === 0
  );
  addPageLink(
    "Next Page →",
    currentPageIndex + 1,
    currentPageIndex === pages.length - 1
  );

  document.body.appendChild(navigation);
}
