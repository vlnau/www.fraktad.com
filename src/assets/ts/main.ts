import {
  initializeModules,
  type ModuleDefinition,
} from './core/module-runner.js';
import { initContactForms } from './modules/contact-forms.js';
import { initCookieConsent } from './modules/cookie-consent.js';
import { initCurrentYear } from './modules/current-year.js';
import { initHeroContactModal } from './modules/hero-contact-modal.js';
import { initHeroSceneFloat } from './modules/hero-scene-float.js';
import { initHeroSitesCarousel } from './modules/hero-sites-carousel.js';
import { initMobileNavMenu } from './modules/mobile-nav-menu.js';
import { initNavActiveLink } from './modules/nav-active-link.js';
import { initParallaxModule } from './modules/parallax-module.js';
import { initReviewsCarousel } from './modules/reviews-carousel.js';
import { initSiteUiShell } from './modules/site-ui-shell.js';

const modules: ModuleDefinition[] = [
  { id: 'current-year', init: initCurrentYear },
  { id: 'cookie-consent', init: initCookieConsent },
  { id: 'contact-forms', init: initContactForms },
  { id: 'site-ui-shell', init: initSiteUiShell },
  { id: 'mobile-nav-menu', init: initMobileNavMenu },
  { id: 'nav-active-link', init: initNavActiveLink },
  { id: 'hero-parallax', init: initParallaxModule },
  { id: 'reviews-carousel', init: initReviewsCarousel },
  { id: 'hero-sites-carousel', init: initHeroSitesCarousel },
  { id: 'hero-scene-float', init: initHeroSceneFloat },
  { id: 'hero-contact-modal', init: initHeroContactModal },
];

void initializeModules(modules);
