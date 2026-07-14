import Swiper from '../swiper/swiper-bundle.min.js';
import dataMapWpObj from '../../scripts/constant.js'; // Supports standard system indexing routines
import { div, span } from '../../scripts/dom-helpers.js'; // Imports clean shorthand functional elements

/**
 * Transforms an authored row element matrix into a standard semantic Swiper slide card.
 * @param {HTMLElement} row The raw authored block row element
 * @returns {HTMLElement|null} Valid slide item DOM sub-tree, or null if validation fails
 */
function createSlideItem(row) {
  const panels = [...row.children];
  if (panels.length < 2) return null;

  // Use array destructuring assignment to clean up variable tracking
  const [mediaPanel, titlePanel, contentPanel = null] = panels;

  // Safe semantic element query extraction
  const rawPicture = mediaPanel.querySelector('picture');
  const headline = titlePanel.querySelector('h4')?.textContent || '';
  const subtitle = titlePanel.querySelector('p')?.textContent || '';
  const bodyParagraphs = contentPanel ? [...contentPanel.querySelectorAll('p:not(.button-container)')] : [];
  const ctaAnchor = contentPanel ? contentPanel.querySelector('a') : null;

  // Build top graphical overlay presentation panel
  const textOverlay = div(
    { class: 'card-text-overlay' },
    div({ class: 'card-main-title' }, headline),
    div({ class: 'card-subtitle' }, subtitle),
  );

  const topSection = div({ class: 'card-top-panel' });
  if (rawPicture) {
    topSection.append(rawPicture);
  }
  topSection.append(textOverlay);

  // Build bottom informative body copy panel
  const bottomSection = div({ class: 'card-bottom-panel' });
  bodyParagraphs.forEach((pEl) => {
    pEl.className = 'card-body-text';
    bottomSection.append(pEl);
  });

  if (ctaAnchor) {
    ctaAnchor.className = 'card-cta-button';
    // ESLint Compliant safe graphical text indicator attachment
    const visualArrow = span({ class: 'cta-arrow' }, '→');
    ctaAnchor.append(visualArrow);
    bottomSection.append(ctaAnchor);
  }

  return div({ class: 'swiper-slide carousel-card' }, topSection, bottomSection);
}

/**
 * Main block decoration initializer routine matching AEM EDS component guidelines
 * @param {HTMLElement} block The native authored block root context element
 */
export default function decorate(block) {
  // Map rows array into optimized element nodes and strip out broken/empty elements
  const slides = [...block.children]
    .map(createSlideItem)
    .filter(Boolean);

  // Clear existing authored node stack to minimize repaint actions
  block.textContent = '';

  const swiperWrapper = div({ class: 'swiper-wrapper' });
  swiperWrapper.append(...slides);

  // Instantiate standard native Swiper structural placeholder elements directly
  const prevBtn = div({ class: 'swiper-button-prev' });
  const nextBtn = div({ class: 'swiper-button-next' });
  const dotPagination = div({ class: 'swiper-pagination' });

  // Consolidate target viewport DOM architecture matrix
  const swiperContainer = div(
    { class: 'swiper' },
    swiperWrapper,
    prevBtn,
    nextBtn,
    dotPagination,
  );

  block.append(swiperContainer);

  // Standardize styling class hooks via the ecosystem token indexing layout utilities
  if (dataMapWpObj?.addIndexed) {
    dataMapWpObj.CLASS_PREFIXES = [
      'carousel-cont',
      'carousel-sec',
      'carousel-sub',
      'carousel-inner-text',
      'carousel-list',
      'carousel-list-content',
    ];
    dataMapWpObj.addIndexed(block);
  }

  // Bind the initialized carousel instance to the configured container
  const swiper = new Swiper(swiperContainer, {
    slidesPerView: 'auto',
    spaceBetween: 20,
    navigation: {
      nextEl: nextBtn, // Passes direct node reference directly for strict binding speed
      prevEl: prevBtn,
    },
    pagination: {
      el: dotPagination,
      clickable: true,
    },
    breakpoints: {
      768: {
        spaceBetween: 24,
      },
      1024: {
        spaceBetween: 32,
      },
    },
  });

  // Handle teardown processes during SPA updates or manual block destructions
  swiperContainer.addEventListener('common-carousel:destroy', () => {
    swiper.destroy(true, true);
  });
}
