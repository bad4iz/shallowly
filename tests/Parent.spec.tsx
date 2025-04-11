import React from 'react';
import { shallow } from '../src';
import { describe, expect, it } from 'vitest';

import { Parent } from './Parent';

describe('🐛 spec Parent', () => {
  it('🧪 default', () => {
    expect.hasAssertions();
    //☣️ Arrange (всякие моки)

    // 🧹 clear mock

    //🔥 Act
    const wrapper = shallow(<Parent />);

    //❓ Assert
    expect(wrapper.text()).toMatchSnapshot();
  });

  it('🧪 find', () => {
    expect.hasAssertions();
    //☣️ Arrange (всякие моки)

    // 🧹 clear mock

    //🔥 Act
    const wrapper = shallow(<Parent />);

    //❓ Assert
    expect(wrapper.find('Button').props()).toStrictEqual({
      onClick: expect.any(Function),
    });
  });
});
