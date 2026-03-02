type StoredConsent = {
  version: number;
  analytics: boolean;
  updatedAt: string;
};

type AnalyticsIds = {
  ga4Id: string;
  gtmId: string;
};

type ConsentValue = 'granted' | 'denied';

const STORAGE_KEY = 'fraktad_cookie_consent_v1';
const CONSENT_VERSION = 1;
const GTM_SCRIPT_ID = 'fraktad-gtm-script';
const GA_SCRIPT_ID = 'fraktad-ga4-script';
const openSettingsSelector = '[data-cookie-open-settings-global]';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const normalizeText = (value: string | null | undefined): string =>
  typeof value === 'string' ? value.trim() : '';

const readStoredConsent = (): StoredConsent | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed?.version !== CONSENT_VERSION) {
      return null;
    }
    if (typeof parsed.analytics !== 'boolean') {
      return null;
    }
    if (typeof parsed.updatedAt !== 'string' || !parsed.updatedAt) {
      return null;
    }

    return {
      version: CONSENT_VERSION,
      analytics: parsed.analytics,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
};

const writeStoredConsent = (analytics: boolean): void => {
  const payload: StoredConsent = {
    version: CONSENT_VERSION,
    analytics,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const ensureDataLayer = (): void => {
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  if (typeof window.gtag !== 'function') {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }
};

const setConsentDefault = (): void => {
  ensureDataLayer();
  window.gtag?.('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });
};

const updateConsent = (value: ConsentValue): void => {
  ensureDataLayer();
  window.gtag?.('consent', 'update', {
    analytics_storage: value,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  });
};

const loadScriptOnce = (id: string, src: string): void => {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

const loadGtm = (gtmId: string): void => {
  if (!gtmId) {
    return;
  }

  ensureDataLayer();
  const hasStartEvent = window.dataLayer?.some((entry) => {
    if (!entry || typeof entry !== 'object') {
      return false;
    }
    const maybeEvent = entry as { event?: unknown };
    return maybeEvent.event === 'gtm.js';
  });
  if (!hasStartEvent) {
    window.dataLayer?.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });
  }

  loadScriptOnce(
    GTM_SCRIPT_ID,
    `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`,
  );
};

const loadGa4 = (ga4Id: string): void => {
  if (!ga4Id) {
    return;
  }

  loadScriptOnce(
    GA_SCRIPT_ID,
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`,
  );
  ensureDataLayer();
  window.gtag?.('js', new Date());
  window.gtag?.('config', ga4Id, {
    anonymize_ip: true,
  });
};

const deleteCookie = (name: string, domain?: string): void => {
  const domainPart = domain ? `domain=${domain};` : '';
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; ${domainPart} SameSite=Lax`;
};

const clearAnalyticsCookies = (): void => {
  const names = new Set<string>(['_ga', '_gid', '_gat']);
  document.cookie.split(';').forEach((entry) => {
    const [rawName] = entry.split('=');
    const cookieName = normalizeText(rawName);
    if (!cookieName) {
      return;
    }
    if (
      cookieName === '_ga' ||
      cookieName.startsWith('_ga_') ||
      names.has(cookieName)
    ) {
      names.add(cookieName);
    }
  });

  const host = window.location.hostname;
  const parts = host.split('.');
  const domains: (string | undefined)[] = [undefined, host];
  for (let index = 1; index < parts.length - 1; index += 1) {
    domains.push(`.${parts.slice(index).join('.')}`);
  }

  names.forEach((cookieName) => {
    domains.forEach((domain) => {
      deleteCookie(cookieName, domain);
    });
  });
};

const show = (element: HTMLElement | null): void => {
  if (!element) {
    return;
  }
  element.classList.remove('hidden');
};

const hide = (element: HTMLElement | null): void => {
  if (!element) {
    return;
  }
  element.classList.add('hidden');
};

const getAnalyticsIds = (root: HTMLElement): AnalyticsIds => ({
  ga4Id: normalizeText(root.dataset.ga4Id),
  gtmId: normalizeText(root.dataset.gtmId),
});

const applyAnalyticsState = (enabled: boolean, ids: AnalyticsIds): void => {
  updateConsent(enabled ? 'granted' : 'denied');
  if (!enabled) {
    clearAnalyticsCookies();
    return;
  }

  if (ids.gtmId) {
    loadGtm(ids.gtmId);
    return;
  }

  if (ids.ga4Id) {
    loadGa4(ids.ga4Id);
  }
};

export const initCookieConsent = (): (() => void) | void => {
  const root = document.querySelector<HTMLElement>(
    '[data-cookie-consent-root]',
  );
  if (!root) {
    return;
  }

  const ids = getAnalyticsIds(root);
  if (!ids.ga4Id && !ids.gtmId) {
    return;
  }

  const banner = root.querySelector<HTMLElement>('[data-cookie-banner]');
  const modal = root.querySelector<HTMLElement>('[data-cookie-settings-modal]');
  const floatingButton = root.querySelector<HTMLButtonElement>(
    '[data-cookie-open-settings-floating]',
  );
  const analyticsToggle = root.querySelector<HTMLInputElement>(
    '[data-cookie-analytics-toggle]',
  );
  const acceptButton = root.querySelector<HTMLButtonElement>(
    '[data-cookie-accept]',
  );
  const rejectButton = root.querySelector<HTMLButtonElement>(
    '[data-cookie-reject]',
  );
  const openSettingsButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-cookie-open-settings]'),
  );
  const closeSettingsButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-cookie-close-settings]'),
  );
  const saveSettingsButton = root.querySelector<HTMLButtonElement>(
    '[data-cookie-save-settings]',
  );
  const globalOpenButtons = Array.from(
    document.querySelectorAll<HTMLElement>(openSettingsSelector),
  );

  if (
    !banner ||
    !modal ||
    !floatingButton ||
    !analyticsToggle ||
    !acceptButton ||
    !rejectButton ||
    !saveSettingsButton
  ) {
    return;
  }

  setConsentDefault();

  const setSettingsOpen = (isOpen: boolean) => {
    if (isOpen) {
      show(modal);
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');
      return;
    }

    hide(modal);
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden');
  };

  const setConsent = (analytics: boolean) => {
    writeStoredConsent(analytics);
    analyticsToggle.checked = analytics;
    hide(banner);
    show(floatingButton);
    setSettingsOpen(false);
    applyAnalyticsState(analytics, ids);
  };

  const storedConsent = readStoredConsent();
  if (storedConsent) {
    analyticsToggle.checked = storedConsent.analytics;
    hide(banner);
    show(floatingButton);
    applyAnalyticsState(storedConsent.analytics, ids);
  } else {
    analyticsToggle.checked = false;
    show(banner);
    hide(floatingButton);
    applyAnalyticsState(false, ids);
  }

  const openSettings = () => {
    const current = readStoredConsent();
    analyticsToggle.checked = current?.analytics ?? false;
    setSettingsOpen(true);
  };

  const onAccept = () => setConsent(true);
  const onReject = () => setConsent(false);
  const onSave = () => setConsent(analyticsToggle.checked);
  const onCloseSettings = () => setSettingsOpen(false);
  const onEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSettingsOpen(false);
    }
  };
  const onGlobalOpen = (event: Event) => {
    event.preventDefault();
    openSettings();
  };

  acceptButton.addEventListener('click', onAccept);
  rejectButton.addEventListener('click', onReject);
  saveSettingsButton.addEventListener('click', onSave);
  floatingButton.addEventListener('click', openSettings);
  openSettingsButtons.forEach((button) =>
    button.addEventListener('click', openSettings),
  );
  closeSettingsButtons.forEach((button) =>
    button.addEventListener('click', onCloseSettings),
  );
  globalOpenButtons.forEach((button) =>
    button.addEventListener('click', onGlobalOpen),
  );
  window.addEventListener('keydown', onEscape);

  return () => {
    acceptButton.removeEventListener('click', onAccept);
    rejectButton.removeEventListener('click', onReject);
    saveSettingsButton.removeEventListener('click', onSave);
    floatingButton.removeEventListener('click', openSettings);
    openSettingsButtons.forEach((button) =>
      button.removeEventListener('click', openSettings),
    );
    closeSettingsButtons.forEach((button) =>
      button.removeEventListener('click', onCloseSettings),
    );
    globalOpenButtons.forEach((button) =>
      button.removeEventListener('click', onGlobalOpen),
    );
    window.removeEventListener('keydown', onEscape);
  };
};
