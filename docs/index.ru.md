# 📚 Документация Shallowly

# Shallowly

### Лучшая библиотека для юнит-тестирования React-компонентов

Точное, сфокусированное и молниеносное юнит-тестирование для React

[🇬🇧 Read in English](/docs/index.md)

---

[Установка](#установка) • 
[Быстрый старт](#быстрый-старт) • 
[API](#api) • 
[GitHub](https://github.com/bad4iz/shallowly)

[![версия npm](https://img.shields.io/npm/v/shallowly?style=flat-square)](https://www.npmjs.com/package/shallowly)
[![размер](https://img.shields.io/bundlephobia/minzip/shallowly?style=flat-square)](https://bundlephobia.com/package/shallowly)
[![статус сборки](https://img.shields.io/github/actions/workflow/status/bad4iz/shallowly/tests.yml?style=flat-square)](https://github.com/bad4iz/shallowly/actions)
[![покрытие тестами](https://img.shields.io/codecov/c/github/bad4iz/shallowly?style=flat-square)](https://codecov.io/gh/bad4iz/shallowly)

---

## Почему Shallowly для юнит-тестирования?

Shallowly создан специально для юнит-тестирования React-компонентов, предлагая уровень точности и производительности, недоступный инструментам интеграционного тестирования. В отличие от других решений, которые поощряют тестирование деталей реализации, Shallowly сфокусирован исключительно на принципах юнит-тестирования:

- 🎯 **Настоящее юнит-тестирование** - Единственная библиотека, созданная специально для юнит-тестов, а не интеграционных тестов
- ⚡ **Молниеносная скорость** - Рендерит только один уровень в глубину, пропуская ненужный рендеринг дочерних компонентов
- 🧪 **Идеальная изоляция** - Каждый компонент тестируется в полной изоляции от своих детей
- 🔍 **Сфокусированные утверждения** - Тестируйте именно то, что важно, не беспокоясь о поведении дочерних компонентов
- 🚫 **Больше никакой избыточности** - Пропустите настройку test runner'а и сосредоточьтесь на написании тестов

> **Зачем юнит-тестирование?** Юнит-тесты проверяют отдельные модули кода изолированно, что делает их быстрее, надежнее и проще в отладке по сравнению с интеграционными тестами. Shallowly - единственная библиотека, которая действительно придерживается этой философии для React-компонентов.

## Стандарт юнит-тестирования для React

Shallowly - это де-факто стандарт для юнит-тестирования React-компонентов. В то время как другие библиотеки заставляют вас тестировать детали реализации или требуют полного рендеринга DOM, Shallowly предоставляет точность и скорость, необходимые для правильного юнит-тестирования.

### Ключевые преимущества для юнит-тестирования:

- **Без глубокого рендеринга** - Тестируйте компоненты в полной изоляции
- **Без test runner'а** - Работает с любым test runner'ом
- **Без браузерного окружения** - Запускайте тесты прямо в Node.js
- **Без внешних зависимостей** - Легковесный и сфокусированный на юнит-тестировании

## Установка стандарта юнит-тестирования

Shallowly - это не просто еще одна библиотека для тестирования, а стандарт для юнит-тестирования React-компонентов. В то время как другие решения требуют сложной настройки и браузерного окружения, Shallowly работает из коробки.

```bash
# С использованием npm
npm install --save-dev shallowly

# С использованием yarn
yarn add --dev shallowly

# С использованием pnpm
pnpm add --save-dev shallowly
```

## Юнит-тестирование с Shallowly: Быстрый старт

Вот как написать ваш первый юнит-тест с Shallowly. Обратите внимание, как мы фокусируемся на тестировании компонента в изоляции:

```jsx
import { shallow } from 'shallowly';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('рендерится с пропсами по умолчанию', () => {
    const wrapper = shallow(<MyComponent name="Иван" />);
    expect(wrapper.text()).toContain('Привет, Иван');
  });
});
```

## Справочник API для юнит-тестирования

API Shallowly разработано специально для юнит-тестирования React-компонентов. Каждый метод оптимизирован для ясности, точности и скорости в контексте юнит-тестирования.

### `shallow(component: ReactElement, options?: Object) => ShallowWrapper`

Основная функция, создающая shallow-обертку вокруг вашего React-компонента.

**Параметры:**

- `component`: React-элемент для поверхностного рендеринга
- `options`: (Опционально) Объект конфигурации
  - `disableLifecycleMethods`: (Boolean) Отключить выполнение методов жизненного цикла (по умолчанию: `false`)

**Пример:**

```jsx
import { shallow } from 'shallowly';
import MyComponent from './MyComponent';

const wrapper = shallow(<MyComponent name="Иван" />);
```

### `ShallowWrapper`

#### `text() => string`

Возвращает строковое представление дерева отрендеренных компонентов.

**Пример:**

```jsx
const wrapper = shallow(
  <div>
    <h1>Привет</h1>
    <p>Мир</p>
  </div>,
);
console.log(wrapper.text());
// Вывод:
// <div>
//   <h1>Привет</h1>
//   <p>Мир</p>
// </div>
```

#### `prop(name: string) => any`

Возвращает значение пропса по имени.

**Пример:**

```jsx
const wrapper = shallow(<User name="Иван" age={30} />);
console.log(wrapper.prop('name')); // "Иван"
console.log(wrapper.prop('age')); // 30
```

#### `props() => Object`

Возвращает все пропсы корневого компонента.

**Пример:**

```jsx
const wrapper = shallow(<User name="Иван" age={30} />);
console.log(wrapper.props());
// { name: "Иван", age: 30 }
```

#### `find(selector: string | ComponentType) => ShallowWrapper`

Находит все узлы в дереве рендеринга, соответствующие указанному селектору.

**Поддерживаемые селекторы:**

- Конструктор компонента: `find(MyComponent)`
- Имя компонента: `find('MyComponent')`
- CSS-селектор: `find('.class')`, `find('#id')`, `find('div')`

**Пример:**

```jsx
const wrapper = shallow(
  <div>
    <Button>Нажми меня</Button>
    <Button>Не нажимай</Button>
  </div>,
);

const buttons = wrapper.find(Button);
console.log(buttons.length); // 2
```

#### `textWithProps() => string`

Возвращает строковое представление дерева компонентов, включая пропсы.

**Пример:**

```jsx
const wrapper = shallow(
  <div className="container">
    <User name="Иван" age={30} />
  </div>,
);

console.log(wrapper.textWithProps());
// Вывод:
// <div className="container">
//   <User name="Иван" age=30 />
// </div>
```

#### `exists() => boolean`

Проверяет, существует ли элемент в дереве рендеринга.

**Пример:**

```jsx
const wrapper = shallow(
  <div>
    <span>Привет</span>
  </div>,
);
console.log(wrapper.find('span').exists()); // true
console.log(wrapper.find('button').exists()); // false
```

## Примеры

### Тестирование вывода компонента

```jsx
test('отображает имя пользователя', () => {
  const wrapper = shallow(<User name="Иван" />);
  expect(wrapper.text()).toContain('Иван');
});
```

### Тестирование пропсов

```jsx
test('передает правильные пропсы в кнопку', () => {
  const onClick = jest.fn();
  const wrapper = shallow(<LoginForm onSubmit={onClick} />);

  const button = wrapper.find('button[type="submit"]');
  button.prop('onClick')();

  expect(onClick).toHaveBeenCalled();
});
```

### Тестирование условного рендеринга

```jsx
test('показывает ошибку при её наличии', () => {
  // Изначально ошибки нет
  const wrapper = shallow(<Form />);
  expect(wrapper.find('.error').exists()).toBe(false);

  // После появления ошибки
  wrapper.setProps({ error: 'Что-то пошло не так' });
  expect(wrapper.find('.error').text()).toBe('Что-то пошло не так');
});
```

## Почему Shallowly лучше других библиотек

### Shallowly против других решений

| Возможность                | Shallowly            | Enzyme       | React Testing Library          |
| -------------------------- | -------------------- | ------------ | ------------------------------ |
| **Философия тестирования** | 🎯 Юнит-тестирование | ❓ Смешанная | ❌ Интеграционное тестирование |
| **Рендеринг**              | 🔍 Только Shallow    | ⚠️ Смешанный | ❌ Полный DOM                  |
| **Скорость**               | ⚡ Молниеносная      | 🐌 Низкая    | 🐢 Очень низкая                |
| **Изоляция**               | ✅ Идеальная         | ❌ Плохая    | ❌ Отсутствует                 |
| **Фокус API**              | 🎯 Юнит-тестирование | 🔄 Общий     | ❌ Интеграционное тестирование |
| **Размер**                 | 📦 Ультра-легкий     | 📦📦 Тяжелый | 📦📦📦 Очень тяжелый           |

### Миграция с Enzyme

Если вы переходите с Enzyme, вот как Shallowly предлагает лучший опыт юнит-тестирования:

| Возможность             | Enzyme.shallow | Shallowly            |
| ----------------------- | -------------- | -------------------- |
| Поверхностный рендеринг | ✅ Да          | ✅ Да                |
| find() по компоненту    | ✅ Да          | ✅ Да                |
| find() по CSS           | ✅ Да          | ✅ Базовая поддержка |
| setProps()              | ✅ Да          | 🔜 В разработке      |
| setState()              | ✅ Да          | 🔜 В разработке      |
| simulate()              | ✅ Да          | 🔜 В разработке      |
| Доступ к инстансу       | ✅ Да          | 🔜 В разработке      |
| Методы жизненного цикла | ✅ Да          | ✅ Частично          |
| Размер (min+gzip)       | ~100KB         | ~5KB                 |

## Вклад в проект

Мы приветствуем вклад в проект! Пожалуйста, прочитайте наше [Руководство по вкладу](docs/CONTRIBUTING.ru.md), чтобы начать.

## Лицензия

MIT © [Bad4iz](https://github.com/bad4iz)

---

> "Простота — это высшая степень утончённости."  
> _Леонардо да Винчи_

[English Version](/docs/index.md)
[Development Guide](/docs/dev.ru.md) | [Руководство разработки](/docs/dev.ru.md)
