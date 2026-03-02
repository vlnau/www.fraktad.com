export const initReviewsCarousel = async (): Promise<void> => {
  const slider = document.querySelector<HTMLElement>('.js-reviews-swiper');
  if (!slider) {
    return;
  }

  const { default: SwiperCtor } = await import('swiper/bundle');

  const nextEl = document.querySelector<HTMLElement>('.js-reviews-next');
  const prevEl = document.querySelector<HTMLElement>('.js-reviews-prev');
  const paginationEl = document.querySelector<HTMLElement>(
    '.js-reviews-pagination',
  );
  const slidesCount = slider.querySelectorAll('.swiper-slide').length;
  const desktopSlidesPerView = slidesCount >= 4 ? 3 : 2;

  new SwiperCtor(slider, {
    loop: slidesCount > 1,
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 24,
    speed: 450,
    grabCursor: true,
    autoplay:
      slidesCount > 1
        ? {
            delay: 3200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }
        : false,
    keyboard: {
      enabled: true,
    },
    navigation:
      nextEl && prevEl
        ? {
            nextEl,
            prevEl,
          }
        : undefined,
    pagination: paginationEl
      ? {
          el: paginationEl,
          clickable: true,
        }
      : undefined,
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: desktopSlidesPerView,
      },
    },
  });
};
