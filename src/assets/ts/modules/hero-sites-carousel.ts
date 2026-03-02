export const initHeroSitesCarousel = (): void => {
  const carousels = document.querySelectorAll<HTMLElement>(
    '.js-hero-sites-carousel',
  );
  if (!carousels.length) {
    return;
  }

  carousels.forEach((carousel) => {
    const slides = Array.from(
      carousel.querySelectorAll<HTMLElement>('.js-hero-sites-slide'),
    );
    if (slides.length < 2) {
      return;
    }

    const showSlide = (slide: HTMLElement) => {
      slide.classList.remove('opacity-0', 'pointer-events-none');
      slide.classList.add('opacity-100', 'z-10', 'pointer-events-auto');
    };

    const hideSlide = (slide: HTMLElement) => {
      slide.classList.remove('opacity-100', 'z-10', 'pointer-events-auto');
      slide.classList.add('opacity-0', 'pointer-events-none');
    };

    let activeIndex = slides.findIndex((slide) =>
      slide.classList.contains('opacity-100'),
    );

    if (activeIndex < 0) {
      activeIndex = 0;
      slides.forEach((slide, index) => {
        if (index === activeIndex) {
          showSlide(slide);
        } else {
          hideSlide(slide);
        }
      });
    }

    window.setInterval(() => {
      const activeSlide = slides[activeIndex];
      if (activeSlide) {
        hideSlide(activeSlide);
      }

      activeIndex = (activeIndex + 1) % slides.length;
      const nextSlide = slides[activeIndex];
      if (nextSlide) {
        showSlide(nextSlide);
      }
    }, 4000);
  });
};
