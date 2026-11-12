(function () {
  if (window.__taskNavigationLoaded || document.querySelector('.task-nav-header, .task-nav-sidebar')) {
    return;
  }

  const pages = [
    { label: 'Dashboard', href: 'index.html', icon: '🏠' },
    { label: 'Day 1 Registration', href: 'day1/Registration.html', icon: '📝' },
    { label: 'Day 1 Login', href: 'day1/Login.html', icon: '🔐' },
    { label: 'Day 2 Registration', href: 'day2/RegistrationValidation.html', icon: '📋' },
    { label: 'Day 2 Login', href: 'day2/Loginvalidation.html', icon: '🔑' },
    { label: 'Day 3 User Management', href: 'day3/User.html', icon: '👤' },
    { label: 'Day 4 API Integration', href: 'day4/api.html', icon: '🔗' },
    { label: 'Day 5 Dashboard', href: 'day5/Dashboard.html', icon: '📊' }
  ];

  const currentUrl = new URL(window.location.href);
  const rootBase = /\/day\d+\//i.test(currentUrl.pathname)
    ? new URL('..', currentUrl)
    : new URL('.', currentUrl);
  const buildUrl = (relativePath) => new URL(relativePath, rootBase).href;
  const normalizePath = (path) => path.replace(/\.html$/i, '').replace(/\/$/, '');

  const currentPageIndex = pages.findIndex(
    (page) => normalizePath(new URL(buildUrl(page.href)).pathname) === normalizePath(currentUrl.pathname)
  );

  if (currentPageIndex === -1) {
    return;
  }

  window.__taskNavigationLoaded = true;

  const bodyNodes = Array.from(document.body.childNodes).filter((node) => {
    if (node.nodeType === 1) {
      return !['SCRIPT', 'HEADER', 'FOOTER'].includes(node.tagName);
    }
    return node.nodeType === 3 && node.textContent.trim() !== '';
  });

  document.body.querySelectorAll(':scope > header, :scope > footer').forEach((element) => element.remove());

  const header = document.createElement('header');
  header.className = 'task-nav-header';
  header.innerHTML = `
    <div class="task-nav-header-left">
      <div class="task-nav-logo">
        <img src="https://jeebly.com/wp-content/uploads/2022/01/og-image-2.jpg" alt="Jeebly logo">
      </div>
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
  layout.className = 'task-nav-layout';

  const sidebar = document.createElement('aside');
  sidebar.className = 'task-nav-sidebar';
  sidebar.setAttribute('aria-label', 'Task navigation');

  const navToggle = document.createElement('button');
  navToggle.type = 'button';
  navToggle.className = 'task-nav-toggle';
  navToggle.setAttribute('aria-label', 'Toggle sidebar');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.textContent = '☰';
  navToggle.addEventListener('click', () => {
    const expanded = sidebar.classList.toggle('is-expanded');
    layout.classList.toggle('sidebar-expanded', expanded);
    navToggle.setAttribute('aria-expanded', String(expanded));
  });

  const navList = document.createElement('nav');
  navList.className = 'task-nav-menu';

  pages.forEach((page, index) => {
    const link = document.createElement('a');
    const isCurrent = index === currentPageIndex;
    link.href = buildUrl(page.href);
    link.title = page.label;
    link.className = `task-nav-link${isCurrent ? ' is-current' : ''}`;
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    }
    link.innerHTML = `
      <span class="task-nav-icon" aria-hidden="true">${page.icon}</span>
      <span class="task-nav-label">${page.label}</span>
    `;
    navList.appendChild(link);
  });

  sidebar.append(navToggle, navList);

  const mainContent = document.createElement('main');
  mainContent.className = 'task-nav-main';
  mainContent.append(...bodyNodes);

  const previousPage = pages[currentPageIndex - 1];
  const nextPage = pages[currentPageIndex + 1];
  const footer = document.createElement('footer');
  footer.className = 'task-nav-footer';
  footer.innerHTML = `
    <div class="task-nav-footer-inner">
      <div class="task-nav-footer-brand">
        <div class="task-nav-footer-title">All rights reserved © 2026 Jeebly LLC</div>
        <div class="task-nav-footer-address">
          Facility # 1 &amp; 3, Plot # 368-212, Al Quoz Industrial Area - 3, Dubai, United Arab Emirates.
          Monday to Saturday 9 AM to 5:30 PM
        </div>
      </div>
      <div class="task-nav-footer-actions">
        ${previousPage ? `<a class="task-nav-footer-link prev" href="${buildUrl(previousPage.href)}">← Previous</a>` : '<span class="task-nav-footer-link is-disabled">← Previous</span>'}
        ${nextPage ? `<a class="task-nav-footer-link next" href="${buildUrl(nextPage.href)}">Next →</a>` : '<span class="task-nav-footer-link is-disabled">Next →</span>'}
      </div>
    </div>
  `;

  layout.append(sidebar, mainContent);

  document.body.classList.add('task-nav-body', 'task-page');
  document.body.prepend(header, layout);
  document.body.append(footer);
})();