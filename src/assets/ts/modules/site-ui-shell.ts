import { siteUiStore } from '../core/ui-store.js';

export const initSiteUiShell = (): void => {
  const siteHeader = document.querySelector<HTMLElement>('[data-site-header]');
  const root = document.documentElement;

  siteUiStore.subscribe((state) => {
    const isModalOpen = state.heroContactOpen;
    const isMobileNavOpen = state.mobileNavOpen;
    const shouldLockScroll = isModalOpen || isMobileNavOpen;

    root.classList.toggle('overflow-hidden', shouldLockScroll);
    document.body.classList.toggle('overflow-hidden', shouldLockScroll);
    document.body.style.overscrollBehavior = shouldLockScroll ? 'none' : '';
    root.style.overscrollBehavior = shouldLockScroll ? 'none' : '';

    if (!siteHeader) {
      return;
    }

    siteHeader.classList.toggle('opacity-0', isModalOpen);
    siteHeader.classList.toggle('pointer-events-none', isModalOpen);
    siteHeader.classList.toggle('-translate-y-6', isModalOpen);
    siteHeader.setAttribute('aria-hidden', isModalOpen ? 'true' : 'false');
  });
};
