import React from 'react';

/**
 * Traverses the React element tree depth-first and pushes to `results` all
 * nodes that match the selector.
 *
 * @param {React.ReactNode} node - Current node.
 * @param {string|Function} selector - Selector string or component.
 * @param {Array<React.ReactNode>} results - Collected matching nodes.
 * @param {(node: React.ReactNode, selector: string|Function) => boolean} matchesSelector - Function that decides if a node matches.
 */
export function findNodes(node, selector, results, matchesSelector) {
  if (!node) return;

  if (matchesSelector(node, selector)) {
    results.push(node);
  }

  if (React.isValidElement(node) && node.props.children) {
    // Recurse into each child element.
    React.Children.forEach(node.props.children, (child) => {
      findNodes(child, selector, results, matchesSelector);
    });
  }
}
