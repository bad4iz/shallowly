import type { ReactNode } from 'react';

import { ShallowWrapper } from './ShallowWrapper';

/**
 * Создает shallow-обертку для React-ноды.
 *
 * @param component - React-нода для рендеринга.
 * @returns {ShallowWrapper} Обертка для поверхностного рендеринга.
 */
function shallow(component: ReactNode): ShallowWrapper {
  return new ShallowWrapper(component);
}

export { shallow };
