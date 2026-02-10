## для локальной разбаботки

1. скачать репу

```
git clone https://github.com/bad4iz/shallowly
```

2. установить зависимости

```
npm install
```

### что бы слинковать с проектом

3. в Shallowly

```
npm link
```

4. в самом проекте где будет использоватся

```
npm link shallowly
```

5. Когда закончите, удалите линк:

```
npm run unlink
```

### debug-сериализаторы

Используйте эти методы `ShallowWrapper` для отладки рендера:

- `text()` - многострочное дерево без пропсов
- `textInline()` - однострочное дерево без пропсов
- `textWithProps()` - многострочное дерево с сериализованными пропсами
- `textWithPropsInline()` - однострочное дерево с сериализованными пропсами

Пример:

```jsx
const wrapper = shallow(<User name="Иван" age={30} />);

console.log(wrapper.text());
console.log(wrapper.textInline());
console.log(wrapper.textWithProps());
console.log(wrapper.textWithPropsInline());
```
