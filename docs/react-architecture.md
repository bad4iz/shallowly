# Recommended React Application Architecture

## Introduction

This document presents an approach for creating scalable and maintainable React applications, based on best practices and principles.

## Architectural Principles

### 1. Component Approach

Each component should be:

- **Isolated** - minimal dependency on external state
- **Reusable** - with a clear interface
- **Responsible for a single task** - the single responsibility principle

### 2. Separation of Presentation and Logic

#### ❌ Anti-pattern: all logic inside the component

When logic is mixed with presentation (common writing style for most React developers), the component becomes difficult to read, hard to test, and challenging to maintain:

```tsx
// Anti-pattern: component with embedded logic
const ButtonWithLogic = ({ text, onClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState({ canClick: true });

  useEffect(() => {
    // Request to check permissions
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

  // there could be many conditions and checks spanning thousands of lines )))

  // JSX with numerous conditions and checks
  return (
    <button onClick={handleClick} disabled={isLoading || !permissions.canClick}>
      {isLoading ? 'Loading...' : text}
      {error && <span>Error!</span>}
    </button>
  );
};
```

#### ✅ Best practice: separating logic into a hook

A good practice is to extract all logic into a custom `useSetupComponent` hook that handles the business logic, while the component remains clean and only responsible for rendering:

```tsx
// 1. Type definitions
interface ButtonProps {
  text: string;
  permissionKey?: string;
  onClick?: () => Promise<any> | void;
  options?: ButtonOptions;
}

// 2. Hook for logic (interface only, without implementation)
const useSetupButton = (props: ButtonProps) => {
  // All logic is encapsulated here
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

// 3. Clean component
const Button = (props: ButtonProps) => {
  // Use the hook to get everything needed
  const { isLoading, isDisabled, error, handleClick, displayText, showError, buttonProps } =
    useSetupButton(props);

  // The component is simple and readable
  return (
    <button onClick={handleClick} disabled={isDisabled} {...buttonProps}>
      {isLoading ? 'Loading...' : displayText}
      {showError && <span className="error">{error.message}</span>}
    </button>
  );
};
```

## Testing

### Examples of tests using shallowly

#### Testing a component with useSetup

```jsx
import { shallow } from 'shallowly';
import { vi } from 'vitest';
import { Button } from './Button';
import { useSetupButton } from './useSetupButton';

// Mock the hook that contains the logic
vi.mock('./useSetupButton');

describe('🐛 spec Button', () => {
  it('🧪 renders with the passed text', () => {
    expect.hasAssertions();

    // ☣️ Arrange - mock the return value of the hook
    useSetupButton.mockReturnValue({
      isLoading: 'isLoading',
      isDisabled: 'isDisabled',
      buttonText: 'Test Button',
      handleClick: 'handleClick', // string value for snapshot
      showError: 'showError',
      error: 'error',
      buttonProps: {},
    });

    const props = {
      onClick: vi.fn(),
      children: 'Not important, it\'s mocked',
    };

    // 🔥 Act - render the component
    const wrapper = shallow(<Button {...props} />);

    // ❓ Assert - check the snapshot
    expect(wrapper.textWithProps()).toMatchSnapshot();
  });
});
```

#### Testing a hook with logic

A hook can be tested using two main approaches:

##### 1. Integration Testing

> Using **Testing Library** to render a component that uses the hook.

With this approach:

- Hook interaction with the component is verified
- Hook behavior is tested in a real React application context
- Interaction issues between the component and hook are identified

##### 2. Unit Testing

> Testing the hook as a regular function by mocking dependencies.

Features of this approach:

- All dependencies (React hooks and custom hooks) are replaced with mocks
- Internal behavior of these mocked hook functions is not tested
- Focus exclusively on the logic of the hook being tested
- Faster and isolated tests

## Conclusion

Extracting logic into a `useSetupComponent` hook (or any other specialized hook) provides:

1. **Clean components** — the component only handles rendering
2. **Reusable logic** — logic can be used in different components
3. **Testability** — logic and presentation can be tested separately
4. **Separation of concerns** — different developers can work on logic and UI
5. **Maintainability** — changes in logic don't affect the component and vice versa

## Recommended Testing Pattern with useSetup

### Approach Features

For testing components with logic extracted into a `useSetup` hook, it is recommended to use the `shallowly` library for shallow rendering, which provides the following benefits:

1. Easy mocking of hooks
2. No need to test hook logic in component tests
3. Focus on checking proper prop passing and rendering
4. Using snapshots for quick detection of UI changes

### File Naming

Recommended convention:

- Test files should have the `.spec.jsx` extension
- Hook file: `useSetup<ComponentName>.ts`
- Component file: `<ComponentName>.tsx`

### Example of Testing a Component with useSetup

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
      // component props
    };

    //🔥 Act
    const wrapper = shallow(<Component {...props} />);

    //❓ Assert
    expect(wrapper.textWithProps()).toMatchSnapshot();
  });
});
```

### Key Features of this Approach

1. **Mocking with strings instead of functions**: values from the hook are replaced with strings, making it easier to track their usage in snapshots

2. **No checks for function calls**: it is sufficient to verify that props are correctly passed through the snapshot

3. **Using `.textWithProps()`**: allows you to see both text content and passed props

4. **Three-stage test structure**:
   - Arrange: setting up mocks and props
   - Act: rendering the component
   - Assert: verifying the result

### Benefits of this Approach

- **Simplicity**: tests are short and clear
- **Isolation**: testing only the presentation, not the logic
- **Speed**: snapshots are faster than checking each element
- **Maintainability**: when changing a component, you don't need to rewrite many checks

## Example Project File Structure

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx              # Component (presentation)
│       ├── useSetupButton.ts       # Hook (logic)
│       ├── Button.spec.jsx         # Component test
│       └── useSetupButton.spec.ts  # Hook test
```

## Additional Resources

- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Custom React Hooks](https://reactjs.org/docs/hooks-custom.html)
- [Testing Library for React Hooks](https://react-hooks-testing-library.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Shallowly GitHub Repository](https://github.com/bad4iz/shallowly)
