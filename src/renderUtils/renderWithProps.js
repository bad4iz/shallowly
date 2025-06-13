import React from 'react';

/**
 * Recursively converts a React element to a string that contains its props
 * and nested children, preserving the original depth.
 *
 * @param {React.ReactNode} element - Element or node to render.
 * @param {number} [indent=0]       - Current indentation size in spaces.
 * @returns {string}                String representation of the tree.
 */
export function renderWithProps(element, indent = 0) {
  if (!React.isValidElement(element)) {
    return `${' '.repeat(indent)}${String(element)}`;
  }

  // Determine tag/component name for the current element.
  const type = typeof element.type === 'string'
    ? element.type // DOM element like 'div'
    : element.type.name || 'Unknown'; // Function/class component
  const formattedProps = [];

  // Build an array of "key=value" strings for each prop except children.
  for (const [key, value] of Object.entries(element.props)) {
    if (key === 'children') continue;
    // Hide implementation details of callbacks; stringify other values.
    const propValue = typeof value === 'function' ? 'function' : JSON.stringify(value);
    formattedProps.push(`${key}=${propValue}`);
  }

  // Join all prop strings with spaces and prefix with one space if not empty.
  const propsString = formattedProps.length > 0 ? ` ${formattedProps.join(' ')}` : '';
  // Recursively render each child, increasing indent by 2 spaces.
  const children =
    React.Children.map(element.props.children, (child) => renderWithProps(child, indent + 2)) || [];

  if (children.length === 0 && type !== 'Unknown') {
    return `${' '.repeat(indent)}<${type}${propsString} />`;
  }

  let result = `${' '.repeat(indent)}<${type}${propsString}>`;

  if (children.length > 0) {
    result += '\n' + children.join('\n') + `\n${' '.repeat(indent)}`;
  }

  result += `</${type}>`;

  return result.replace(/\\"/g, '"');
}
