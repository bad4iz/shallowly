import React from 'react';

import { Button } from './Button';
import { Children } from './Children';

/**
 * Parent.
 *
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
