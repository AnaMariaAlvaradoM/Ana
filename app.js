const header = document.querySelector('.site-header');
const menuButton = document.querySelector('#menuButton');
const mobileMenu = document.querySelector('#mobileMenu');
const scrollProgress = document.querySelector('#scrollProgress');
const currentYear = document.querySelector('#currentYear');
const contactForm = document.querySelector('.contact-form');

header?.classList.add('is-enhanced');

const setMenuState = (open) => {
  if (!menuButton || !mobileMenu) return;

  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileMenu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
};

menuButton?.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  setMenuState(willOpen);

  if (willOpen) {
    mobileMenu?.querySelector('a')?.focus();
  }
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenuState(false);
    menuButton.focus();
  }
});

const desktopBreakpoint = window.matchMedia('(min-width: 861px)');
const closeMenuOnDesktop = (event) => {
  if (event.matches) setMenuState(false);
};

desktopBreakpoint.addEventListener('change', closeMenuOnDesktop);

let progressTicking = false;

const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress?.style.setProperty('transform', `scaleX(${Math.min(1, Math.max(0, progress))})`);
  progressTicking = false;
};

window.addEventListener(
  'scroll',
  () => {
    if (!progressTicking) {
      window.requestAnimationFrame(updateScrollProgress);
      progressTicking = true;
    }
  },
  { passive: true },
);

updateScrollProgress();

const sectionLinks = [...document.querySelectorAll('.desktop-nav a')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      sectionLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${visibleEntry.target.id}`;
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-30% 0px -58%', threshold: [0, 0.15, 0.4] },
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

contactForm?.addEventListener('submit', () => {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  if (!submitButton) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Enviando…';
});

window.addEventListener('pageshow', () => {
  const submitButton = contactForm?.querySelector('button[type="submit"]');
  if (!submitButton) return;

  submitButton.disabled = false;
  submitButton.innerHTML = 'Enviar mensaje <span aria-hidden="true">→</span>';
});
