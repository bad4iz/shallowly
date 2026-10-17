import type { ReactElement, ReactNode } from 'react';

import { ShallowWrapper } from './ShallowWrapper';

/**
 * Создает shallow-обертку для React-компонента.
 *
 * @param component - React-компонент или массив React-нод для рендеринга.
 * @returns {ShallowWrapper} Обертка для поверхностного рендеринга.
 */
function shallow(component: ReactElement | ReactNode[]): ShallowWrapper {
  return new ShallowWrapper(component);
}

export { shallow };
