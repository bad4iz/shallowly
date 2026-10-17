# Test a React component's output, props, and callbacks

Shallowly calls the component under test and lets you inspect the React elements
it returns. Child components remain elements: their bodies and hooks do not run.
This guide tests the contract between a profile panel, its data hook, its child
card, and a callback provided by its parent.

## Run the example

The complete [component-contracts example](../examples/component-contracts)
includes React 19, Vitest 4, and TypeScript 5.9. Use Node.js 20.19+ on the 20.x
line, or Node.js 22.12+ and npm for its Vitest/Vite toolchain.

From a clone of this repository:

```bash
cd examples/component-contracts
npm install
npm test
npm run typecheck
```

These commands install the published `shallowly` package, run five tests in
Vitest's Node environment, and check the example with strict TypeScript. There is
no browser, DOM shim, build step, or adapter to configure. You can also copy the
example directory into another project and run the same commands.

## Describe the component's contract

[`ProfilePanel.tsx`](../examples/component-contracts/src/ProfilePanel.tsx) reads
its profile from `useProfile()`. While loading, it returns a status message.
Otherwise it passes the profile name and a callback to `UserCard`:

```tsx
import { UserCard } from './UserCard';
import { useProfile } from './useProfile';

export interface ProfilePanelProps {
  onProfileSelected: (profileId: string) => void;
}

export function ProfilePanel({ onProfileSelected }: ProfilePanelProps) {
  const state = useProfile();

  if (state.status === 'loading') {
    return <p role="status">Loading profile...</p>;
  }

  return (
    <section aria-label="Profile">
      <h1>Your profile</h1>
      <UserCard name={state.profile.name} onSelect={() => onProfileSelected(state.profile.id)} />
    </section>
  );
}
```

The real `useProfile` hook uses React state with local demo data. The real
`UserCard` also uses state to expand its details. The panel tests replace the
hook's return value and leave `UserCard` unmocked.

## Mock the hook at its module boundary

At the top of
[`ProfilePanel.test.tsx`](../examples/component-contracts/src/ProfilePanel.test.tsx):

```tsx
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
```

Vitest hoists `vi.mock`, so the component receives the mocked hook when its module
loads. `vi.mocked` retains the hook's return type: an invalid mock result is a
TypeScript error. Resetting its implementation before each test keeps the loading
case from affecting other tests.

Shallowly does not provide a React hook dispatcher. Any hooks executed by the
component under test must be mocked or moved behind a dependency that is mocked,
as above. Test the hook's state changes and effects separately with a React
runtime. A custom context hook can use the same module-mocking pattern.

## Inspect output and child props

Inside a test, render the panel and inspect the elements it returns:

```tsx
const wrapper = shallow(<ProfilePanel onProfileSelected={vi.fn()} />);

expect(wrapper.textInline()).toBe('<section><h1>Your profile</h1><UserCard /></section>');
expect(wrapper.find('section').prop('aria-label')).toBe('Profile');
expect(wrapper.find('UserCard').props()).toEqual({
  name: 'Grace Hopper',
  onSelect: expect.any(Function),
});
```

`textInline()` describes the element structure and omits props. It is not the
browser's `textContent`. Use `prop()` or `props()` for individual values.
`wrapper.props()` refers to the input `ProfilePanel` props; finding the returned
`section` lets you inspect that output element's props instead.

Each selector here matches one element. Use a unique selector when inspecting
props; a wrapper containing multiple matches does not provide indexed access.

## Invoke the child callback

The panel translates a child selection into the selected profile's id. Call that
callback directly and check the result:

```tsx
const onProfileSelected = vi.fn();
const wrapper = shallow(<ProfilePanel onProfileSelected={onProfileSelected} />);
const onSelect: unknown = wrapper.find('UserCard').prop('onSelect');

if (typeof onSelect !== 'function') {
  throw new TypeError('Expected UserCard.onSelect to be a function');
}

onSelect();

expect(onProfileSelected).toHaveBeenCalledExactlyOnceWith('grace');
```

Treat the dynamically inspected prop as `unknown`, then use `typeof` to check it
before calling it in TypeScript. This tests the callback supplied by the panel.
It does not simulate a browser click or verify the child's button behavior.

## Cover another output branch

Set the hook's result before creating a new wrapper:

```tsx
mockedUseProfile.mockReturnValue({ status: 'loading' });

const wrapper = shallow(<ProfilePanel onProfileSelected={vi.fn()} />);

expect(wrapper.textInline()).toBe('<p>Loading profile...</p>');
expect(wrapper.find('p').prop('role')).toBe('status');
```

This verifies the panel's loading output. It does not drive the real hook through
a loading transition or cause an existing wrapper to update.

## Keep the child boundary explicit

The last example test finds `UserCard` and confirms that its internal buttons are
absent from the returned tree. `find('UserCard')` does not execute the child.
Neither the child's state nor its render output is part of this panel test.

Use a separate component test for the child's own contract, and a React-based
integration test when you need real hooks, context propagation, effects,
Suspense behavior, DOM events, or interaction across components.
