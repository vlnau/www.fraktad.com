import site from './site.js';

export default {
  services: {
    badge: 'Usługi',
    title: 'Projektujemy narzędzia, które pracują na Twój sukces',
    description:
      'Od szybkich stron sprzedażowych po zaawansowane systemy automatyzacji. Wykorzystaj technologie, które eliminują chaos i realnie zwiększają przychody Twojej firmy.',
  },
  process: {
    badge: 'Process',
    title: 'Proces współpracy od briefu do wdrożenia',
    description:
      'Pracujemy w krótkich etapach z jasnymi decyzjami, aby projekt szybko przechodził od pomysłu do gotowej strony.',
    cta: {
      href: '#contact',
      label: 'Chcę plan wdrożenia',
    },
    steps: [
      {
        title: 'Brief',
        description: 'Ustalamy cel projektu, ofertę i priorytety biznesowe.',
      },
      {
        title: 'Struktura',
        description:
          'Projektujemy układ strony i kolejność treści pod konwersję.',
      },
      {
        title: 'Design i dev',
        description: 'Tworzymy finalny projekt i wdrażamy go technicznie.',
      },
      {
        title: 'Publikacja',
        description:
          'Odpalamy stronę, testujemy formularze i przekazujemy dalsze kroki.',
      },
    ],
  },
  reviews: {
    title: 'Opinie klientow',
    description:
      'Krotkie konkrety bez ozdobnikow jak dziala wspolpraca i co realnie poprawia wyniki',
    cta: {
      href: '#contact',
      label: 'Sprawdź potencjał projektu',
    },
    prevAriaLabel: 'Poprzednia opinia',
    nextAriaLabel: 'Nastepna opinia',
    conversionBar: {
      title: 'Zbuduj stronę, która realnie zwiększa liczbę zapytań',
      description:
        'W 30 minut pokażemy Ci, gdzie tracisz klientów i jaki plan wdrożenia przyniesie najszybszy zwrot. Bez zobowiązań. Konkretne liczby.',
      cta: {
        href: '#contact',
        label: 'Umów bezpłatną analizę',
      },
    },
  },
  portfolio: {
    badge: 'Portfolio',
    title: 'Wybrane realizacje',
    description:
      'Projekty zaprojektowane pod decyzje klienta z naciskiem na czytelnosc strukture i szybki kontakt',
    topCta: {
      href: '#contact',
      label: 'Chcę podobny efekt',
    },
    bottomCta: {
      href: '#contact',
      label: 'Poproszę o wycenę projektu',
    },
  },
  blog: {
    badge: 'Blog',
    title: 'Praktyczne artykuly o stronach, marketingu i automatyzacjach',
    description:
      'Krotkie materialy, ktore pomoga Ci szybciej podejmowac decyzje i rozwijac firme online.',
    cta: {
      href: '/blog/',
      label: 'Czytaj i zwiększ zapytania',
    },
    postsLimit: 3,
  },
  faq: {
    badge: 'FAQ',
    title: 'Najczesciej zadawane pytania',
    description:
      'Krotkie odpowiedzi na pytania o czas realizacji, wspolprace i kolejne kroki po starcie projektu.',
    cta: {
      href: '#contact',
      label: 'Zapytaj o swój przypadek',
    },
    items: [
      {
        q: 'Ile trwa realizacja strony?',
        a: 'Standardowy projekt trwa zwykle od 10 do 14 dni roboczych, w zaleznosci od zakresu i szybkosci akceptacji materialow.',
      },
      {
        q: 'Czy pomagacie z tresciami na strone?',
        a: 'Tak, przygotowujemy strukture tresci i copy pod konwersje, aby oferta byla jasna dla klienta i prowadzila do kontaktu.',
      },
      {
        q: 'Co jest potrzebne do startu wspolpracy?',
        a: 'Na start wystarczy krotki brief o ofercie, grupie docelowej i celu strony. Reszte dopracowujemy wspolnie w pierwszym etapie.',
      },
      {
        q: 'Czy strona bedzie gotowa pod SEO i analityke?',
        a: 'Wdrazamy podstawy techniczne SEO, czytelna strukture naglowkow oraz konfiguracje zdarzen pod analityke i formularze kontaktowe.',
      },
      {
        q: 'Co dalej po publikacji strony?',
        a: 'Po wdrozeniu przekazujemy rekomendacje dalszych usprawnien i mozemy dalej rozwijac landing na podstawie danych z ruchu i zapytan.',
      },
    ],
  },
  contact: {
    badge: 'Kontakt',
    title: 'Porozmawiajmy o Twoim projekcie',
    description:
      'W krótkiej rozmowie określimy cel, potencjał wzrostu oraz jasną ścieżkę wdrożenia. Bez zbędnych etapów. Konkretne działania.',
    form: {
      fields: [
        {
          id: 'contact-name',
          name: 'name',
          label: 'Imię',
          type: 'text',
          placeholder: 'Twoje imię',
        },
        {
          id: 'contact-phone',
          name: 'phone',
          label: 'Telefon',
          type: 'tel',
          placeholder: '+48 123 123 123',
        },
        {
          id: 'contact-email',
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Adres email',
          fullWidth: true,
        },
        {
          id: 'contact-message',
          name: 'message',
          label: 'Wiadomość',
          type: 'textarea',
          rows: 5,
          placeholder: 'Opisz swój projekt',
          fullWidth: true,
        },
      ],
      submitLabel: 'Chcę bezpłatną konsultację',
      responseLabel: 'Oddzwaniamy w 24h i proponujemy konkretne kolejne kroki.',
    },
    directContactTitle: 'Bezpośredni kontakt',
    directActions: [
      {
        label: 'Telefon',
        value: site.contact.phoneDisplay,
        icon: 'fa-solid fa-phone',
        href: `tel:${site.contact.phoneRaw}`,
        external: false,
      },
      {
        label: 'WhatsApp',
        value: 'Napisz i odbierz plan',
        icon: 'fa-brands fa-whatsapp',
        href: site.contact.whatsappUrl,
        external: true,
      },
      {
        label: 'Messenger',
        value: 'Napisz i sprawdź opcje',
        icon: 'fa-brands fa-facebook-messenger',
        href: site.contact.messengerUrl,
        external: true,
      },
    ],
    availability: {
      title: 'Mamy wolne sloty na start projektu',
      description:
        'Umów rozmowę dziś i sprawdź, czy możemy ruszyć nawet w 7 dni roboczych.',
    },
  },
};
