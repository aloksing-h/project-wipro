import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import dataMapWpObj from '../../scripts/constant.js';
import { domEl } from '../../scripts/dom-helpers.js';

/**
 * Creates a contact form using DOM helpers
 * @returns {HTMLElement} The contact form element
 */
function createContactForm() {
  // Create input field helper
  const createField = (type, placeholder, name) => domEl('input', {
    type,
    placeholder,
    name,
    class: 'footer-form-input',
    required: true,
  });

  // Build form structure
  const form = domEl(
    'form',
    {
      class: 'footer-contact-form',
      onSubmit: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        // eslint-disable-next-line no-console
        console.log('Form submitted:', data);
        // Add your form submission logic here
        e.target.reset();
      },
    },
    createField('text', 'Name', 'name'),
    createField('email', 'Email', 'email'),
    createField('text', 'Organization', 'organization'),
    domEl('button', { type: 'submit', class: 'footer-form-submit' }, 'Submit'),
  );

  return form;
}

/**
 * Adds smooth scroll to top functionality
 * @param {HTMLElement} block The footer block
 */
function addBackToTopLink(block) {
  const backToTopLink = block.querySelector('a[title="Back to top"]');
  if (backToTopLink) {
    backToTopLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * Loads and decorates the footer component block.
 * @param {HTMLElement} block The footer block element
 */
export default async function decorate(block) {
  // Load the target footer content as an asynchronous fragment reference
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // Safely wipe out existing default authored text nodes to prevent layout shifts
  block.textContent = '';

  // Construct a semantic wrapper container to house the migrated structural nodes
  const footerContainer = document.createElement('div');
  while (fragment.firstElementChild) {
    footerContainer.append(fragment.firstElementChild);
  }

  // CRITICAL FIX: Append content to the live block FIRST.
  // The indexing engine cannot see or mutate elements that aren't attached to the target root.
  block.append(footerContainer);

  // Execute recursive class name token styling rules on the live DOM tree
  if (dataMapWpObj?.addIndexed) {
    dataMapWpObj.CLASS_PREFIXES = [
      'footer-cont',
      'footer-sec',
      'footer-sub',
      'footer-inner-text',
      'footer-list',
      'footer-list-content',
    ];
    dataMapWpObj.addIndexed(block);
  }

  // Replace form placeholder with actual form in the right section
  const formPlaceholder = block.querySelector('.footer-sec2 .footer-inner-text1');
  if (formPlaceholder) {
    formPlaceholder.textContent = '';
    const contactForm = createContactForm();
    formPlaceholder.appendChild(contactForm);
  }

  // Add back to top functionality
  addBackToTopLink(block);
}
