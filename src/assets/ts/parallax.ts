type CleanupFn = () => void;

export const initParallax = (): CleanupFn | void => {
  const parallaxHero = document.querySelector<HTMLElement>(
    '[data-parallax-hero]',
  );
  const parallaxImage = document.querySelector<HTMLElement>(
    '[data-parallax-image]',
  );

  if (!parallaxHero || !parallaxImage) {
    return;
  }

  const reducedMotion =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
  let isHeroVisible = true;
  let ticking = false;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const getViewportHeight = () =>
    window.visualViewport?.height ?? window.innerHeight;
  const isReducedMotion = () => reducedMotion?.matches ?? false;

  const requestFrame =
    window.requestAnimationFrame?.bind(window) ??
    ((callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(performance.now()), 16));

  const renderParallax = () => {
    ticking = false;

    if (isReducedMotion() || !isHeroVisible) {
      parallaxImage.style.transform = 'none';
      return;
    }

    const rect = parallaxHero.getBoundingClientRect();
    const viewportHeight = getViewportHeight();
    const maxShift = clamp(viewportHeight * 0.9, 260, 1400);
    const progress = clamp(
      (viewportHeight - rect.top) / (viewportHeight + rect.height),
      0,
      1,
    );

    const speed = 1.35;
    const translateY = (progress - 0.5) * maxShift * speed;
    parallaxImage.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(1.08)`;
  };

  const requestRender = () => {
    if (!ticking) {
      ticking = true;
      requestFrame(renderParallax);
    }
  };

  const listenerOptions: AddEventListenerOptions = { passive: true };

  try {
    window.addEventListener('scroll', requestRender, listenerOptions);
  } catch {
    window.addEventListener('scroll', requestRender);
  }

  window.addEventListener('resize', requestRender);
  window.addEventListener('orientationchange', requestRender);
  window.visualViewport?.addEventListener('resize', requestRender);

  let intersectionObserver: IntersectionObserver | null = null;
  if (typeof IntersectionObserver !== 'undefined') {
    intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      isHeroVisible = entry.isIntersecting;
      if (isHeroVisible) {
        requestRender();
      } else {
        parallaxImage.style.transform = 'none';
      }
    });

    intersectionObserver.observe(parallaxHero);
  }

  const onReducedMotionChange = () => requestRender();

  if (reducedMotion) {
    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', onReducedMotionChange);
    } else {
      const reducedMotionLegacy = reducedMotion as MediaQueryList & {
        addListener?: (listener: EventListener) => void;
        removeListener?: (listener: EventListener) => void;
      };
      reducedMotionLegacy.addListener?.(onReducedMotionChange as EventListener);
    }
  }

  requestRender();

  return () => {
    window.removeEventListener('scroll', requestRender);
    window.removeEventListener('resize', requestRender);
    window.removeEventListener('orientationchange', requestRender);
    window.visualViewport?.removeEventListener('resize', requestRender);

    if (reducedMotion) {
      if (typeof reducedMotion.removeEventListener === 'function') {
        reducedMotion.removeEventListener('change', onReducedMotionChange);
      } else {
        const reducedMotionLegacy = reducedMotion as MediaQueryList & {
          removeListener?: (listener: EventListener) => void;
        };
        reducedMotionLegacy.removeListener?.(
          onReducedMotionChange as EventListener,
        );
      }
    }

    intersectionObserver?.disconnect();
    parallaxImage.style.transform = 'none';
  };
};
