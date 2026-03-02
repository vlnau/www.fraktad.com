export const initCurrentYear = (): void => {
  const currentYear = document.querySelector<HTMLElement>('[data-year]');
  if (!currentYear) {
    return;
  }

  currentYear.textContent = new Date().getFullYear().toString();
};
