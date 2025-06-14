import React from 'react';
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
    expect(wrapper.text()).toMatchInlineSnapshot(`
      "<div>
        <Children />
        <Button />
      </div>"
    `);
  });

  it('🧪 textWithProps', () => {
    expect.hasAssertions();
    //☣️ Arrange (всякие моки)

    // 🧹 clear mock

    //🔥 Act
    const wrapper = shallow(<Parent onClick={() => {}} />);

    //❓ Assert
    expect(wrapper.textWithProps()).toMatchInlineSnapshot(`
      "<div>
        <Children title="title" />
        <Button onClick=function />
      </div>"
    `);
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

  it('🧪 call fn', () => {
    expect.hasAssertions();
    //☣️ Arrange (всякие моки)
    const onClick = vi.fn(() => 56);

    // 🧹 clear mock

    //🔥 Act
    const wrapper = shallow(<Parent onClick={onClick} />);
    const res = wrapper.find('Button').prop('onClick')();

    //❓ Assert
    expect(res).toBe(56);
  });
});
