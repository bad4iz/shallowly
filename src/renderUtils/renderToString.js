import React from 'react';

/**
 * Converts a React element to a string ignoring props, while keeping the
 * nested structure. Useful for lightweight snapshots.
 *
 * @param {React.ReactNode} element - Element or node to render.
 * @param {number} [indent] - Current indentation in spaces.
 * @returns {string} String representation of the tree.
 */
export function renderToString(element, indent = 0) {
  if (!React.isValidElement(element)) {
    return `${' '.repeat(indent)}${String(element)}`;
  }

  // Figure out the name of the tag/component.
  const type = typeof element.type === 'string'
    ? element.type
    : element.type.name || 'Unknown';
  const children =
    React.Children.map(element.props.children, (child) => renderToString(child, indent + 2)) || [];

  if (children.length === 0 && type !== 'Unknown') {
    return `${' '.repeat(indent)}<${type} />`;
  }

  let result = `${' '.repeat(indent)}<${type}>`;

  if (children.length > 0) {
    result += '\n' + children.join('\n') + `\n${' '.repeat(indent)}`;
  }

  result += `</${type}>`;

  return result;
}
