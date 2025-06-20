import React from 'react';

import { Button } from './Button';
import { Children } from './Children';

/**
 * Parent.
 *
 * @param root0 - Component props.
 * @param root0.onClick - Click handler callback.
 * @returns JSX.Element.
 */
export const Parent = ({ onClick }: { onClick: () => void }) => {
  return (
    <div>
      <Children title="title" />
      <Button onClick={onClick} />
    </div>
  );
};
