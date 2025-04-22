# 📚 Shallowly Documentation

<div align="center" style="margin: 40px 0;">
  <img src="https://media.giphy.com/media/LPMz3h0GeCMPVKk5Bd/giphy.gif" width="250" alt="Documentation coming soon">
  <h2>🚧 Documentation Under Construction 🚧</h2>
  <p>We're working hard to build the best possible documentation for Shallowly!</p>
</div>

## What to Expect

✨ **Coming Soon:**

- [ ] 🚀 Getting Started Guide
- [ ] 📖 Complete API Reference
- [ ] 🧪 Interactive Examples
- [ ] ⚡ Performance Benchmarks
- [ ] 🔄 Migration Guide from Enzyme

## Need Help Right Now?

1. Check out the [README](../README.md) for basic usage
2. Explore the [source code](../src/) - it's well commented!
3. Open an [issue](https://github.com/bad4iz/shallowly/issues) with your questions

<div align="center" style="margin-top: 30px;">
  <a href="https://github.com/bad4iz/shallowly/stargazers">
    <img src="https://img.shields.io/github/stars/bad4iz/shallowly?style=social" alt="GitHub Stars">
  </a>
  <a href="https://github.com/bad4iz/shallowly/watchers">
    <img src="https://img.shields.io/github/watchers/bad4iz/shallowly?style=social" alt="GitHub Watchers">
  </a>
</div>

---

```jsx
const MyComponent = ({ name, age, onClick }) => (
  <div className="container">
    <h1>Hello {name}</h1>
    <p>You are {age} years old</p>
    <button onClick={onClick}>Click me</button>
  </div>
);
```

## text()

Returns text representation

```js
const wrapper = shallow(<MyComponent name="John" age={30} onClick={() => {}} />);
console.log(wrapper.text());
```

Will output something like:

```
<div>
  <h1>
    Hello John
  </h1>
  <p>
    You are 30 years old
  </p>
  <button>
    Click me
  </button>
</div>
```

## prop('name')

Returns specific prop value

```js
const wrapper = shallow(<MyComponent name="John" age={30} onClick={() => {}} />);
console.log(wrapper.prop('name'));
// "John"
```

## props()

Returns all props

```js
const wrapper = shallow(<MyComponent name="John" age={30} onClick={() => {}} />);
console.log(wrapper.props());
//{ "age": 30, "name": "John", "onClick": [Function onClick], }
```

## find()

Finds nodes by component type or CSS selector

```js
const wrapper = shallow(<MyComponent name="John" age={30} onClick={() => {}} />);
console.log(wrapper.find('button').props());
//{ "children": "Click me", "onClick": [Function onClick] }
```

## textWithProps()

Returns text with props

```js
const wrapper = shallow(<MyComponent name="John" age={30} onClick={() => {}} />);
console.log(wrapper.textWithProps());
```

Will output something like:

```
<div className="container">
  <h1 name="John" age=30 onClick="function">
    Hello John
  </h1>
  <p>
    You are 30 years old
  </p>
  <button onClick="function">
    Click me
  </button>
</div>
```

---

> "Good docs are worth the wait!"  
> _The Shallowly Team_  
> Stay tuned for updates! 🔔

[for development](/docs/dev.ru.md)
[для разработки](/docs/dev.ru.md)
