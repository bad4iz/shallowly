import React from 'react';

/**
 *
 * @param node
 * @param selector
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
