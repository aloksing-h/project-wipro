import dataMapWpObj from '../../scripts/constant.js';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Wrap first two elements of default-content-wrapper
  const section = block.closest('.section');
  const defaultContentWrapper = section?.querySelector('.default-content-wrapper');

  if (defaultContentWrapper && defaultContentWrapper.children.length >= 2) {
    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'columns-header-wrapper';

    headerWrapper.append(
      defaultContentWrapper.children[0],
      defaultContentWrapper.children[1],
    );

    defaultContentWrapper.prepend(headerWrapper);
  }

  // Setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');

      if (pic) {
        const picWrapper = pic.closest('div');

        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // Add indexed classes
  if (dataMapWpObj?.addIndexed) {
    dataMapWpObj.CLASS_PREFIXES = [
      'columns-cont',
      'columns-sec',
      'columns-sub',
      'columns-inner-text',
      'columns-list',
      'columns-list-content',
    ];

    dataMapWpObj.addIndexed(block);
  }
}
