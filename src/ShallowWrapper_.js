/* eslint-disable */
import React from 'react';

import { renderToString } from './renderUtils/renderToString';
import { renderWithProps } from './renderUtils/renderWithProps';
import { findNodes } from './utils/findNodes';
import { matchesSelector } from './utils/matchesSelector';

/**
 *
 */
export class ShallowWrapper {
  /**
   *
   * @param component
   */
  constructor(component) {
    this.component = component;

    this.renderedElement = this.render();
  }

  /**
   *
   */
  render() {
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
   *
   */
  text() {
    return renderToString(this.renderedElement);
  }

  /**
   *
   */
  props() {
    if (!React.isValidElement(this.renderedElement)) {
      return {};
    }

    if (typeof this.component.type === 'function') {
      return this.component.props || {};
    }

    return this.renderedElement.props || {};
  }

  /**
   *
   * @param key
   */
  prop(key) {
    return this.props()[key];
  }

  /**
   *
   */
  exists() {
    if (Array.isArray(this.component)) {
      return this.component.length > 0;
    }

    return !!this.component;
  }

  /**
   *
   * @param selector
   */
  find(selector) {
    const results = [];

    findNodes(this.renderedElement, selector, results, matchesSelector);

    return new ShallowWrapper(results.length === 1 ? results[0] : results);
  }

  /**
   *
   */
  textWithProps() {
    return renderWithProps(this.renderedElement);
  } 
}
