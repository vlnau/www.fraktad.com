type ContactApiResponse = {
  ok?: boolean;
  message?: string;
};

type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  pagePath: string;
  website: string;
  turnstileToken: string;
};

const CONTACT_ENDPOINT = '/api/contact';

const readStringValue = (value: FormDataEntryValue | null): string =>
  typeof value === 'string' ? value.trim() : '';

const setStatusMessage = (
  statusElement: HTMLElement | null,
  message: string,
  tone: 'success' | 'error',
): void => {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.hidden = false;
  statusElement.classList.remove('hidden');
  statusElement.classList.remove('text-brand-ink', 'text-brand-orange');
  statusElement.classList.add(
    tone === 'success' ? 'text-brand-ink' : 'text-brand-orange',
  );
};

const buildPayload = (
  form: HTMLFormElement,
  formData: FormData,
): ContactPayload => ({
  name: readStringValue(formData.get('name')),
  phone: readStringValue(formData.get('phone')),
  email: readStringValue(formData.get('email')),
  message: readStringValue(formData.get('message')),
  source: form.dataset.contactSource ?? 'website',
  pagePath: window.location.pathname,
  website: readStringValue(formData.get('website')),
  turnstileToken: readStringValue(formData.get('cf-turnstile-response')),
});

const submitContactForm = async (form: HTMLFormElement): Promise<void> => {
  const statusElement = form.querySelector<HTMLElement>(
    '[data-contact-form-status]',
  );
  const submitButtons = Array.from(
    form.querySelectorAll<HTMLButtonElement>('button[type="submit"]'),
  );

  if (statusElement) {
    statusElement.hidden = true;
    statusElement.classList.add('hidden');
    statusElement.textContent = '';
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (form.dataset.submitting === 'true') {
    return;
  }

  const formData = new FormData(form);
  const payload = buildPayload(form, formData);

  form.dataset.submitting = 'true';
  form.setAttribute('aria-busy', 'true');
  submitButtons.forEach((button) => {
    button.disabled = true;
  });

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let responseData: ContactApiResponse | null = null;
    try {
      responseData = (await response.json()) as ContactApiResponse;
    } catch {
      responseData = null;
    }

    if (!response.ok || !responseData?.ok) {
      throw new Error(
        responseData?.message ?? 'Nie udało się wysłać formularza.',
      );
    }

    form.reset();
    setStatusMessage(
      statusElement,
      responseData.message ?? 'Dziękujemy, odezwiemy się w ciągu 24h.',
      'success',
    );
  } catch (error) {
    const fallbackMessage =
      error instanceof Error
        ? error.message
        : 'Wystąpił błąd. Spróbuj ponownie za chwilę.';
    setStatusMessage(statusElement, fallbackMessage, 'error');
  } finally {
    form.dataset.submitting = 'false';
    form.removeAttribute('aria-busy');
    submitButtons.forEach((button) => {
      button.disabled = false;
    });
  }
};

export const initContactForms = (): (() => void) | void => {
  const forms = Array.from(
    document.querySelectorAll<HTMLFormElement>('[data-contact-form]'),
  );
  if (!forms.length) {
    return;
  }

  const listeners = forms.map((form) => {
    const onSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      void submitContactForm(form);
    };
    form.addEventListener('submit', onSubmit);
    return { form, onSubmit };
  });

  return () => {
    listeners.forEach(({ form, onSubmit }) => {
      form.removeEventListener('submit', onSubmit);
    });
  };
};
