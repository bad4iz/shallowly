import React from 'react';
import { describe, expect, it } from 'vitest';

import { shallow } from '../src';

type MenuItemYardProps = {
  text: string;
};

const MenuItemYard = React.forwardRef(function (
  { text }: MenuItemYardProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return <div ref={ref}>{text}</div>;
});

MenuItemYard.displayName = 'MenuItemYard';

describe('🐛 spec ForwardRef', () => {
  it('🧪 uses forwardRef component name in snapshots', () => {
    expect.hasAssertions();
    //☣️ Arrange (всякие моки)

    //🔥 Act
    const wrapper = shallow(
      <div>
        <MenuItemYard text="fo" />
      </div>,
    );

    //❓ Assert
    expect(wrapper.textWithPropsInline()).toBe('<div><MenuItemYard text="fo" /></div>');
    expect(wrapper.find('MenuItemYard').exists()).toBe(true);
  });
});
