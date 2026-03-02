import site from './site.js';

export default {
  socialProof: {
    label: 'Zaufało nam 20+ firm',
    clients: [
      {
        imageSrc: '/assets/images/avatars/avatar-1.svg',
        imageAlt: 'Właścicielka firmy usługowej',
      },
      {
        imageSrc: '/assets/images/avatars/avatar-2.svg',
        imageAlt: 'Właściciel startupu technologicznego',
      },
      {
        imageSrc: '/assets/images/avatars/avatar-3.svg',
        imageAlt: 'Menedżerka projektu e-commerce',
      },
    ],
  },
  headline: 'Budujemy strony, sklepy online i aplikacje dla MŚP',
  lead: 'Przejmujemy technologię, żebyś mógł skupić się na biznesie.',
  primaryCta: {
    href: '#contact',
    label: 'Umów bezpłatną konsultację (30 min)',
  },
  contactActions: [
    {
      type: 'phone',
      label: 'Zadzwoń teraz',
      ariaLabel: 'Zadzwoń teraz',
      icon: 'fa-solid fa-phone',
      href: `tel:${site.contact.phoneRaw}`,
      external: false,
    },
    {
      type: 'social',
      label: 'Napisz na WhatsApp',
      ariaLabel: 'Napisz na WhatsApp',
      icon: 'fa-brands fa-whatsapp',
      href: site.contact.whatsappUrl,
      external: true,
    },
    {
      type: 'social',
      label: 'Napisz na Messenger',
      ariaLabel: 'Napisz na Messenger',
      icon: 'fa-brands fa-facebook-messenger',
      href: site.contact.messengerUrl,
      external: true,
    },
  ],
  responseTimeLabel: 'Odpowiadamy w 24h z konkretnym planem działań.',
};
