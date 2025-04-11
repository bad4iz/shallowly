import React from 'react';

/**
 *
 * @param element
 * @param indent
 */
export function renderWithProps(element, indent = 0) {
  if (!React.isValidElement(element)) {
    return `${' '.repeat(indent)}${String(element)}`;
  }

  const type = typeof element.type === 'string' ? element.type : element.type.name || 'Unknown';
  const formattedProps = [];

  for (const [key, value] of Object.entries(element.props)) {
    if (key === 'children') continue;
    const propValue = typeof value === 'function' ? 'function' : JSON.stringify(value);
    formattedProps.push(`${key}=${propValue}`);
  }

  const propsString = formattedProps.length > 0 ? ` ${formattedProps.join(' ')}` : '';
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
