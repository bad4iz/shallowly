import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { shallow } from '../src';

describe('🐛 spec scalar React nodes', () => {
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
  ])('🧪 preserves and serializes $node', ({ node, text }) => {
    expect.hasAssertions();

    //☣️ Arrange
    const wrapper = shallow(node);

    //🔥 Act
    const rendered = wrapper.render();

    //❓ Assert
    expect(rendered).toBe(node);
    expect(wrapper.text()).toBe(text);
    expect(wrapper.textInline()).toBe(text);
    expect(wrapper.textWithProps()).toBe(text);
    expect(wrapper.textWithPropsInline()).toBe(text);
    expect(wrapper.props()).toEqual({});
    expect(wrapper.find('div').exists()).toBe(false);
  });
});
