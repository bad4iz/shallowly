# Документация Shallowly

Поверхностный рендеринг для изолированных юнит-тестов React-компонентов. Проверяйте выходную структуру компонента, переданные детям props и callbacks без выполнения дочерних компонентов и создания DOM.

[Read in English](./index.md) · [Быстрый старт](#быстрый-старт) · [Справочник API](#справочник-api) · [Миграция с Enzyme](#миграция-с-enzyme)

## Установка

Shallowly требует **React 19** (`react: "^19.0.0"` в `peerDependencies`). React 18 не входит в заявленный диапазон поддержки. В существующем проекте на React 19:

```bash
npm install --save-dev shallowly vitest
```

Для нового проекта также выполните `npm install react@^19`. Shallowly предоставляет API обёртки, а Vitest или другой test runner запускает тесты. Браузерное окружение для Shallowly не требуется.

## Быстрый старт

Сохраните пример в `Parent.test.jsx`, затем выполните `npx vitest run`:

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

При создании обёртки `Parent` выполняется один раз. `Child` остаётся React-элементом, поэтому его тело с исключением не вызывается. `find(Child)` также не выполняет этот компонент.

Дальше можно перейти к [руководству по структуре, props, callbacks и мокам хуков](./testing-component-contracts.md) и [запускаемому примеру](../examples/component-contracts).

## Рендеринг и изоляция зависимостей

- Функциональный компонент, переданный в `shallow`, вызывается напрямую с входными props. Мокируйте используемые им хуки, чтение контекста и другие зависимости.
- Тела дочерних компонентов и их хуки не выполняются. Доступны props детей и явно переданные `children`, но не элементы, которые дочерний компонент вернул бы при рендеринге.
- Shallowly не создаёт диспетчер хуков React, не планирует обновления состояния, не запускает эффекты и не распространяет значения провайдеров. Реальное поведение замокированных хуков такой тест не проверяет.
- Suspense и другие обёртки могут присутствовать в выходном дереве, но Shallowly не разрешает приостановленные операции и lazy-компоненты, не выбирает fallback Suspense и не раскрывает корневые компоненты в `memo`/`forwardRef`.
- Для классового корня создаётся экземпляр, вызывается `componentWillMount`, если он есть, а затем `render`. Это не полный жизненный цикл React; поддерживаемого API обновления состояния, доступа к экземпляру и повторного рендеринга нет.
- DOM не создаётся. Прямой вызов callback проверяет логику функции, а не отправку браузерного события или систему событий React.

Дополняйте изолированные тесты интеграционными, чтобы проверить DOM, настоящие хуки, передачу контекста и взаимодействие компонентов.

## Справочник API

### `shallow(component)`

Создаёт обёртку для React-узла. Если корень — функция или класс, выполняет его описанным выше способом. Если это элемент вроде `<div />`, оборачивает его напрямую.

Аргумент настроек, опция `disableLifecycleMethods` и generic-параметр TypeScript не поддерживаются.

### `find(selector)`

Ищет в выходном дереве элементов, включая его корень, и возвращает обёртку без выполнения найденных компонентов. Поддерживаемые селекторы:

| Селектор         | Что ищет                                  |
| ---------------- | ----------------------------------------- |
| `find(Child)`    | Компонент по ссылке на функцию или класс. |
| `find('Child')`  | Компонент по имени или `displayName`.     |
| `find('button')` | Элемент по имени тега.                    |
| `find('.save')`  | Элемент тега с указанным классом.         |
| `find('#save')`  | Элемент тега с указанным ID.              |

Это не полноценный движок CSS-селекторов. Не поддерживаются селекторы атрибутов вроде `button[type="submit"]`, составные селекторы вроде `button.save` и селекторы потомков.

`find` обходит React-элементы, которые уже есть в выходной структуре, и переданные им children. Он не рендерит детей для поиска дополнительных элементов. У обёртки нет `length`, `at()` и API перебора. Для нескольких совпадений используйте `exists()`, чтобы проверить наличие результата, а для чтения props — уникальный селектор. Не продолжайте цепочку поиска и не ожидайте сериализации отдельных элементов на результате с несколькими совпадениями.

### `props()` и `prop(name)`

`props()` возвращает props текущего элемента, а `prop(name)` — одно значение. Их смысл зависит от обёртки:

- Для `shallow(<Parent ... />)` это **входные props Parent**, а не props первого элемента, который вернул Parent.
- После `find` с ровно одним совпадением это **props найденного элемента**.
- После поиска с нулём или несколькими совпадениями `props()` возвращает `{}`, а `prop(name)` — `undefined`.

```jsx
function Greeting({ name }) {
  return <h1 id="greeting">{name}</h1>;
}

const wrapper = shallow(<Greeting name="Ada" />);
wrapper.prop('name'); // 'Ada': входной prop компонента Greeting
wrapper.prop('id'); // undefined: входного prop id у Greeting нет
wrapper.find('h1').prop('id'); // 'greeting': prop выходного элемента
```

### `exists()`

На результате поиска проверяет, найден ли хотя бы один элемент:

```jsx
const wrapper = shallow(
  <section>
    <button>Save</button>
  </section>,
);
wrapper.find('button').exists(); // true
wrapper.find('input').exists(); // false
```

### Методы вывода и отладки

| Метод                   | Результат                                      |
| ----------------------- | ---------------------------------------------- |
| `text()`                | Многострочное дерево с тегами, без props.      |
| `textInline()`          | Дерево в одну строку с тегами, без props.      |
| `textWithProps()`       | Многострочное дерево с сериализованными props. |
| `textWithPropsInline()` | Дерево в одну строку с сериализованными props. |

Несмотря на название, `text()` возвращает представление дерева, а не обычный текст или DOM HTML. Функции в props отображаются как `function`, остальные значения сериализуются в JSON. Эти методы предназначены для отладки и снимков дерева элементов, а не для генерации веб-страниц.

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

Объявления типов входят в пакет. Используйте `shallow(element)`, а не `shallow<Props>(element)`. Тип значения prop не выводится из props компонента: проверяйте его перед использованием. Переменная типа `unknown` делает необходимость проверки явной для TypeScript:

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

Для отдельного TypeScript-проекта добавьте `typescript` и `@types/react` в devDependencies и включите JSX в конфигурации TypeScript. Настройки есть в [запускаемом примере](../examples/component-contracts).

## Миграция с Enzyme

Shallowly предоставляет похожий на Enzyme API для части изолированных тестов. Полной совместимости для замены библиотеки одним импортом нет.

| Паттерн Enzyme                               | Поведение или замена в Shallowly                                       |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `shallow`, `find`, `props`, `prop`, `exists` | Доступны с описанными выше правилами селекторов и props.               |
| `.text()`                                    | Сериализует теги и структуру; проверки обычного текста нужно изменить. |
| `.setProps(nextProps)`                       | Создайте новую обёртку с нужными props.                                |
| `.setState()`, `.instance()`                 | Не реализованы. Мокируйте зависимости и проверяйте результат.          |
| `.simulate('click')`                         | Прочитайте `onClick` и вызовите функцию с нужными аргументами.         |
| `.at(index)`, `.length`                      | Не реализованы; для проверки props найдите уникальный элемент.         |
| Сложные CSS-селекторы                        | Замените на поддерживаемые простые селекторы.                          |
| Настройки жизненного цикла                   | Не реализованы; не полагайтесь на имитацию жизненного цикла React.     |

Например, существующий тест Enzyme со spy `onSave` мог выглядеть так:

```jsx
// Enzyme
const wrapper = shallow(<SaveButton onSave={onSave} />);
wrapper.find('button').simulate('click');
```

Соответствующий тест Shallowly:

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

Чтобы проверить другие входные props, создавайте независимые обёртки:

```jsx
function Status({ error }) {
  return <section>{error ? <p className="error">{error}</p> : null}</section>;
}

const normal = shallow(<Status />);
const failed = shallow(<Status error="Save failed" />);
normal.find('.error').exists(); // false
failed.find('.error').textInline(); // '<p>Save failed</p>'
```

## Дополнительные материалы

- [Структура компонента, props, callbacks и моки хуков](./testing-component-contracts.md)
- [Руководство по архитектуре React](./react-architecture-ru.md)
- [Заявления о производительности и отдельная задача бенчмарка](../README.md#performance)
- [Руководство разработки](./dev.ru.md) · [Участие в проекте](./CONTRIBUTING.ru.md)
- [Сообщить о проблеме](https://github.com/bad4iz/shallowly/issues)

MIT © [Bad4iz](https://github.com/bad4iz)
