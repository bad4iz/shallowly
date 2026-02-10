# 📚 Shallowly Documentation

# Shallowly

### The Ultimate Unit Testing Library for React Components

Precise, focused, and lightning-fast unit testing for React components

[🇷🇺 Читать на русском](/docs/index.ru.md)

---

[Installation](#installation) •
[Getting Started](#getting-started) •
[API Reference](#api-reference) •
[React Architecture](./react-architecture.md) •
[GitHub](https://github.com/bad4iz/shallowly)

[![npm version](https://img.shields.io/npm/v/shallowly?style=flat-square)](https://www.npmjs.com/package/shallowly)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/shallowly?style=flat-square)](https://bundlephobia.com/package/shallowly)
[![build status](https://img.shields.io/github/actions/workflow/status/bad4iz/shallowly/tests.yml?style=flat-square)](https://github.com/bad4iz/shallowly/actions)
[![coverage](https://img.shields.io/codecov/c/github/bad4iz/shallowly?style=flat-square)](https://codecov.io/gh/bad4iz/shallowly)

---

## Why Shallowly for Unit Testing?

Shallowly is purpose-built for unit testing React components, offering a level of precision and performance that integration testing tools can't match. Unlike other testing solutions that encourage testing implementation details, Shallowly is laser-focused on unit testing principles:

- 🎯 **True Unit Testing** - The only React testing library designed specifically for unit tests, not integration tests
- ⚡ **Blazing Fast** - Renders only one level deep, skipping unnecessary child component rendering
- 🧪 **Perfect Isolation** - Each component is tested in complete isolation from its children
- 🔍 **Focused Assertions** - Test exactly what matters without worrying about child component behavior
- 🚫 **No More Overhead** - Skip the test runner configuration and focus on writing tests

> **Why Unit Test?** Unit tests verify individual units of code in isolation, making them faster, more reliable, and easier to debug than integration tests. Shallowly is the only library that truly embraces this philosophy for React components.

## The Unit Testing Standard for React

Shallowly is the de facto standard for unit testing React components. While other libraries force you to test implementation details or require full DOM rendering, Shallowly gives you the precision and speed that proper unit testing demands.

> **Architecture & Testing**: If you think unit tests are time-consuming and expensive, check out our [recommended React architecture](./react-architecture.md). While tests should never dictate architecture, this approach makes your code cleaner, more readable, and extensible. Fast unit test coverage simply demonstrates these benefits. The cleaner your code, the faster and easier unit testing becomes.

### Key Benefits for Unit Testing:

- **No Deep Rendering** - Test components in complete isolation
- **No Test Runner Required** - Works with any test runner
- **No Browser Environment Needed** - Run tests directly in Node.js
- **No External Dependencies** - Lightweight and focused on unit testing

## Installation

```bash
# Using npm
npm install --save-dev shallowly

# Using yarn
yarn add --dev shallowly

# Using pnpm
pnpm add --save-dev shallowly
```

## Unit Testing with Shallowly: Quick Start

Here's how to write your first unit test with Shallowly. Notice how we focus on testing the component in isolation:

Here's a quick example to get you started:

```jsx
import { shallow } from 'shallowly';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<MyComponent name="John" />);
    expect(wrapper.text()).toContain('Hello John');
  });
});
```

## Unit Testing API Reference

Shallowly's API is designed specifically for unit testing React components. Each method is optimized for clarity, precision, and speed in a unit testing context.

---

### `shallow(component: ReactElement, options?: Object) => ShallowWrapper`

The main function that creates a shallow wrapper around your React component.

**Parameters:**

- `component`: The React element to render shallowly
- `options`: (Optional) Configuration object
  - `disableLifecycleMethods`: (Boolean) Disable lifecycle method execution (default: `false`)

**Example:**

```jsx
import { shallow } from 'shallowly';
import MyComponent from './MyComponent';

const wrapper = shallow(<MyComponent name="John" />);
```

### `ShallowWrapper`

#### `text() => string`

Returns a string representation of the rendered component tree.

**Example:**

```jsx
const wrapper = shallow(
  <div>
    <h1>Hello</h1>
    <p>World</p>
  </div>,
);
console.log(wrapper.text());
// Output:
// <div>
//   <h1>Hello</h1>
//   <p>World</p>
// </div>
```

#### `textInline() => string`

Returns a one-line string representation of the rendered component tree.

**Example:**

```jsx
const wrapper = shallow(
  <div>
    <h1>Hello</h1>
    <p>World</p>
  </div>,
);
console.log(wrapper.textInline());
// Output:
// <div><h1>Hello</h1><p>World</p></div>
```

#### `prop(name: string) => any`

Returns the value of a prop by name.

**Example:**

```jsx
const wrapper = shallow(<User name="John" age={30} />);
console.log(wrapper.prop('name')); // "John"
console.log(wrapper.prop('age')); // 30
```

#### `props() => Object`

Returns all props of the root component.

**Example:**

```jsx
const wrapper = shallow(<User name="John" age={30} />);
console.log(wrapper.props());
// { name: "John", age: 30 }
```

#### `find(selector: string | ComponentType) => ShallowWrapper`

Finds all nodes in the render tree that match the provided selector.

**Supported selectors:**

- Component constructor: `find(MyComponent)`
- Display name: `find('MyComponent')`
- DOM selector: `find('.class')`, `find('#id')`, `find('div')`

**Example:**

```jsx
const wrapper = shallow(
  <div>
    <Button>Click me</Button>
    <Button>Don't click</Button>
  </div>,
);

const buttons = wrapper.find(Button);
console.log(buttons.length); // 2
```

#### `textWithProps() => string`

Returns a string representation of the component tree including props.

**Example:**

```jsx
const wrapper = shallow(
  <div className="container">
    <User name="John" age={30} />
  </div>,
);

console.log(wrapper.textWithProps());
// Output:
// <div className="container">
//   <User name="John" age=30 />
// </div>
```

#### `textWithPropsInline() => string`

Returns a one-line string representation of the component tree including props.

**Example:**

```jsx
const wrapper = shallow(
  <div className="container">
    <User name="John" age={30} />
  </div>,
);

console.log(wrapper.textWithPropsInline());
// Output:
// <div className="container"><User name="John" age=30 /></div>
```

#### `exists() => boolean`

Returns whether the element exists in the render tree.

**Example:**

```jsx
const wrapper = shallow(
  <div>
    <span>Hello</span>
  </div>,
);
console.log(wrapper.find('span').exists()); // true
console.log(wrapper.find('button').exists()); // false
```

## Examples

### Testing Component Output

```jsx
test('renders user name', () => {
  const wrapper = shallow(<User name="John" />);
  expect(wrapper.text()).toContain('John');
});
```

### Testing Props

```jsx
test('passes correct props to Button', () => {
  const onClick = jest.fn();
  const wrapper = shallow(<LoginForm onSubmit={onClick} />);

  const button = wrapper.find('button[type="submit"]');
  button.prop('onClick')();

  expect(onClick).toHaveBeenCalled();
});
```

### Testing Conditional Rendering

```jsx
test('shows error when present', () => {
  // Initially no error
  const wrapper = shallow(<Form />);
  expect(wrapper.find('.error').exists()).toBe(false);

  // After error occurs
  wrapper.setProps({ error: 'Something went wrong' });
  expect(wrapper.find('.error').text()).toBe('Something went wrong');
});
```

## Why Shallowly Beats Other Testing Libraries

### Shallowly vs. Other Solutions

| Feature                | Shallowly       | Enzyme     | React Testing Library  |
| ---------------------- | --------------- | ---------- | ---------------------- |
| **Testing Philosophy** | 🎯 Unit Testing | ❓ Mixed   | ❌ Integration Testing |
| **Rendering**          | 🔍 Shallow Only | ⚠️ Mixed   | ❌ Full DOM            |
| **Speed**              | ⚡ Blazing Fast | 🐌 Slow    | 🐢 Very Slow           |
| **Isolation**          | ✅ Perfect      | ❌ Poor    | ❌ None                |
| **API Focus**          | 🎯 Unit Testing | 🔄 General | ❌ Integration Testing |
| **Size**               | 📦 Ultra Light  | 📦📦 Heavy | 📦📦📦 Very Heavy      |

### Migration from Enzyme

If you're coming from Enzyme, here's how Shallowly provides a better unit testing experience:

| Feature             | Enzyme.shallow | Shallowly  |
| ------------------- | -------------- | ---------- |
| Shallow rendering   | ✅ Yes         | ✅ Yes     |
| find() by component | ✅ Yes         | ✅ Yes     |
| find() by CSS       | ✅ Yes         | ✅ Basic   |
| setProps()          | ✅ Yes         | 🔜 Coming  |
| setState()          | ✅ Yes         | 🔜 Coming  |
| simulate()          | ✅ Yes         | 🔜 Coming  |
| Instance access     | ✅ Yes         | 🔜 Coming  |
| Lifecycle methods   | ✅ Yes         | ✅ Partial |
| Size (min+gzip)     | ~100KB         | ~5KB       |

## Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/CONTRIBUTING.md) to get started.

## License

MIT © [Bad4iz](https://github.com/bad4iz)

---

> "Simplicity is the ultimate sophistication."  
> _Leonardo da Vinci_

[RU Version](/docs/index.ru.md)
[Development Guide](/docs/dev.ru.md) | [Руководство разработки](/docs/dev.ru.md)
