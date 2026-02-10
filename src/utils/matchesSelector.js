import React from 'react';

import { getElementTypeName } from './getElementTypeName';

/**
 * Checks whether a React element matches the given selector. Supports:
 *   • function or class components
 *   • string selector of component/tag name
 *   • CSS-like .className and #id selectors for DOM elements.
 *
 * @param {React.ReactNode} node - Node to test.
 * @param {string|Function} selector - Selector.
 * @returns {boolean} True if matches.
 */
export function matchesSelector(node, selector) {
  if (!React.isValidElement(node)) return false;

  if (typeof selector === 'function') {
    return node.type === selector;
  }

  if (typeof selector === 'string') {
    const componentName = getElementTypeName(node.type);

    if (componentName === selector) return true;

    if (typeof node.type === 'string') {
      if (node.type === selector) return true;

      if (selector.startsWith('.') && node.props.className) {
        return node.props.className.split(' ').includes(selector.slice(1));
      }

      if (selector.startsWith('#') && node.props.id === selector.slice(1)) {
        return true;
      }
    }
  }

  return false;
}
