import { ShallowWrapper } from './ShallowWrapper';

/**
 * Создает shallow-обертку для React-компонента.
 *
 * @param component - React-компонент или элемент для рендеринга.
 * @returns {ShallowWrapper} Обертка для поверхностного рендеринга.
 */
function shallow(component: React.ReactElement | React.ReactNode[]): ShallowWrapper {
  // Cast to any to satisfy constructor typing differences.
  return new ShallowWrapper(component as unknown);
}

export { shallow };
