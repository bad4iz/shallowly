import { shallow } from 'shallowly';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProfilePanel } from './ProfilePanel';
import { useProfile } from './useProfile';

vi.mock('./useProfile', () => ({ useProfile: vi.fn() }));

const mockedUseProfile = vi.mocked(useProfile);

beforeEach(() => {
  mockedUseProfile.mockReset();
  mockedUseProfile.mockReturnValue({
    status: 'ready',
    profile: { id: 'grace', name: 'Grace Hopper' },
  });
});

describe('ProfilePanel', () => {
  it('returns the expected root structure', () => {
    const wrapper = shallow(<ProfilePanel onProfileSelected={vi.fn()} />);

    expect(wrapper.textInline()).toBe('<section><h1>Your profile</h1><UserCard /></section>');
    expect(wrapper.find('section').prop('aria-label')).toBe('Profile');
  });

  it('passes the profile name from the mocked hook to its child', () => {
    const wrapper = shallow(<ProfilePanel onProfileSelected={vi.fn()} />);

    expect(wrapper.find('UserCard').props()).toEqual({
      name: 'Grace Hopper',
      onSelect: expect.any(Function),
    });
  });

  it('passes the selected profile id to the parent callback', () => {
    const onProfileSelected = vi.fn();
    const wrapper = shallow(<ProfilePanel onProfileSelected={onProfileSelected} />);
    const onSelect: unknown = wrapper.find('UserCard').prop('onSelect');

    // Treat a dynamically inspected prop as unknown before invoking it.
    if (typeof onSelect !== 'function') {
      throw new TypeError('Expected UserCard.onSelect to be a function');
    }

    onSelect();

    expect(onProfileSelected).toHaveBeenCalledExactlyOnceWith('grace');
  });

  it('returns the loading branch selected by the mocked hook', () => {
    mockedUseProfile.mockReturnValue({ status: 'loading' });

    const wrapper = shallow(<ProfilePanel onProfileSelected={vi.fn()} />);

    expect(wrapper.textInline()).toBe('<p>Loading profile...</p>');
    expect(wrapper.find('p').prop('role')).toBe('status');
  });

  it('keeps UserCard at the shallow boundary without running its hooks', () => {
    const wrapper = shallow(<ProfilePanel onProfileSelected={vi.fn()} />);
    const child = wrapper.find('UserCard');

    // UserCard is a real component with useState, not a mocked component.
    // Neither shallow() nor find() executes it or exposes its internal buttons.
    expect(child.textInline()).toBe('<UserCard />');
    expect(wrapper.find('button').textInline()).toBe('');
  });
});
