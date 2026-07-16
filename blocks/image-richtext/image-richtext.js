import dataMapWpObj from '../../scripts/constant.js';

/**
 * Decorates the image-richtext block
 * @param {HTMLElement} block The block element
 */
export default function decorate(block) {
  // Add indexed classes for styling
  if (dataMapWpObj?.addIndexed) {
    dataMapWpObj.CLASS_PREFIXES = [
      'image-richtext-cont',
      'image-richtext-sec',
      'image-richtext-sub',
      'image-richtext-inner-text',
      'image-richtext-list',
      'image-richtext-list-content',
    ];
    dataMapWpObj.addIndexed(block);
  }

  // Process each row as an image-richtext item
  [...block.children].forEach((row) => {
    row.classList.add('image-richtext-item');

    const cells = [...row.children];
    if (cells.length >= 2) {
      const imageCell = cells[0];
      const contentCell = cells[1];

      imageCell.classList.add('image-richtext-image');
      contentCell.classList.add('image-richtext-content');

      // Process content to style text properly
      const content = contentCell.querySelector('p, h1, h2, h3, h4, h5, h6');
      if (content && content.textContent) {
        // Auto-bold the word "forward" if it exists
        const html = content.innerHTML;
        if (html.includes('forward') && !html.includes('<strong>forward</strong>')) {
          content.innerHTML = html.replace(/\bforward\b/gi, '<strong>$&</strong>');
        }
      }
    } else if (cells.length === 1) {
      // If only one cell, treat it as content only
      const contentCell = cells[0];
      contentCell.classList.add('image-richtext-content');
    }
  });
}
