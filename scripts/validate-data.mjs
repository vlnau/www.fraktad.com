import aboutCards from '../src/_data/aboutCards.js';
import homeHero from '../src/_data/homeHero.js';
import homeSections from '../src/_data/homeSections.js';
import reviews from '../src/_data/reviews.js';
import serviceCards from '../src/_data/serviceCards.js';
import services from '../src/_data/services.js';
import site from '../src/_data/site.js';

const fail = (message) => {
  console.error(`Data validation failed: ${message}`);
  process.exitCode = 1;
};

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

if (!Array.isArray(services) || services.length === 0) {
  fail('`services` must be a non-empty array.');
}

const slugs = new Set();

for (const [index, service] of services.entries()) {
  const context = `services[${index}]`;

  if (!isNonEmptyString(service.slug)) {
    fail(`${context}.slug is required.`);
    continue;
  }

  if (slugs.has(service.slug)) {
    fail(`Duplicate service slug: "${service.slug}".`);
  } else {
    slugs.add(service.slug);
  }

  if (
    !service.seo ||
    !isNonEmptyString(service.seo.title) ||
    !isNonEmptyString(service.seo.description)
  ) {
    fail(`${context}.seo.title and ${context}.seo.description are required.`);
  }

  if (
    !service.hero ||
    !isNonEmptyString(service.hero.headline) ||
    !isNonEmptyString(service.hero.lead)
  ) {
    fail(`${context}.hero.headline and ${context}.hero.lead are required.`);
  }

  const heroHasImage =
    service.hero &&
    service.hero.image &&
    isNonEmptyString(service.hero.image.src) &&
    isNonEmptyString(service.hero.image.alt);

  const heroHasChecklist =
    service.hero &&
    service.hero.checklist &&
    isNonEmptyString(service.hero.checklist.title) &&
    Array.isArray(service.hero.checklist.items) &&
    service.hero.checklist.items.length > 0;

  if (!heroHasImage && !heroHasChecklist) {
    fail(
      `${context}.hero must contain either valid image data or checklist data.`,
    );
  }

  if (!Array.isArray(service.outcomes) || service.outcomes.length < 3) {
    fail(`${context}.outcomes should contain at least 3 items.`);
  }

  if (!Array.isArray(service.included) || service.included.length < 4) {
    fail(`${context}.included should contain at least 4 items.`);
  }

  if (!Array.isArray(service.process) || service.process.length < 4) {
    fail(`${context}.process should contain at least 4 steps.`);
  }

  if (!Array.isArray(service.faq) || service.faq.length < 3) {
    fail(`${context}.faq should contain at least 3 items.`);
  }

  if (
    !service.cta ||
    !isNonEmptyString(service.cta.title) ||
    !isNonEmptyString(service.cta.label)
  ) {
    fail(`${context}.cta.title and ${context}.cta.label are required.`);
  }
}

if (!site || !isNonEmptyString(site.name) || !isNonEmptyString(site.url)) {
  fail('`site.name` and `site.url` are required.');
}

if (
  !site.contact ||
  !isNonEmptyString(site.contact.phoneRaw) ||
  !isNonEmptyString(site.contact.email)
) {
  fail('`site.contact.phoneRaw` and `site.contact.email` are required.');
}

if (
  !site.navigation ||
  !Array.isArray(site.navigation.main) ||
  site.navigation.main.length < 2
) {
  fail('`site.navigation.main` should contain at least 2 links.');
}

if (!Array.isArray(serviceCards) || serviceCards.length < 4) {
  fail('`serviceCards` should contain at least 4 cards.');
} else {
  for (const [index, card] of serviceCards.entries()) {
    const context = `serviceCards[${index}]`;
    if (!isNonEmptyString(card.href) || !isNonEmptyString(card.badgeLabel)) {
      fail(`${context}.href and ${context}.badgeLabel are required.`);
    }
    if (!Array.isArray(card.titleLines) || card.titleLines.length < 1) {
      fail(`${context}.titleLines should contain at least one title line.`);
    }
  }
}

if (!Array.isArray(reviews) || reviews.length < 3) {
  fail('`reviews` should contain at least 3 items.');
} else {
  for (const [index, review] of reviews.entries()) {
    const context = `reviews[${index}]`;
    if (!isNonEmptyString(review.name) || !isNonEmptyString(review.quote)) {
      fail(`${context}.name and ${context}.quote are required.`);
    }
    if (!isNonEmptyString(review.image) || !isNonEmptyString(review.imageAlt)) {
      fail(`${context}.image and ${context}.imageAlt are required.`);
    }
  }
}

if (!Array.isArray(aboutCards) || aboutCards.length < 3) {
  fail('`aboutCards` should contain at least 3 items.');
}

if (
  !homeHero ||
  !isNonEmptyString(homeHero.headline) ||
  !isNonEmptyString(homeHero.lead)
) {
  fail('`homeHero.headline` and `homeHero.lead` are required.');
}

if (
  !homeHero ||
  !homeHero.socialProof ||
  !isNonEmptyString(homeHero.socialProof.label) ||
  !Array.isArray(homeHero.socialProof.clients) ||
  homeHero.socialProof.clients.length < 1
) {
  fail(
    '`homeHero.socialProof.label` and at least one social proof client are required.',
  );
} else {
  for (const [index, client] of homeHero.socialProof.clients.entries()) {
    const context = `homeHero.socialProof.clients[${index}]`;
    if (
      !isNonEmptyString(client.imageSrc) ||
      !isNonEmptyString(client.imageAlt)
    ) {
      fail(`${context}.imageSrc and ${context}.imageAlt are required.`);
    }
  }
}

if (
  !homeHero ||
  !homeHero.primaryCta ||
  !isNonEmptyString(homeHero.primaryCta.href) ||
  !isNonEmptyString(homeHero.primaryCta.label)
) {
  fail(
    '`homeHero.primaryCta.href` and `homeHero.primaryCta.label` are required.',
  );
}

if (
  !homeHero ||
  !Array.isArray(homeHero.contactActions) ||
  homeHero.contactActions.length < 3
) {
  fail('`homeHero.contactActions` should contain at least 3 actions.');
} else {
  for (const [index, action] of homeHero.contactActions.entries()) {
    const context = `homeHero.contactActions[${index}]`;
    if (
      !isNonEmptyString(action.type) ||
      !isNonEmptyString(action.label) ||
      !isNonEmptyString(action.icon) ||
      !isNonEmptyString(action.href)
    ) {
      fail(`${context}.type, .label, .icon and .href are required.`);
    }
  }
}

if (!isNonEmptyString(homeHero?.responseTimeLabel)) {
  fail('`homeHero.responseTimeLabel` is required.');
}

if (
  !homeSections ||
  !homeSections.services ||
  !isNonEmptyString(homeSections.services.title) ||
  !isNonEmptyString(homeSections.services.description)
) {
  fail('`homeSections.services.title` and `.description` are required.');
}

if (
  !homeSections ||
  !homeSections.process ||
  !isNonEmptyString(homeSections.process.title) ||
  !Array.isArray(homeSections.process.steps) ||
  homeSections.process.steps.length < 4
) {
  fail('`homeSections.process` with at least 4 steps is required.');
} else {
  for (const [index, step] of homeSections.process.steps.entries()) {
    const context = `homeSections.process.steps[${index}]`;
    if (!isNonEmptyString(step.title) || !isNonEmptyString(step.description)) {
      fail(`${context}.title and ${context}.description are required.`);
    }
  }
}

if (
  !homeSections ||
  !homeSections.reviews ||
  !isNonEmptyString(homeSections.reviews.title) ||
  !homeSections.reviews.conversionBar ||
  !isNonEmptyString(homeSections.reviews.conversionBar.title)
) {
  fail('`homeSections.reviews` and `conversionBar.title` are required.');
}

if (
  !homeSections ||
  !homeSections.portfolio ||
  !isNonEmptyString(homeSections.portfolio.title) ||
  !homeSections.portfolio.topCta ||
  !isNonEmptyString(homeSections.portfolio.topCta.label)
) {
  fail('`homeSections.portfolio` with `topCta.label` is required.');
}

if (
  !homeSections ||
  !homeSections.blog ||
  !isNonEmptyString(homeSections.blog.title) ||
  !homeSections.blog.cta ||
  !isNonEmptyString(homeSections.blog.cta.href)
) {
  fail('`homeSections.blog` with valid `cta.href` is required.');
}

if (
  !homeSections ||
  !homeSections.faq ||
  !Array.isArray(homeSections.faq.items) ||
  homeSections.faq.items.length < 3
) {
  fail('`homeSections.faq.items` should contain at least 3 entries.');
} else {
  for (const [index, item] of homeSections.faq.items.entries()) {
    const context = `homeSections.faq.items[${index}]`;
    if (!isNonEmptyString(item.q) || !isNonEmptyString(item.a)) {
      fail(`${context}.q and ${context}.a are required.`);
    }
  }
}

if (
  !homeSections ||
  !homeSections.contact ||
  !isNonEmptyString(homeSections.contact.title) ||
  !homeSections.contact.form ||
  !Array.isArray(homeSections.contact.form.fields) ||
  homeSections.contact.form.fields.length < 3
) {
  fail('`homeSections.contact` and at least 3 form fields are required.');
} else {
  for (const [index, field] of homeSections.contact.form.fields.entries()) {
    const context = `homeSections.contact.form.fields[${index}]`;
    if (
      !isNonEmptyString(field.id) ||
      !isNonEmptyString(field.name) ||
      !isNonEmptyString(field.label) ||
      !isNonEmptyString(field.type) ||
      !isNonEmptyString(field.placeholder)
    ) {
      fail(
        `${context}.id, .name, .label, .type and .placeholder are required.`,
      );
    }
  }
}

if (
  !homeSections ||
  !homeSections.contact ||
  !Array.isArray(homeSections.contact.directActions) ||
  homeSections.contact.directActions.length < 3
) {
  fail('`homeSections.contact.directActions` should contain at least 3 items.');
} else {
  for (const [index, action] of homeSections.contact.directActions.entries()) {
    const context = `homeSections.contact.directActions[${index}]`;
    if (
      !isNonEmptyString(action.label) ||
      !isNonEmptyString(action.value) ||
      !isNonEmptyString(action.icon) ||
      !isNonEmptyString(action.href)
    ) {
      fail(`${context}.label, .value, .icon and .href are required.`);
    }
  }
}

if (process.exitCode === 1) {
  process.exit(process.exitCode);
}

console.log(
  `Data validation passed: ${services.length} services, ${serviceCards.length} service cards, ${reviews.length} reviews, ${homeHero.contactActions.length} hero actions, ${homeSections.process.steps.length} process steps, ${homeSections.faq.items.length} FAQ items, ${homeSections.contact.form.fields.length} contact form fields checked.`,
);
