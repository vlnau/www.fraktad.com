import { siteUiStore } from '../core/ui-store.js';

export const initHeroContactModal = (): void => {
  const modal = document.querySelector<HTMLElement>('.js-hero-contact-modal');
  if (!modal) {
    return;
  }

  const panel = modal.querySelector<HTMLElement>('.js-hero-contact-panel');
  const openers = document.querySelectorAll<HTMLElement>(
    '[data-open-hero-contact]',
  );
  const closers = modal.querySelectorAll<HTMLElement>(
    '[data-close-hero-contact]',
  );
  const autofocusField = modal.querySelector<HTMLElement>(
    '[data-hero-contact-autofocus]',
  );
  const focusScope = panel ?? modal;
  const getFocusableElements = () =>
    Array.from(
      focusScope.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getAttribute('aria-hidden') !== 'true');

  let lastActiveElement: HTMLElement | null = null;
  const isOpen = () => siteUiStore.getState().heroContactOpen;

  const openModal = () => {
    if (isOpen()) {
      return;
    }

    lastActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    siteUiStore.setState({ heroContactOpen: true, mobileNavOpen: false });
  };

  const closeModal = () => {
    if (!isOpen()) {
      return;
    }
    siteUiStore.setState({ heroContactOpen: false });
  };

  openers.forEach((opener) => {
    opener.addEventListener('click', (event) => {
      event.preventDefault();
      openModal();
    });

    opener.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal();
      }
    });
  });

  closers.forEach((closer) => {
    closer.addEventListener('click', closeModal);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      closeModal();
      return;
    }

    if (event.key !== 'Tab' || !isOpen()) {
      return;
    }

    const focusableElements = getFocusableElements();
    if (!focusableElements.length) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const activeInsideScope =
      !!activeElement && focusScope.contains(activeElement);

    if (event.shiftKey) {
      if (!activeInsideScope || activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      return;
    }

    if (!activeInsideScope || activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  siteUiStore.subscribe((state, prevState) => {
    const isNowOpen = state.heroContactOpen;
    const wasOpen = prevState.heroContactOpen;

    modal.setAttribute('aria-hidden', isNowOpen ? 'false' : 'true');
    modal.setAttribute('aria-modal', isNowOpen ? 'true' : 'false');
    modal.classList.toggle('pointer-events-auto', isNowOpen);
    modal.classList.toggle('opacity-100', isNowOpen);
    modal.classList.toggle('pointer-events-none', !isNowOpen);
    modal.classList.toggle('opacity-0', !isNowOpen);

    if (panel) {
      panel.classList.toggle('translate-y-0', isNowOpen);
      panel.classList.toggle('scale-100', isNowOpen);
      panel.classList.toggle('opacity-100', isNowOpen);
      panel.classList.toggle('translate-y-2', !isNowOpen);
      panel.classList.toggle('scale-[0.98]', !isNowOpen);
      panel.classList.toggle('opacity-0', !isNowOpen);
    }

    if (isNowOpen && !wasOpen) {
      window.setTimeout(() => autofocusField?.focus(), 40);
    }

    if (!isNowOpen && wasOpen) {
      lastActiveElement?.focus();
    }
  });
};
