# Shallowly 🏝️

**Shallow rendering for isolated React component tests. Inspect component output, child props, and callbacks with an Enzyme-like API.**

[![npm version](https://img.shields.io/npm/v/shallowly?style=flat-square)](https://www.npmjs.com/package/shallowly)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/shallowly?style=flat-square)](https://bundlephobia.com/package/shallowly)
[![build status](https://img.shields.io/github/actions/workflow/status/bad4iz/shallowly/tests.yml?style=flat-square)](https://github.com/bad4iz/shallowly/actions)
[![codecov](https://codecov.io/gh/bad4iz/shallowly/graph/badge.svg)](https://codecov.io/gh/bad4iz/shallowly)

Shallowly calls the component under test and lets you inspect the React elements it returns. Child components stay as elements: their bodies and hooks are not executed. No DOM is required.

## Install

Use Shallowly in a **React 19** project. The package declares `react: "^19.0.0"` as a peer dependency; React 18 is outside that supported range.

```bash
npm install --save-dev shallowly vitest
```

For a new project, install React first with `npm install react@^19`.

## First test with Vitest

Save this as `Parent.test.jsx`:

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

Run it with `npx vitest run`. This test inspects the parent output, reads a child's props, and calls a callback directly. It does not mount `Child` or dispatch a DOM event.

For a complete example with a mocked data hook, read [Testing component output, props, and callbacks](https://github.com/bad4iz/shallowly/blob/main/docs/testing-component-contracts.md) or run the [example project](https://github.com/bad4iz/shallowly/tree/main/examples/component-contracts).

## What to test

- Output structure and conditional elements returned by your component.
- Props passed to child components, including values from mocked hooks or services.
- Callbacks passed to children and the application code those callbacks call.

**Mock hooks and context used by the component under test.** Shallowly calls a function component directly; it does not provide React's hook dispatcher, manage state updates, run effects, or propagate context. A Suspense element can be inspected as output, but Shallowly does not resolve suspended work or render its fallback. Use integration tests to verify those React behaviors and DOM interactions.

## API at a glance

| Method                                     | Behavior                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `shallow(element)`                         | Calls the root component and wraps its output. No options argument.                                    |
| `find(Component)`                          | Finds elements by function or class identity without rendering them.                                   |
| `find('Child')`, `find('button')`          | Finds by component name or host tag.                                                                   |
| `find('.save')`, `find('#save')`           | Finds host elements by a single class or ID. Arbitrary CSS selectors are not supported.                |
| `props()`, `prop(name)`                    | Reads the input props on the root wrapper, or the matched element's props after a single-match `find`. |
| `exists()`                                 | Checks whether a search has at least one match.                                                        |
| `text()`, `textInline()`                   | Serializes output structure **including tags**, without props, in multiple lines or one line.          |
| `textWithProps()`, `textWithPropsInline()` | Serializes output structure with props for debugging and snapshots.                                    |

If `find` matches zero or multiple elements, `props()` returns `{}` and `prop(name)` returns `undefined`. There is no `length` or `at()` API; use a selector that identifies a single element when reading props. TypeScript declarations are included: `shallow` has no generic type parameter, and prop values are not inferred from your component's props. Check values before using them.

See the [English API reference](https://github.com/bad4iz/shallowly/blob/main/docs/index.md) or [справочник на русском](https://github.com/bad4iz/shallowly/blob/main/docs/index.ru.md) for examples and limits.

## Moving Enzyme shallow tests

Shallowly provides an **Enzyme-like subset**, not a drop-in replacement. Tests that inspect child props with `shallow`, `find`, and `prop` may need only an import change; check the behavior below before migrating a suite.

| Existing test pattern                                | Shallowly approach                                                               |
| ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| Inspect child props with `find(Child).prop('value')` | Supported when the search matches exactly one element.                           |
| Read output with `.text()`                           | Returns a serialized tree with tags, not Enzyme's plain text content.            |
| Update with `.setProps()`                            | Create a new `shallow(<Component ... />)` wrapper for each input.                |
| Trigger `.simulate('click')`                         | Read the callback prop and invoke it directly with the expected arguments.       |
| Select with `.at()` or count `.length`               | Not implemented. Use a unique simple selector for a prop assertion.              |
| Use complex CSS selectors                            | Replace with a supported name, tag, class, or ID selector.                       |
| Test hook state, context, or lifecycle updates       | Mock dependencies for the unit test; verify React behavior in integration tests. |

See the [migration example](https://github.com/bad4iz/shallowly/blob/main/docs/index.md#migrating-from-enzyme).

## Performance

The project's existing performance claims are **2x quicker render cycles than Enzyme**, **7x faster than React Testing Library**, and **40% less memory usage compared to Enzyme**. The existing timing comparison is retained below:

| Operation            | Shallowly | React Testing Library |
| -------------------- | --------: | --------------------: |
| Basic component      |      12ms |    85ms (7.1x slower) |
| 100 components       |     650ms |  4500ms (6.9x slower) |
| Hook-heavy component |      18ms |                 210ms |
| Tree traversal       |       8ms |                 150ms |

A reproducible benchmark suite with scenarios, library versions, runtime measurements, and memory measurements is tracked separately in [issue #24](https://github.com/bad4iz/shallowly/issues/24). The figures above have not been revalidated by that suite. Shallowly skips DOM setup and child component execution; comparisons must account for the different work performed by each tool.

## Documentation and contributing

- [English documentation](https://github.com/bad4iz/shallowly/blob/main/docs/index.md) · [Документация на русском](https://github.com/bad4iz/shallowly/blob/main/docs/index.ru.md)
- [Testing component output, props, and callbacks](https://github.com/bad4iz/shallowly/blob/main/docs/testing-component-contracts.md)
- [React architecture guide](https://github.com/bad4iz/shallowly/blob/main/docs/react-architecture.md) · [Архитектура React](https://github.com/bad4iz/shallowly/blob/main/docs/react-architecture-ru.md)
- [Development guide](https://github.com/bad4iz/shallowly/blob/main/docs/dev.en.md) · [Руководство разработки](https://github.com/bad4iz/shallowly/blob/main/docs/dev.ru.md)
- [Contributing](https://github.com/bad4iz/shallowly/blob/main/docs/CONTRIBUTING.md) · [Report an issue](https://github.com/bad4iz/shallowly/issues)

MIT © [Bad4iz](https://github.com/bad4iz)
