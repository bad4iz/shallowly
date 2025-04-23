import React from 'react';
import { describe, expect, it } from 'vitest';

import { shallow } from '../src';
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
    expect(wrapper.find('Button')).toMatchSnapshot();
  });
});
