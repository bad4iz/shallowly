# Рекомендуемая архитектура React-приложений

## Введение

В этом документе представлен подход к созданию масштабируемых и поддерживаемых React-приложений, основанный на лучших практиках и принципах.

## Архитектурные принципы

### 1. Компонентный подход

Каждый компонент должен быть:

- **Изолированным** - минимальная зависимость от внешнего состояния
- **Переиспользуемым** - с понятным интерфейсом
- **Отвечающим за одну задачу** - принцип единственной ответственности

### 2. Разделение представления и логики

#### ❌ Антипаттерн: вся логика внутри компонента

Когда логика смешивается с представлением (обычное написание большинства компонентов реакт разработчиками), компонент становится трудночитаемым, сложным для тестирования и тяжело поддерживаемым:

```tsx
// Антипаттерн: компонент с внедренной логикой
const ButtonWithLogic = ({ text, onClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState({ canClick: true });

  useEffect(() => {
    // Запрос на проверку прав
    checkPermissions().then(setPermissions);
  }, []);

  const handleClick = async () => {
    if (!permissions.canClick) return;

    setIsLoading(true);
    try {
      await onClick();
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // тут может быть множество условий и проверок на тысячи строк )))

  // JSX с множеством условий и проверок
  return (
    <button onClick={handleClick} disabled={isLoading || !permissions.canClick}>
      {isLoading ? 'Загрузка...' : text}
      {error && <span>Ошибка!</span>}
    </button>
  );
};
```

#### ✅ Лучшая практика: выделение логики в хук

Хорошей практикой является вынос всей логики в кастомный хук `useSetupComponent`, который отвечает за бизнес-логику, а компонент остается чистым и отвечает только за отображение:

```tsx
// 1. Определение типов
interface ButtonProps {
  text: string;
  permissionKey?: string;
  onClick?: () => Promise<any> | void;
  options?: ButtonOptions;
}

// 2. Хук для логики (без реализации, только интерфейс)
const useSetupButton = (props: ButtonProps) => {
  // Вся логика инкапсулирована здесь
  // ...

  return {
    isLoading,
    isDisabled,
    error,
    handleClick,
    displayText,
    showError,
    buttonProps,
  };
};

// 3. Чистый компонент
const Button = (props: ButtonProps) => {
  // Используем хук для получения всего необходимого
  const { isLoading, isDisabled, error, handleClick, displayText, showError, buttonProps } =
    useSetupButton(props);

  // Компонент простой и читаемый
  return (
    <button onClick={handleClick} disabled={isDisabled} {...buttonProps}>
      {isLoading ? 'Загрузка...' : displayText}
      {showError && <span className="error">{error.message}</span>}
    </button>
  );
};
```

## Тестирование

### Примеры тестов с использованием shallowly

#### Тестирование компонента с useSetup

```jsx
import { shallow } from 'shallowly';
import { vi } from 'vitest';
import { Button } from './Button';
import { useSetupButton } from './useSetupButton';

// Мокируем хук, который содержит логику
vi.mock('./useSetupButton');

describe('🐛 spec Button', () => {
  it('🧪 рендерится с переданным текстом', () => {
    expect.hasAssertions();

    // ☣️ Arrange - мокируем возвращаемое значение хука
    useSetupButton.mockReturnValue({
      isLoading: 'isLoading',
      isDisabled: 'isDisabled',
      buttonText: 'Тестовая кнопка',
      handleClick: 'handleClick', // строковое значение для снапшота
      showError: 'showError',
      error: 'error',
      buttonProps: {},
    });

    const props = {
      onClick: vi.fn(),
      children: 'Неважно, это замокано',
    };

    // 🔥 Act - рендерим компонент
    const wrapper = shallow(<Button {...props} />);

    // ❓ Assert - проверяем снапшот
    expect(wrapper.textWithProps()).toMatchSnapshot();
  });
});
```

#### Тестирование хука с логикой

Хук можно тестировать двумя основными подходами:

##### 1. Интеграционное тестирование

> Используя **Testing Library** для рендеринга компонента, который использует хук.

При этом подходе:

- Проверяется взаимодействие хука с компонентом
- Тестируется поведение хука в реальном контексте React-приложения
- Выявляются проблемы взаимодействия между компонентом и хуком

##### 2. Модульное (unit) тестирование

> Тестирование хука как обычной функции, с мокированием зависимостей.

Особенности этого подхода:

- Все зависимости (хуки React и пользовательские хуки) заменяются моками
- Внутреннее поведение мокнутых функций-хуков не тестируется
- Фокус исключительно на логике тестируемого хука
- Более быстрые и изолированные тесты

## Заключение

Вынос логики в хук `useSetupComponent` (или любой другой специализированный хук) обеспечивает:

1. **Чистоту компонента** — компонент занимается только отображением
2. **Переиспользуемость логики** — логику можно использовать в разных компонентах
3. **Тестируемость** — можно отдельно тестировать логику и отображение
4. **Разделение ответственности** — разные разработчики могут работать над логикой и UI
5. **Поддерживаемость** — изменения в логике не затрагивают компонент и наоборот

## Рекомендованный паттерн тестирования с useSetup

### Особенности подхода

Для тестирования компонентов с выделенной логикой в хуке `useSetup` рекомендуется использовать библиотеку для поверхностного рендера `shallowly`, которая дает следующие преимущества:

1. Простота мокирования хуков
2. Отсутствие необходимости тестировать логику хука в тесте компонента
3. Фокус на проверке правильности передачи пропсов и рендера
4. Использование снапшотов для быстрого обнаружения изменений в UI

### Именование файлов

Рекомендуемое соглашение:

- Тестовые файлы должны иметь расширение `.spec.jsx`
- Файл с хуком: `useSetup<ComponentName>.ts`
- Файл компонента: `<ComponentName>.tsx`

### Пример тестирования компонента с useSetup

```jsx
import { shallow } from 'shallowly';
import { vi } from 'vitest';

import { Component } from './Component';
import { useSetupComponent } from './useSetup.Component';

vi.mock('./useSetup.Component');

describe('🐛 spec Component', () => {
  it('🧪 default', () => {
    expect.hasAssertions();
    //☣️ Arrange
    useSetupComponent.mockReturnValue({
      approveGs: 'approveGs',
      closeDialog: 'closeDialog',
      isOpen: 'isOpen',
      openDialog: 'openDialog',
    });
    const props = {
      // пропсы компонента
    };

    //🔥 Act
    const wrapper = shallow(<Component {...props} />);

    //❓ Assert
    expect(wrapper.textWithProps()).toMatchSnapshot();
  });
});
```

### Ключевые особенности этого подхода

1. **Мокирование строками вместо функций**: значения из хука заменяются строками, что делает проще отслеживание их использования в снапшотах

2. **Отсутствие проверок вызовов функций**: достаточно проверить, что props правильно прокинуты через снапшот

3. **Использование `.textWithProps()`**: позволяет увидеть как текстовое содержимое, так и проброшенные пропсы

4. **Трехэтапная структура теста**:
   - Arrange: настройка моков и пропсов
   - Act: рендер компонента
   - Assert: проверка результата

### Преимущества этого подхода

- **Простота**: тесты короткие и понятные
- **Изолированность**: тестирование только представления, не логики
- **Скорость**: снапшоты быстрее, чем проверка каждого элемента
- **Поддерживаемость**: при изменении компонента не нужно переписывать много проверок

## Пример структуры файлов проекта

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx              # Компонент (представление)
│       ├── useSetupButton.ts       # Хук (логика)
│       ├── Button.spec.jsx         # Тест компонента
│       └── useSetupButton.spec.ts  # Тест хука
```

## Дополнительные материалы

- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Custom React Hooks](https://reactjs.org/docs/hooks-custom.html)
- [Testing Library for React Hooks](https://react-hooks-testing-library.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Shallowly GitHub Repository](https://github.com/bad4iz/shallowly)

```

```
