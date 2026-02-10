import * as React from 'react';

/**
 * Wrapper for shallow rendering of React components.
 *
 * Provides helpers to inspect rendered output, props, and descendants
 * without deep rendering child components.
 */
declare class ShallowWrapper {
  /**
   * Creates a new shallow wrapper for a React node.
   *
   * @param component - Root React node to wrap.
   */
  constructor(component: React.ReactNode);
  /**
   * Performs shallow rendering of the wrapped node.
   *
   * @returns Rendered React node.
   */
  render(): React.ReactNode;
  /**
   * Converts a React node to a formatted string tree.
   *
   * @param element - Node to render into string.
   * @param indent - Indentation size for nested levels.
   * @returns Multiline string representation.
   */
  renderToString(element?: React.ReactNode, indent?: number): string;
  /**
   * Returns text representation of the rendered tree.
   *
   * @returns Multiline text output.
   */
  text(): string;
  /**
   * Returns text representation of the rendered tree in one line.
   *
   * @returns One-line text output.
   */
  textInline(): string;
  /**
   * Returns all props of the current wrapped node.
   *
   * @returns Props object.
   */
  props(): object;
  /**
   * Returns a specific prop value by key.
   *
   * @param key - Prop name.
   * @returns Value of the requested prop.
   */
  prop(key: string): unknown;
  /**
   * Finds descendant nodes by selector or component type.
   *
   * @param selector - CSS selector or component constructor.
   * @returns Wrapper containing found node(s).
   */
  find(selector: string | React.ComponentType): ShallowWrapper;
  /**
   * Returns rendered output with serialized props.
   *
   * @returns Multiline text with props.
   */
  textWithProps(): string;
  /**
   * Returns rendered output with serialized props in one line.
   *
   * @returns One-line text with props.
   */
  textWithPropsInline(): string;
}

/**
 * Creates a `ShallowWrapper` for the provided React node.
 *
 * @param component - React node to shallow render.
 * @returns New wrapper instance.
 */
declare function shallow(component: React.ReactNode): ShallowWrapper;

export { shallow };
