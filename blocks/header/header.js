import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import dataMapWpObj from '../../scripts/constant.js';
import {
  button, div, img, input, span, ul,
} from '../../scripts/dom-helpers.js';

// Desktop layout media query watcher
export const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Toggles ARIA expand states across navigation section list items
 * @param {Element} sections The nav-sections container element
 * @param {boolean} expanded Desired expansion state
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.default-content-wrapper > ul > li').forEach((item) => {
    item.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });
}

/**
 * Handles Escape key press to collapse mobile or active navigation dropdowns
 * @param {KeyboardEvent} e Keyboard event object
 */
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;

    if (isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
      const btn = nav.querySelector('.nav-hamburger button');
      if (btn) btn.focus();
    }
  }
}

/**
 * Toggles the main navigation drawer state for small viewports
 * @param {Element} nav Main <nav> container element
 * @param {Element} navSections Navigation sections container
 * @param {boolean|null} forceExpanded Explicit expand state override
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav) return;
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburgerBtn = nav.querySelector('.nav-hamburger button');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, !expanded && !isDesktop.matches);

  if (hamburgerBtn) {
    hamburgerBtn.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * Programmatically decorates or constructs the search block inside .navbrand-cont2
 * @param {Element} navBrand The brand container block element
 */
function decorateHeaderSearch(navBrand) {
  if (!navBrand) return;

  let searchWrapper = navBrand.querySelector('.search-wrapper')
    || navBrand.querySelector('.navbrand-cont2');

  // If container does not exist, create it dynamically
  if (!searchWrapper) {
    searchWrapper = div({ class: 'search-wrapper comlist navbrand-cont2' });
    navBrand.append(searchWrapper);
  }

  let searchBlock = searchWrapper.querySelector('.search.block');
  if (!searchBlock) {
    const searchIconImg = img({
      src: `${window.hlx?.codeBasePath || ''}/icons/search.svg`,
      alt: 'Search Icon',
      loading: 'lazy',
      width: '16',
      height: '16',
      'data-icon-name': 'search',
      class: 'comlist navbrand-list1',
    });

    const searchIconSpan = span(
      { class: 'icon icon-search comlist navbrand-inner-net1' },
      searchIconImg,
    );

    const searchInputField = input({
      type: 'search',
      class: 'search-input comlist navbrand-inner-net2',
      placeholder: 'Search...',
      'aria-label': 'Search...',
    });

    const searchBox = div(
      { class: 'search-box comlist navbrand-sub1' },
      searchIconSpan,
      searchInputField,
    );

    const searchResults = ul({
      class: 'search-results comlist navbrand-sub2',
      'data-h': 'H2',
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    });

    searchBlock = div(
      { class: 'search block comlist navbrand-sec1', 'data-block-name': 'search', 'data-block-status': 'loaded' },
      searchBox,
      searchResults,
    );

    searchWrapper.textContent = '';
    searchWrapper.append(searchBlock);
  }

  // Attach search input events
  const inputEl = searchBlock.querySelector('input.search-input');
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = inputEl.value.trim();
        if (query) {
          window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }
}

/**
 * Loads and decorates the header component block
 * @param {Element} block Header block element
 */
export default async function decorate(block) {
  // Load navigation fragment asynchronously
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }

  // Classify nav section modules
  const sectionClasses = ['brand', 'sections', 'tools'];
  sectionClasses.forEach((cls, idx) => {
    const section = nav.children[idx];
    if (section) section.classList.add(`nav-${cls}`);
  });

  // --- 1. Brand & Integrated Search ---
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    // Construct/decorate search block in .navbrand-cont2
    decorateHeaderSearch(navBrand);

    // Apply dataMapWpObj indexing rules across brand sub-tree
    if (typeof dataMapWpObj !== 'undefined' && dataMapWpObj.addIndexed) {
      dataMapWpObj.CLASS_PREFIXES = [
        'navbrand-cont',
        'navbrand-sec',
        'navbrand-sub',
        'navbrand-inner-net',
        'navbrand-list',
        'navbrand-list-content',
      ];
      dataMapWpObj.addIndexed(navBrand);
    }

    // Bind logo home redirect listener to logo container strictly (.navbrand-sec1)
    const logoContainer = navBrand.querySelector('.navbrand-cont1 .navbrand-sec1')
      || navBrand.querySelector('.navbrand-sec1');
    if (logoContainer) {
      logoContainer.style.cursor = 'pointer';
      logoContainer.addEventListener('click', (e) => {
        // Prevent click events inside search box from triggering redirection
        if (!e.target.closest('.search-wrapper')) {
          window.location.href = window.location.origin;
        }
      });
    }
  }

  // --- 2. Navigation Links Section ---
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const navItems = navSections.querySelectorAll(':scope .default-content-wrapper > ul > li');
    navItems.forEach((navItem, idx) => {
      if (idx === 0) navItem.classList.add('active');

      navItem.addEventListener('click', () => {
        navItems.forEach((el) => el.classList.remove('active'));
        navItem.classList.add('active');
      });
    });

    if (typeof dataMapWpObj !== 'undefined' && dataMapWpObj.addIndexed) {
      dataMapWpObj.CLASS_PREFIXES = [
        'nav-sec-cont',
        'nav-sec-sec',
        'nav-sec-sub',
        'nav-sec-inner-text',
      ];
      dataMapWpObj.addIndexed(navSections);
    }
  }

  // --- 3. Tools / CTA Button Section ---
  const navTools = nav.querySelector('.nav-tools');
  if (navTools && typeof dataMapWpObj !== 'undefined' && dataMapWpObj.addIndexed) {
    dataMapWpObj.CLASS_PREFIXES = [
      'nav-tools-cont',
      'nav-tools-sec',
      'nav-tools-sub',
      'nav-tools-inner-net',
    ];
    dataMapWpObj.addIndexed(navTools);
  }

  // --- 4. Mobile Hamburger Controls ---
  const hamburger = div(
    { class: 'nav-hamburger' },
    button(
      { type: 'button', 'aria-controls': 'nav', 'aria-label': 'Open navigation' },
      span({ class: 'nav-hamburger-icon' }),
    ),
  );

  hamburger.addEventListener('click', () => {
    toggleMenu(nav, navSections);
  });

  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = div({ class: 'nav-wrapper' }, nav);
  block.append(navWrapper);
}
