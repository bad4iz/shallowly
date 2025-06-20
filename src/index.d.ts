import * as React from 'react';


/**
 *
 */
declare class ShallowWrapper {
  /**
   *
   */
  constructor(component: React.ReactNode);
  /**
   *
   */
  render(): React.ReactNode;
  /**
   *
   */
  renderToString(element?: React.ReactNode, indent?: number): string;
  /**
   *
   */
  text(): string;
  /**
   *
   */
  props(): object;
  /**
   *
   */
  prop(key: string): unknown;
  /**
   *
   */
  find(selector: string | React.ComponentType): ShallowWrapper;
  /**
   *
   */
  textWithProps(): string;
}

declare function shallow(component: React.ReactNode): ShallowWrapper;

export { shallow };
