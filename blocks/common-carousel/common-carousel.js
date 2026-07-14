import Swiper from '../swiper/swiper-bundle.min.js';
import dataMapWpObj from '../../scripts/constant.js';
import { div } from '../../scripts/dom-helpers.js';

/**
 * Decorates the common-carousel block into a responsive Swiper layout
 * @param {HTMLElement} block The authored block element container
 */
export default function decorate(block) {
  const rows = [...block.children];
  const slides = [];

  rows.forEach((row) => {
    const panels = [...row.children];
    if (panels.length >= 2) {
      const mediaPanel = panels[0];
      const titlePanel = panels[1];
      const contentPanel = panels[2] || null;

      // Extract semantic details safely
      const rawPicture = mediaPanel.querySelector('picture');
      const headline = titlePanel.querySelector('h4')?.textContent || '';
      const subtitle = titlePanel.querySelector('p')?.textContent || '';
      const bodyParagraphs = contentPanel ? [...contentPanel.querySelectorAll('p:not(.button-container)')] : [];
      const ctaAnchor = contentPanel ? contentPanel.querySelector('a') : null;

      // Build out slide semantic DOM tree nodes
      const slideItem = div({ class: 'swiper-slide carousel-card' });

      // Top graphical section panel
      const topSection = div({ class: 'card-top-panel' });
      if (rawPicture) {
        topSection.append(rawPicture);
      }

      const textOverlay = div(
        { class: 'card-text-overlay' },
        div({ class: 'card-main-title' }, headline),
        div({ class: 'card-subtitle' }, subtitle),
      );
      topSection.append(textOverlay);

      // Bottom information copy section panel
      const bottomSection = div({ class: 'card-bottom-panel' });
      bodyParagraphs.forEach((pEl) => {
        pEl.className = 'card-body-text';
        bottomSection.append(pEl);
      });

      if (ctaAnchor) {
        ctaAnchor.className = 'card-cta-button';
        // Append graphic inline arrow wrapper hook matching layout design parameters
        const visualArrow = document.createElement('span');
        visualArrow.className = 'cta-arrow';
        visualArrow.innerHTML = '&rarr;';
        ctaAnchor.append(visualArrow);
        bottomSection.append(ctaAnchor);
      }

      slideItem.append(topSection, bottomSection);
      slides.push(slideItem);
    }
  });

  // Re-write component DOM element container context into Swiper structure wrapper nodes
  block.textContent = '';

  const swiperWrapper = div({ class: 'swiper-wrapper' });
  swiperWrapper.append(...slides);

  const swiperContainer = div({ class: 'swiper' }, swiperWrapper);

  // Interface Navigation Controllers Matrix Elements setup
  const prevBtn = div({ class: 'swiper-button-prev custom-nav-arrow' });
  prevBtn.innerHTML = '&#8592;'; // Left Unicode Arrow (←)

  const nextBtn = div({ class: 'swiper-button-next custom-nav-arrow' });
  nextBtn.innerHTML = '&#8594;'; // Right Unicode Arrow (→)

  const dotPagination = div({ class: 'swiper-pagination custom-dots-indicator' });

  const controlsContainer = div(
    { class: 'carousel-controls-container' },
    prevBtn,
    dotPagination,
    nextBtn,
  );

  swiperContainer.append(controlsContainer);
  block.append(swiperContainer);

  // Standardize styling hooks using the project's indexing token system
  if (dataMapWpObj && dataMapWpObj.addIndexed) {
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

  // Initialize runtime configuration parameters for the Swiper engine
  const swiper = new Swiper(swiperContainer, {
    slidesPerView: 'auto',
    spaceBetween: 20,
    // watchOverflow: true,
    // grabCursor: true,
    navigation: {
      nextEl: nextBtn,
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

  swiperContainer.addEventListener('common-carousel:destroy', () => {
    swiper.destroy(true, true);
  });
}
