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
    }
  });
}
