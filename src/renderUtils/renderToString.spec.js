import React from 'react';
import { describe, expect, it } from 'vitest';

import { renderToInlineString, renderToString } from './renderToString';

/**
 * Mock Default.
 *
 * @returns {void}
 */
const mockDefault = () => {};

describe('🐛 spec renderToString', () => {
  it('🧪 default', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();

    //🔥 Act
    const result = renderToString;

    //❓ Assert
    expect(result).toBeDefined();
  });

  it('🧪 renders primitive with indentation', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();

    //🔥 Act
    const result = renderToString('text', 2);

    //❓ Assert
    expect(result).toBe('  text');
  });

  it('🧪 renders self-closing element without children', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();
    const element = React.createElement('div');

    //🔥 Act
    const result = renderToString(element);

    //❓ Assert
    expect(result).toBe('<div />');
  });

  it('🧪 renders nested elements with line breaks', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();
    const element = React.createElement('div', null, React.createElement('span', null, 'x'));

    //🔥 Act
    const result = renderToString(element);

    //❓ Assert
    expect(result).toBe('<div>\n  <span>\n    x\n  </span>\n</div>');
  });
});

describe('🐛 spec renderToInlineString', () => {
  it('🧪 default', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();

    //🔥 Act
    const result = renderToInlineString;

    //❓ Assert
    expect(result).toBeDefined();
  });

  it('🧪 renders primitive value', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();

    //🔥 Act
    const result = renderToInlineString(42);

    //❓ Assert
    expect(result).toBe('42');
  });

  it('🧪 renders self-closing inline element', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();
    const element = React.createElement('br');

    //🔥 Act
    const result = renderToInlineString(element);

    //❓ Assert
    expect(result).toBe('<br />');
  });

  it('🧪 renders nested inline elements', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();
    const element = React.createElement('div', null, React.createElement('span', null, 'x'));

    //🔥 Act
    const result = renderToInlineString(element);

    //❓ Assert
    expect(result).toBe('<div><span>x</span></div>');
  });
});
