export const initHeroSceneFloat = (): void => {
  const scenes = document.querySelectorAll<HTMLElement>('.js-hero-scene');
  if (!scenes.length) {
    return;
  }

  const reducedMotion =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  if (reducedMotion) {
    scenes.forEach((scene) => {
      scene.style.translate = '0 0';
    });
    return;
  }

  const cycleMs = 7000;
  let amplitudePx = 0;
  let baseOffsetPx = 0;

  const updateAmplitude = () => {
    const rootFontPx = Number.parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    );
    const safeRootFontPx = Number.isFinite(rootFontPx) ? rootFontPx : 16;
    amplitudePx = safeRootFontPx * 0.5;
    baseOffsetPx = safeRootFontPx * 0.18;
  };

  updateAmplitude();
  window.addEventListener('resize', updateAmplitude);
  window.addEventListener('orientationchange', updateAmplitude);

  const startTime = performance.now();
  const animate = (now: number) => {
    const phase = ((now - startTime) / cycleMs) * Math.PI * 2;
    const translateY = Math.sin(phase) * amplitudePx + baseOffsetPx;
    const translateValue = `0 ${translateY.toFixed(2)}px`;

    scenes.forEach((scene) => {
      scene.style.translate = translateValue;
    });

    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);
};
