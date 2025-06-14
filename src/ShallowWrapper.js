import React from 'react';

import { renderToString } from './renderUtils/renderToString';

import { renderWithProps } from './renderUtils/renderWithProps';

import { findNodes } from './utils/findNodes';

import { matchesSelector } from './utils/matchesSelector';

/**
 * Wrapper for shallow rendering of React components (Enzyme-like). Provides
 * utilities to get text, props, find descendants without deep rendering and
 * prevents hooks execution in child components.
 */
export class ShallowWrapper {
  /**
   * @param {React.ReactElement|Array<React.ReactNode>} component Root element.
   * @param {boolean} [shouldRender=true]                        Whether to execute render.
   */
  constructor(component, shouldRender = true) {
    this.component = component;
    this.shouldRender = shouldRender;

    this.renderedElement = this.render();
  }

  /**
   * Performs a shallow render of the current element. If `shouldRender` is
   * false, returns the original element without executing its body.
   * @returns {React.ReactNode}
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

  text() {
    return renderToString(this.renderedElement);
  }

  /**
   * Returns all props of the current element.
   * @returns {Record<string, any>}
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
   * Returns specific prop value.
   * @param {string} key
   * @returns {*}
   */
  prop(key) {
    return this.props()[key];
  }

  /**
   * Checks whether the element/array of elements exists.
   * @returns {boolean}
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
   * @param {string|Function} selector
   * @returns {ShallowWrapper}
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
   */
  textWithProps() {
    return renderWithProps(this.renderedElement);
  } 
}

  


  
  
  


  
  
    
  


  


  
  
    
  
  
    
  


  

  


  
  
  


  
  
    
  


  


  
  
    
  
  
    
  


  
