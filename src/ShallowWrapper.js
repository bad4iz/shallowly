import React from 'react';

import { renderToInlineString, renderToString } from './renderUtils/renderToString';
import { renderWithProps, renderWithPropsInline } from './renderUtils/renderWithProps';
import { findNodes } from './utils/findNodes';
import { matchesSelector } from './utils/matchesSelector';

/**
 * Wrapper for shallow rendering of React components (Enzyme-like). Provides
 * utilities to get text, props, find descendants without deep rendering and
 * prevents hooks execution in child components.
 */
export class ShallowWrapper {
  /**
   * Creates new shallow wrapper instance.
   *
   * @param {React.ReactElement|Array<React.ReactNode>} component - Root element to wrap.
   * @param {boolean} [shouldRender] - Whether to execute render immediately.
   */
  constructor(component, shouldRender = true) {
    this.component = component;
    this.shouldRender = shouldRender;

    this.renderedElement = this.render();
  }

  /**
   * Performs a shallow render of the current element. If `shouldRender` is
   * false, returns the original element without executing its body.
   *
   * @returns {React.ReactNode} Rendered React node.
   */
  render() {
    // If we are not supposed to render (for example, a node returned from `find`),
    // just return the element as-is without invoking its function body. This
    // prevents executing hooks and keeps the render depth to one level.
    if (!this.shouldRender) {
      return this.component;
    }

    if (React.isValidElement(this.component)) {
      const { type, props } = this.component;

      if (typeof type === 'function' && type.prototype && type.prototype.isReactComponent) {
        const instance = new type(props);

        if (instance.componentWillMount) {
          instance.componentWillMount();
        }

        return instance.render();
      }

      if (typeof type === 'function') {
        return type(props);
      }

      return React.createElement(type, props);
    }

    return this.component;
  }

  /**
   * Returns plain text representation of the shallow–rendered element.
   *
   * @returns {string} Text content.
   */
  text() {
    return renderToString(this.renderedElement);
  }

  /**
   * Returns one-line text representation of the shallow-rendered element.
   *
   * @returns {string} One-line text content.
   */
  textInline() {
    return renderToInlineString(this.renderedElement);
  }

  /**
   * Returns all props of the current element.
   *
   * @returns {Record<string, any>} Props object.
   */
  props() {
    // When this wrapper was created via `find`, we should derive the props
    // directly from the original element rather than from a rendered output.
    if (React.isValidElement(this.component)) {
      return this.component.props || {};
    }

    if (!React.isValidElement(this.renderedElement)) {
      return {};
    }

    return this.renderedElement.props || {};
  }

  /**
   * Returns specific prop value by name.
   *
   * @param {string} key - Prop key.
   * @returns {*} Prop value.
   */
  prop(key) {
    return this.props()[key];
  }

  /**
   * Checks whether the element/array of elements exists.
   *
   * @returns {boolean} Whether element exists.
   */
  exists() {
    if (Array.isArray(this.component)) {
      return this.component.length > 0;
    }

    return !!this.component;
  }

  /**
   * Finds descendant nodes matching selector and returns a new `ShallowWrapper`
   * without re-rendering found nodes.
   *
   * @param {string|Function} selector - CSS selector string or component type.
   * @returns {ShallowWrapper} Wrapper with found elements.
   */
  find(selector) {
    const results = [];

    findNodes(this.renderedElement, selector, results, matchesSelector);

    // Elements returned from `find` should NOT be rendered again – they should
    // remain at the current depth.
    return new ShallowWrapper(results.length === 1 ? results[0] : results, false);
  }

  /**
   * Returns a string containing both text and props.
   *
   * @description Combine text content with stringified props for quick snapshot-style asserts.
   *
   * @returns {string} Text with embedded props JSON.
   */
  textWithProps() {
    return renderWithProps(this.renderedElement);
  }

  /**
   * Returns one-line string containing both text and props.
   *
   * @returns {string} One-line text with embedded props JSON.
   */
  textWithPropsInline() {
    return renderWithPropsInline(this.renderedElement);
  }
}
