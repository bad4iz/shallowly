import React from 'react';
import { describe, expect, it } from 'vitest';

import { renderWithProps, renderWithPropsInline } from './renderWithProps';

/**
 * Mock Default.
 *
 * @returns {void}
 */
const mockDefault = () => {};

/**
 * Input onClick callback.
 *
 * @returns {void}
 */
const onClick = () => {};

/**
 * Input onChange callback.
 *
 * @returns {void}
 */
const onChange = () => {};

describe('🐛 spec renderWithProps', () => {
  it('🧪 default', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();

    //🔥 Act
    const result = renderWithProps;

    //❓ Assert
    expect(result).toBeDefined();
  });

  it('🧪 renders primitive with indentation', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();

    //🔥 Act
    const result = renderWithProps('text', 2);

    //❓ Assert
    expect(result).toBe('  text');
  });

  it('🧪 renders self-closing element with props', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();
    const element = React.createElement('button', {
      disabled: true,
      onClick,
    });

    //🔥 Act
    const result = renderWithProps(element);

    //❓ Assert
    expect(result).toBe('<button disabled=true onClick=function />');
  });

  it('🧪 renders nested structure with props', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();
    const element = React.createElement(
      'div',
      { data: { id: 1 } },
      React.createElement('span', { title: 'x' }, 'y'),
    );

    //🔥 Act
    const result = renderWithProps(element);

    //❓ Assert
    expect(result).toBe('<div data={"id":1}>\n  <span title="x">\n    y\n  </span>\n</div>');
  });
});

describe('🐛 spec renderWithPropsInline', () => {
  it('🧪 default', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();

    //🔥 Act
    const result = renderWithPropsInline;

    //❓ Assert
    expect(result).toBeDefined();
  });

  it('🧪 renders primitive value', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();

    //🔥 Act
    const result = renderWithPropsInline(42);

    //❓ Assert
    expect(result).toBe('42');
  });

  it('🧪 renders self-closing inline with props', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();
    const element = React.createElement('input', {
      onChange,
      value: 'q',
    });

    //🔥 Act
    const result = renderWithPropsInline(element);

    //❓ Assert
    expect(result).toBe('<input onChange=function value="q" />');
  });

  it('🧪 renders nested inline structure with props', () => {
    expect.hasAssertions();

    //☣️ Arrange
    mockDefault();
    const element = React.createElement(
      'div',
      { kind: 'root' },
      React.createElement('span', { role: 'note' }, 'z'),
    );

    //🔥 Act
    const result = renderWithPropsInline(element);

    //❓ Assert
    expect(result).toBe('<div kind="root"><span role="note">z</span></div>');
  });
});
