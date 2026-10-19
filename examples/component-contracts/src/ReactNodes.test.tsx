import type { ReactNode } from 'react';
import { shallow } from 'shallowly';
import { describe, expect, it } from 'vitest';

describe('React nodes through the package entry', () => {
  it.each<{ node: ReactNode; text: string }>([
    { node: 'Loading', text: 'Loading' },
    { node: '', text: '' },
    { node: 0, text: '0' },
    { node: 42, text: '42' },
    { node: 42n, text: '42' },
    { node: null, text: 'null' },
    { node: undefined, text: 'undefined' },
    { node: false, text: 'false' },
    { node: true, text: 'true' },
  ])('preserves and serializes $node', ({ node, text }) => {
    const wrapper = shallow(node);

    expect(wrapper.render()).toBe(node);
    expect(wrapper.text()).toBe(text);
    expect(wrapper.textInline()).toBe(text);
    expect(wrapper.textWithProps()).toBe(text);
    expect(wrapper.textWithPropsInline()).toBe(text);
    expect(wrapper.props()).toEqual({});
    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('continues to accept elements and arrays of nodes', () => {
    const nodes: ReactNode[] = ['Loading', 0, null, <span key="status" />];

    expect(shallow(<span>Loading</span>).textInline()).toBe('<span>Loading</span>');
    expect(shallow(nodes).render()).toBe(nodes);
  });
});
