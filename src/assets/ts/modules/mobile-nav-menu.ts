import { siteUiStore } from '../core/ui-store.js';

const DESKTOP_BREAKPOINT_QUERY = '(min-width: 64rem)';

export const initMobileNavMenu = (): (() => void) | void => {
  const siteHeader = document.querySelector<HTMLElement>('[data-site-header]');
  if (!siteHeader) {
    return;
  }

  const toggleButton = siteHeader.querySelector<HTMLButtonElement>(
    '[data-mobile-nav-toggle]',
  );
  const overlay = siteHeader.querySelector<HTMLButtonElement>(
    '[data-mobile-nav-overlay]',
  );
  const panel = siteHeader.querySelector<HTMLElement>('[data-mobile-nav-panel]');

  if (!toggleButton || !overlay || !panel) {
    return;
  }

  const topLine = toggleButton.querySelector<HTMLElement>(
    '[data-mobile-nav-line="top"]',
  );
  const middleLine = toggleButton.querySelector<HTMLElement>(
    '[data-mobile-nav-line="middle"]',
  );
  const bottomLine = toggleButton.querySelector<HTMLElement>(
    '[data-mobile-nav-line="bottom"]',
  );
  const menuLinks = panel.querySelectorAll<HTMLAnchorElement>(
    '[data-mobile-nav-link]',
  );
  const desktopMediaQuery = window.matchMedia(DESKTOP_BREAKPOINT_QUERY);

  const closeMenu = (focusToggle = false) => {
    if (!siteUiStore.getState().mobileNavOpen) {
      return;
    }

    siteUiStore.setState({ mobileNavOpen: false });

    if (focusToggle) {
      toggleButton.focus();
    }
  };

  const handleToggle = () => {
    siteUiStore.setState({
      mobileNavOpen: !siteUiStore.getState().mobileNavOpen,
    });
  };

  const handleOverlayClick = () => {
    closeMenu(true);
  };

  const handleMenuLinkClick = () => {
    closeMenu();
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !siteUiStore.getState().mobileNavOpen) {
      return;
    }

    event.preventDefault();
    closeMenu(true);
  };

  const handleViewportChange = (event: MediaQueryListEvent) => {
    if (!event.matches) {
      return;
    }

    closeMenu();
  };

  toggleButton.addEventListener('click', handleToggle);
  overlay.addEventListener('click', handleOverlayClick);
  menuLinks.forEach((link) => {
    link.addEventListener('click', handleMenuLinkClick);
  });
  window.addEventListener('keydown', handleEscape);
  desktopMediaQuery.addEventListener('change', handleViewportChange);

  const unsubscribe = siteUiStore.subscribe((state) => {
    const isOpen = state.mobileNavOpen;

    toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggleButton.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
    toggleButton.classList.toggle('bg-brand-ink', isOpen);
    toggleButton.classList.toggle('text-brand-white', isOpen);
    toggleButton.classList.toggle('border-brand-ink', isOpen);
    toggleButton.classList.toggle('border-brand-ink/20', !isOpen);

    overlay.classList.toggle('pointer-events-auto', isOpen);
    overlay.classList.toggle('opacity-100', isOpen);
    overlay.classList.toggle('pointer-events-none', !isOpen);
    overlay.classList.toggle('opacity-0', !isOpen);
    overlay.tabIndex = isOpen ? 0 : -1;
    overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    panel.classList.toggle('pointer-events-auto', isOpen);
    panel.classList.toggle('opacity-100', isOpen);
    panel.classList.toggle('translate-y-0', isOpen);
    panel.classList.toggle('pointer-events-none', !isOpen);
    panel.classList.toggle('opacity-0', !isOpen);
    panel.classList.toggle('-translate-y-2', !isOpen);
    panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    panel.toggleAttribute('inert', !isOpen);

    if (topLine) {
      topLine.classList.toggle('-translate-y-[0.26rem]', !isOpen);
      topLine.classList.toggle('translate-y-0', isOpen);
      topLine.classList.toggle('rotate-45', isOpen);
    }

    if (middleLine) {
      middleLine.classList.toggle('opacity-0', isOpen);
      middleLine.classList.toggle('opacity-100', !isOpen);
    }

    if (bottomLine) {
      bottomLine.classList.toggle('translate-y-[0.26rem]', !isOpen);
      bottomLine.classList.toggle('translate-y-0', isOpen);
      bottomLine.classList.toggle('-rotate-45', isOpen);
    }
  });

  return () => {
    toggleButton.removeEventListener('click', handleToggle);
    overlay.removeEventListener('click', handleOverlayClick);
    menuLinks.forEach((link) => {
      link.removeEventListener('click', handleMenuLinkClick);
    });
    window.removeEventListener('keydown', handleEscape);
    desktopMediaQuery.removeEventListener('change', handleViewportChange);
    unsubscribe();
  };
};
