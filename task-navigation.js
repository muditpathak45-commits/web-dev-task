(function () {
  if (window.__taskNavigationLoaded) {
    return;
  }

  window.__taskNavigationLoaded = true;

  const pages = [
    { label: 'Dashboard', href: 'index.html' },
    { label: 'Day 1 Registration', href: 'day1/Registration.html' },
    { label: 'Day 1 Login', href: 'day1/Login.html' },
    { label: 'Day 2 Registration', href: 'day2/RegistrationValidation.html' },
    { label: 'Day 2 Login', href: 'day2/Loginvalidation.html' },
    { label: 'Day 3 User Management', href: 'day3/User.html' },
    { label: 'Day 4 API Integration', href: 'day4/api.html' },
    { label: 'Day 5 Dashboard', href: 'day5/Dashboard.html' }
  ];

  const currentUrl = new URL(window.location.href);
  const currentPath = currentUrl.pathname.replace(/\\/g, '/');
  const rootBase = currentPath.includes('/day') ? new URL('..', currentUrl) : new URL('.', currentUrl);
  const buildUrl = (relativePath) => new URL(relativePath, rootBase).href;

  const currentPageIndex = pages.findIndex((page) => {
    const resolved = buildUrl(page.href);
    return resolved === currentUrl.href || resolved === currentUrl.href.replace(/\/$/, '');
  });

  if (currentPageIndex === -1) {
    return;
  }

  if (document.querySelector('.task-nav-header') || document.querySelector('.task-nav-sidebar')) {
    return;
  }

  const bodyNodes = Array.from(document.body.childNodes).filter((node) => {
    if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
      return false;
    }
    if (node.nodeType === 1 && ['HEADER', 'FOOTER'].includes(node.tagName)) {
      return false;
    }
    if (node.nodeType === 3 && !node.textContent.trim()) {
      return false;
    }
    return true;
  });

  const header = document.createElement('header');
  header.className = 'task-nav-header';
  header.innerHTML = `
    <div class="task-nav-header-left">
      <div class="task-nav-logo">
      <img src="https://jeebly.com/wp-content/uploads/2022/01/og-image-2.jpg" alt="Logo">
      </div>
    </div>
    <div class="task-nav-header-center">
      <a class="task-nav-brand" href="${buildUrl('index.html')}"></a>
    </div>
    <div class="task-nav-header-right">
      <div class="task-nav-user-avatar">MJ</div>
      <div class="task-nav-user-text">
        <div class="task-nav-user-name">Mudit Jeebly</div>
        <div class="task-nav-user-role">Jeebly LLC (HQ)</div>
      </div>
    </div>
  `;

  const layout = document.createElement('div');
  layout.className = 'task-nav-layout sidebar-collapsed';

  const sidebar = document.createElement('aside');
  sidebar.className = 'task-nav-sidebar is-collapsed';
  sidebar.setAttribute('aria-label', 'Task navigation');

  const navToggle = document.createElement('button');
  navToggle.type = 'button';
  navToggle.className = 'task-nav-toggle';
  navToggle.setAttribute('aria-label', 'Toggle sidebar');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.textContent = '☰';
  navToggle.addEventListener('click', () => {
    const expanded = sidebar.classList.toggle('is-expanded');
    sidebar.classList.toggle('is-collapsed', !expanded);
    layout.classList.toggle('sidebar-expanded', expanded);
    layout.classList.toggle('sidebar-collapsed', !expanded);
    navToggle.setAttribute('aria-expanded', String(expanded));
  });

  const navList = document.createElement('nav');
  navList.className = 'task-nav-menu';

  pages.forEach((page, index) => {
    const link = document.createElement('a');
    const isCurrent = index === currentPageIndex;
    link.href = buildUrl(page.href);
    link.className = `task-nav-link${isCurrent ? ' is-current' : ''}`;
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    }
    link.innerHTML = `
      <span class="task-nav-icon" aria-hidden="true"></span>
      <span class="task-nav-label">${page.label}</span>
    `;
    navList.appendChild(link);
  });

  sidebar.appendChild(navToggle);
  sidebar.appendChild(navList);

  const mainContent = document.createElement('main');
  mainContent.className = 'task-nav-main';

  bodyNodes.forEach((node) => {
    if (node.nodeType === 1) {
      mainContent.appendChild(node.cloneNode(true));
      return;
    }
    if (node.nodeType === 3 && node.textContent.trim()) {
      mainContent.appendChild(node.cloneNode(true));
    }
  });

  const previousPage = pages[currentPageIndex - 1];
  const nextPage = pages[currentPageIndex + 1];
  const footer = document.createElement('footer');
  footer.className = 'task-nav-footer';
  footer.innerHTML = `
    <div class="task-nav-footer-inner">
      <div class="task-nav-footer-brand">
        <div>
          <div class="task-nav-footer-title"></div>
        </div>
      </div>

      <div class="task-nav-footer-actions">
        ${previousPage ? `<a class="task-nav-footer-link prev" href="${buildUrl(previousPage.href)}">← Previous</a>` : '<span class="task-nav-footer-link is-disabled">← Previous</span>'}
        ${nextPage ? `<a class="task-nav-footer-link next" href="${buildUrl(nextPage.href)}">Next →</a>` : '<span class="task-nav-footer-link is-disabled">Next →</span>'}
      </div>
    </div>
  `;

  layout.appendChild(sidebar);
  layout.appendChild(mainContent);

  document.body.innerHTML = '';
  document.body.classList.add('task-nav-body');
  document.body.appendChild(header);
  document.body.appendChild(layout);
  document.body.appendChild(footer);
})();
