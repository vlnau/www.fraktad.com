const siteUrl = 'https://fraktad.com';
const contact = {
  phoneDisplay: '+48 668 295 097',
  phoneRaw: '+48668295097',
  email: 'fraktad@gmail.com',
  whatsappUrl: 'https://wa.me/48668295097',
  messengerUrl: 'https://m.me/fraktad',
};
const socialLinks = [
  {
    href: contact.whatsappUrl,
    icon: 'fa-brands fa-whatsapp',
    label: 'WhatsApp',
    external: true,
  },
  {
    href: contact.messengerUrl,
    icon: 'fa-brands fa-facebook-messenger',
    label: 'Messenger',
    external: true,
  },
  {
    href: `mailto:${contact.email}`,
    icon: 'fa-solid fa-envelope',
    label: 'E-mail',
    external: false,
  },
];
const integrations = {
  turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '',
  ga4MeasurementId: process.env.GA4_MEASUREMENT_ID || '',
  googleTagManagerId: process.env.GOOGLE_TAG_MANAGER_ID || '',
};

export default {
  name: 'Fraktad',
  url: siteUrl,
  language: 'pl',
  locale: 'pl_PL',
  defaultTitle: 'Fraktad',
  defaultDescription:
    'Projektujemy strony, sklepy i systemy dla firm, które chcą zwiększać liczbę zapytań i porządkować procesy.',
  defaultOgImage: '/assets/images/hero-bg.png',
  organization: {
    legalName: 'Fraktad',
    logo: '/assets/images/logotype.svg',
  },
  labels: {
    callUs: 'Zadzwoń teraz',
    contactUs: 'Bezpłatna konsultacja',
  },
  contact,
  navigation: {
    main: [
      { href: '/about/', label: 'O nas' },
      { href: '/blog/', label: 'Blog' },
      { href: '/contact/', label: 'Kontakt' },
    ],
    footerCompany: [
      { href: '/about/', label: 'O nas' },
      { href: '/#services', label: 'Usługi' },
      { href: '/#process', label: 'Proces' },
      { href: '/contact/', label: 'Kontakt' },
    ],
    footerServices: [
      { href: '/landing-konwersyjny/', label: 'Landing page' },
      { href: '/strona-firmowa/', label: 'Strony firmowe' },
      { href: '/integracje-i-automatyzacja/', label: 'Automatyzacje' },
      { href: '/marketing-i-skalowanie/', label: 'Kampanie reklamowe' },
    ],
    legal: [
      { href: '/polityka-prywatnosci/', label: 'Polityka prywatności' },
      { href: '/regulamin/', label: 'Regulamin' },
      { href: '/rodo/', label: 'RODO' },
    ],
  },
  integrations,
  socialLinks,
};
