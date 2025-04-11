import { ShallowWrapper } from "./ShallowWrapper";

/**
 * Создает shallow-обертку для React-компонента.
 * @param {React.ReactNode} component - React-компонент или элемент для рендеринга.
 * @returns {ShallowWrapper} Обертка для поверхностного рендеринга.
 */
function shallow(component) {
  return new ShallowWrapper(component);
}

export { shallow };
