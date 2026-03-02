interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  TURNSTILE_SECRET?: string;
}

type RequestContext = {
  request: Request;
  env: Env;
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

const MAX_LENGTH = {
  name: 120,
  phone: 40,
  email: 160,
  message: 4000,
  source: 80,
  pagePath: 200,
} as const;

const jsonResponse = (body: Record<string, unknown>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store',
    },
  });

const normalizeText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const parsePayload = async (
  request: Request,
): Promise<ContactPayload | null> => {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as Record<string, unknown>;
    return {
      name: normalizeText(body.name),
      phone: normalizeText(body.phone),
      email: normalizeText(body.email),
      message: normalizeText(body.message),
      source: normalizeText(body.source),
      pagePath: normalizeText(body.pagePath),
      website: normalizeText(body.website),
      turnstileToken: normalizeText(body.turnstileToken),
    };
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await request.formData();
    return {
      name: normalizeText(formData.get('name')),
      phone: normalizeText(formData.get('phone')),
      email: normalizeText(formData.get('email')),
      message: normalizeText(formData.get('message')),
      source: normalizeText(formData.get('source')),
      pagePath: normalizeText(formData.get('pagePath')),
      website: normalizeText(formData.get('website')),
      turnstileToken: normalizeText(formData.get('cf-turnstile-response')),
    };
  }

  return null;
};

const hasInvalidLength = (payload: ContactPayload): boolean =>
  payload.name.length > MAX_LENGTH.name ||
  payload.phone.length > MAX_LENGTH.phone ||
  payload.email.length > MAX_LENGTH.email ||
  payload.message.length > MAX_LENGTH.message ||
  payload.source.length > MAX_LENGTH.source ||
  payload.pagePath.length > MAX_LENGTH.pagePath;

const verifyTurnstileToken = async (
  token: string,
  secret: string,
  ip: string,
): Promise<boolean> => {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) {
    body.set('remoteip', ip);
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    },
  );

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
};

const getClientIp = (request: Request): string => {
  const directIp = normalizeText(request.headers.get('CF-Connecting-IP'));
  if (directIp) {
    return directIp;
  }

  const forwardedFor = normalizeText(request.headers.get('x-forwarded-for'));
  if (!forwardedFor) {
    return '';
  }

  return forwardedFor.split(',')[0]?.trim() ?? '';
};

const buildLeadMessage = (
  payload: ContactPayload,
  request: Request,
): string => {
  const lines = [
    'Nowe zapytanie z formularza kontaktowego',
    '',
    `Imię: ${payload.name}`,
    `E-mail: ${payload.email}`,
    `Telefon: ${payload.phone || '-'}`,
    '',
    'Wiadomość:',
    payload.message,
    '',
    '---',
    `Źródło formularza: ${payload.source || 'website'}`,
    `Ścieżka: ${payload.pagePath || '/'}`,
    `Referer: ${normalizeText(request.headers.get('referer')) || '-'}`,
    `User-Agent: ${normalizeText(request.headers.get('user-agent')) || '-'}`,
    `IP: ${getClientIp(request) || '-'}`,
    `Czas (UTC): ${new Date().toISOString()}`,
  ];

  return lines.join('\n');
};

const parseResendError = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as {
      message?: string;
      error?: { message?: string };
    };

    return data.message || data.error?.message || '';
  } catch {
    try {
      return await response.text();
    } catch {
      return '';
    }
  }
};

export const onRequestOptions = async (): Promise<Response> =>
  new Response(null, {
    status: 204,
    headers: { allow: 'POST, OPTIONS' },
  });

export const onRequestPost = async ({
  request,
  env,
}: RequestContext): Promise<Response> => {
  let payload: ContactPayload | null = null;
  try {
    payload = await parsePayload(request);
  } catch {
    return jsonResponse(
      { ok: false, message: 'Niepoprawne dane formularza.' },
      400,
    );
  }

  if (!payload) {
    return jsonResponse(
      { ok: false, message: 'Nieobsługiwany typ danych formularza.' },
      415,
    );
  }

  if (payload.website) {
    return jsonResponse({
      ok: true,
      message: 'Dziękujemy! Odezwiemy się w ciągu 24h.',
    });
  }

  if (!payload.name || !payload.email || !payload.message) {
    return jsonResponse(
      { ok: false, message: 'Uzupełnij wymagane pola formularza.' },
      400,
    );
  }

  if (!isValidEmail(payload.email)) {
    return jsonResponse(
      { ok: false, message: 'Podaj poprawny adres e-mail.' },
      400,
    );
  }

  if (hasInvalidLength(payload)) {
    return jsonResponse(
      { ok: false, message: 'Niektóre pola mają zbyt długą wartość.' },
      400,
    );
  }

  const turnstileSecret = normalizeText(env.TURNSTILE_SECRET);
  if (turnstileSecret) {
    if (!payload.turnstileToken) {
      return jsonResponse(
        { ok: false, message: 'Potwierdź, że nie jesteś botem.' },
        400,
      );
    }

    const isTurnstileValid = await verifyTurnstileToken(
      payload.turnstileToken,
      turnstileSecret,
      getClientIp(request),
    );
    if (!isTurnstileValid) {
      return jsonResponse(
        { ok: false, message: 'Weryfikacja captcha nie powiodła się.' },
        400,
      );
    }
  }

  const resendApiKey = normalizeText(env.RESEND_API_KEY);
  const contactToEmail = normalizeText(env.CONTACT_TO_EMAIL);
  const contactFromEmail = normalizeText(env.CONTACT_FROM_EMAIL);

  if (!resendApiKey || !contactToEmail || !contactFromEmail) {
    return jsonResponse(
      {
        ok: false,
        message:
          'Integracja formularza nie została skonfigurowana (RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL).',
      },
      500,
    );
  }

  const subjectSuffix = payload.source ? ` (${payload.source})` : '';
  const resendPayload = {
    from: contactFromEmail,
    to: [contactToEmail],
    subject: `Nowe zapytanie ze strony${subjectSuffix}`,
    text: buildLeadMessage(payload, request),
    reply_to: payload.email,
  };

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${resendApiKey}`,
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(resendPayload),
  });

  if (!resendResponse.ok) {
    const resendErrorMessage = await parseResendError(resendResponse);
    const details = resendErrorMessage ? ` (${resendErrorMessage})` : '';

    return jsonResponse(
      {
        ok: false,
        message: `Nie udało się wysłać wiadomości e-mail${details}.`,
      },
      502,
    );
  }

  return jsonResponse({
    ok: true,
    message: 'Dziękujemy! Odezwiemy się w ciągu 24h.',
  });
};
