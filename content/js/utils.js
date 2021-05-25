/**
 * Find an element in the page using a CSS selector.
 * 
 * @param {string} selector - A CSS selector to match elements.
 * 
 * @returns {HTMLElement}
 */
const _ = ( selector ) => {
    return document.querySelector( selector );
};

/**
 * Find elements in the page using a CSS selector.
 * 
 * @param {string} selector - A CSS selector to match elements.
 * 
 * @returns {HTMLElement[]}
 */
const __ = ( selector ) => {
    return document.querySelectorAll( selector );
};