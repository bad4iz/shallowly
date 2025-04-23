import React from 'react';

/**
 *
 * @param element
 * @param indent
 */
export function renderToString(element, indent = 0) {
  if (!React.isValidElement(element)) {
    return `${' '.repeat(indent)}${String(element)}`;
  }

  const type = typeof element.type === 'string' ? element.type : element.type.name || 'Unknown';
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
