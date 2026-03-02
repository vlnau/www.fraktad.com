export type SiteUiState = {
  heroContactOpen: boolean;
  mobileNavOpen: boolean;
};

type SiteUiListener = (state: SiteUiState, prevState: SiteUiState) => void;

const createSiteUiStore = (initialState: SiteUiState) => {
  let state = initialState;
  const listeners = new Set<SiteUiListener>();

  const setState = (patch: Partial<SiteUiState>) => {
    const nextState: SiteUiState = { ...state, ...patch };
    const changed = Object.keys(patch).some((key) => {
      const typedKey = key as keyof SiteUiState;
      return state[typedKey] !== nextState[typedKey];
    });

    if (!changed) {
      return;
    }

    const prevState = state;
    state = nextState;
    listeners.forEach((listener) => listener(state, prevState));
  };

  const subscribe = (listener: SiteUiListener) => {
    listeners.add(listener);
    listener(state, state);
    return () => listeners.delete(listener);
  };

  return {
    getState: () => state,
    setState,
    subscribe,
  };
};

export const siteUiStore = createSiteUiStore({
  heroContactOpen: false,
  mobileNavOpen: false,
});
