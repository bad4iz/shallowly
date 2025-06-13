import React from 'react';
import { shallow } from '../src';
import { describe, expect, it } from 'vitest';
import { vi } from 'vitest';
import { shallow } from '../src';
import { Parent } from './Parent';

describe('🐛 spec Parent', () => {
  it('🧪 default', () => {
    expect.hasAssertions();
    //☣️ Arrange (всякие моки)

    // 🧹 clear mock

    //🔥 Act
    const wrapper = shallow(<Parent onClick={() => {}} />);

    //❓ Assert
    expect(wrapper.text()).toMatchSnapshot();
  });

  it('🧪 find', () => {
    expect.hasAssertions();
    //☣️ Arrange (всякие моки)
    const onClick = vi.fn();

    // 🧹 clear mock

    //🔥 Act
    const wrapper = shallow(<Parent onClick={onClick} />);

    //❓ Assert
    expect(wrapper.find('Button').props()).toStrictEqual({
      onClick,
    });
  });
});
