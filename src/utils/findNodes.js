import React from 'react';

/**
 *
 * @param node
 * @param selector
 * @param results
 * @param matchesSelector
 */
export function findNodes(node, selector, results, matchesSelector) {
  if (!node) return;

  if (matchesSelector(node, selector)) {
    results.push(node);
  }

  if (React.isValidElement(node) && node.props.children) {
    React.Children.forEach(node.props.children, (child) => {
      findNodes(child, selector, results, matchesSelector);
    });
  }
}
