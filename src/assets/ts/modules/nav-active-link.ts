export const initNavActiveLink = (): void => {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('[data-nav]');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') ?? '/';
    const normalizedHref = href === '/' ? '/' : href.replace(/\/$/, '');

    if (normalizedHref === path) {
      link.classList.add('text-sky-600');
      link.setAttribute('aria-current', 'page');
    }
  });
};
