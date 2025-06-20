 
import React from 'react';

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
    const componentType = node.type;
    let componentName;

    if (typeof componentType === 'function') {
      if (componentType.prototype && componentType.prototype.isReactComponent) {
        componentName = componentType.displayName || componentType.name;
      } else {
        componentName = componentType.displayName || componentType.name;
      }
    } else {
      componentName = componentType;
    }

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
