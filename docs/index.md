# Shallowly documentation

Shallow rendering for isolated React component tests. Inspect the component's output, the props it passes to children, and its callbacks without rendering child components or creating a DOM.

[Читать на русском](./index.ru.md) · [Getting started](#getting-started) · [API reference](#api-reference) · [Migrating from Enzyme](#migrating-from-enzyme)

## Installation

Shallowly requires **React 19** (`react: "^19.0.0"` in `peerDependencies`). React 18 is outside the declared support range. In an existing React 19 project:

```bash
npm install --save-dev shallowly vitest
```

For a new project, also run `npm install react@^19`. Shallowly supplies the wrapper API; Vitest or another test runner runs your tests. Shallowly does not require a browser environment.

## Getting started

Save the following as `Parent.test.jsx`, then run `npx vitest run`:

```jsx
import React from 'react';
import { shallow } from 'shallowly';
import { expect, test, vi } from 'vitest';

function Child() {
  throw new Error('This child must not render in the parent unit test');
}

function Parent({ label, onSave }) {
  return (
    <section>
      <Child label={label} onSave={onSave} />
    </section>
  );
}

test('passes the label and save callback to Child', () => {
  const onSave = vi.fn();
  const wrapper = shallow(<Parent label="Save" onSave={onSave} />);

  expect(wrapper.textInline()).toBe('<section><Child /></section>');
  const child = wrapper.find(Child);
  expect(child.prop('label')).toBe('Save');

  const save = child.prop('onSave');
  if (typeof save !== 'function') throw new Error('Expected onSave callback');
  save();
  expect(onSave).toHaveBeenCalledOnce();
});
```

`Parent` executes once when its wrapper is created. `Child` is retained as an element, so its throwing body never runs. Calling `find(Child)` does not render it either.

Continue with the [guide to output, child props, callbacks, and mocked hooks](./testing-component-contracts.md) and the [runnable example](../examples/component-contracts).

## Rendering and dependency boundaries

- A function component supplied to `shallow` is called directly with its input props. Mock hooks, context access, and other dependencies that it uses.
- Child component bodies and their hooks do not execute. You can inspect child props and explicitly supplied `children`, but not the elements a child would return when rendered.
- Shallowly does not install React's hook dispatcher, schedule state updates, run effects, or propagate providers. It does not test the real behavior of mocked hooks.
- Suspense and other wrapper elements can appear in the output tree, but Shallowly does not resolve suspended work or lazy components, select Suspense fallbacks, or unwrap `memo`/`forwardRef` root components.
- A class root is instantiated, its `componentWillMount` is called if present, and then `render` runs. This is not a complete React lifecycle; there is no supported state-update, instance-access, or rerender API.
- No DOM is created. Calling a callback directly tests that function's logic, not browser event dispatch or React's event system.

Use integration tests alongside these isolated tests to verify DOM behavior, actual hooks, context propagation, and interactions between components.

## API reference

### `shallow(component)`

Creates a wrapper for a React node. For a function or class root, it executes the root as described above. For a host element such as `<div />`, it wraps the element directly.

There is no options argument, `disableLifecycleMethods` option, or TypeScript generic parameter.

### `find(selector)`

Searches the output element tree, including its root, and returns a wrapper without executing matched components. Supported selectors:

| Selector         | Match                                 |
| ---------------- | ------------------------------------- |
| `find(Child)`    | Function or class component identity. |
| `find('Child')`  | Component name or `displayName`.      |
| `find('button')` | Host element tag.                     |
| `find('.save')`  | One class on a host element.          |
| `find('#save')`  | An ID on a host element.              |

This is not a general CSS selector engine. Attribute selectors such as `button[type="submit"]`, combined selectors such as `button.save`, and descendant selectors are unsupported.

`find` walks the React elements present in the output and their supplied children. It never renders children to discover more elements. The wrapper has no `length`, `at()`, or iteration API. If multiple matches are returned, use `exists()` to check for a match; use a unique selector to inspect props. Do not chain searches or expect per-element serialization on a multiple-match result.

### `props()` and `prop(name)`

`props()` returns the current element's props. `prop(name)` reads one value. Their meaning depends on the wrapper:

- On `shallow(<Parent ... />)`, these are **Parent's input props**, not the props on the first element Parent returns.
- After `find` matches exactly one element, these are **that matched element's props**.
- After zero or multiple matches, `props()` returns `{}` and `prop(name)` returns `undefined`.

```jsx
function Greeting({ name }) {
  return <h1 id="greeting">{name}</h1>;
}

const wrapper = shallow(<Greeting name="Ada" />);
wrapper.prop('name'); // 'Ada': input prop on Greeting
wrapper.prop('id'); // undefined: Greeting has no id input prop
wrapper.find('h1').prop('id'); // 'greeting': prop on the output element
```

### `exists()`

Use on a search result to check whether at least one element matched:

```jsx
const wrapper = shallow(
  <section>
    <button>Save</button>
  </section>,
);
wrapper.find('button').exists(); // true
wrapper.find('input').exists(); // false
```

### Output and debugging methods

| Method                  | Output                                       |
| ----------------------- | -------------------------------------------- |
| `text()`                | Multiline tree with tags, without props.     |
| `textInline()`          | Single-line tree with tags, without props.   |
| `textWithProps()`       | Multiline tree including serialized props.   |
| `textWithPropsInline()` | Single-line tree including serialized props. |

Despite its name, `text()` returns a tree representation, not plain text content or DOM HTML. Functions in props are shown as `function`; other prop values are JSON-serialized. These methods are intended for debugging and snapshots of an element tree, not rendering web content.

```jsx
const wrapper = shallow(<button id="save">Save</button>);
wrapper.text();
// <button>
//   Save
// </button>
wrapper.textInline(); // '<button>Save</button>'
wrapper.textWithPropsInline(); // '<button id="save">Save</button>'
```

## TypeScript

Types are bundled. Call `shallow(element)`, not `shallow<Props>(element)`. Prop values are not inferred from the component's props, so validate the value before using it. Assigning it to `unknown` makes that check explicit in TypeScript:

```tsx
import * as React from 'react';
import { shallow } from 'shallowly';

type SaveButtonProps = { onSave: () => void };

function SaveButton({ onSave }: SaveButtonProps) {
  return <button onClick={onSave}>Save</button>;
}

const wrapper = shallow(<SaveButton onSave={() => {}} />);
const onClick: unknown = wrapper.find('button').prop('onClick');
if (typeof onClick !== 'function') throw new Error('Expected onClick callback');
onClick();
```

For a standalone TypeScript setup, add `typescript` and `@types/react` as dev dependencies and enable JSX in your TypeScript configuration. See the [example project's configuration](../examples/component-contracts).

## Migrating from Enzyme

Shallowly has an Enzyme-like API for an overlapping set of isolated tests. It is not a drop-in replacement.

| Enzyme pattern                               | Shallowly behavior or replacement                                         |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| `shallow`, `find`, `props`, `prop`, `exists` | Available, with the selector and prop semantics documented above.         |
| `.text()`                                    | Serializes tags and structure; update plain-text expectations.            |
| `.setProps(nextProps)`                       | Create a new wrapper with those props.                                    |
| `.setState()`, `.instance()`                 | Not implemented. Mock dependencies and assert outputs.                    |
| `.simulate('click')`                         | Read `onClick` and call the function directly with appropriate arguments. |
| `.at(index)`, `.length`                      | Not implemented; identify a unique element for prop assertions.           |
| Complex CSS selectors                        | Replace with supported simple selectors.                                  |
| Lifecycle options                            | Not implemented; do not depend on a React lifecycle simulation.           |

For example, an existing Enzyme test with an `onSave` spy might contain:

```jsx
// Enzyme
const wrapper = shallow(<SaveButton onSave={onSave} />);
wrapper.find('button').simulate('click');
```

The corresponding Shallowly test is:

```jsx
import React from 'react';
import { shallow } from 'shallowly';
import { expect, test, vi } from 'vitest';

function SaveButton({ onSave }) {
  return <button onClick={onSave}>Save</button>;
}

test('forwards the save callback', () => {
  const onSave = vi.fn();
  const wrapper = shallow(<SaveButton onSave={onSave} />);
  const onClick = wrapper.find('button').prop('onClick');
  if (typeof onClick !== 'function') throw new Error('Expected onClick callback');
  onClick();
  expect(onSave).toHaveBeenCalledOnce();
});
```

For changed input props, create independent wrappers:

```jsx
function Status({ error }) {
  return <section>{error ? <p className="error">{error}</p> : null}</section>;
}

const normal = shallow(<Status />);
const failed = shallow(<Status error="Save failed" />);
normal.find('.error').exists(); // false
failed.find('.error').textInline(); // '<p>Save failed</p>'
```

## Further reading

- [Testing component output, props, callbacks, and mocked hooks](./testing-component-contracts.md)
- [React architecture guide](./react-architecture.md)
- [Performance claims and benchmark follow-up](../README.md#performance)
- [Development guide](./dev.en.md) · [Contributing](./CONTRIBUTING.md)
- [Report an issue](https://github.com/bad4iz/shallowly/issues)

MIT © [Bad4iz](https://github.com/bad4iz)
