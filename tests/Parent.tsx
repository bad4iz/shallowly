import React from 'react';

import { Button } from './Button';
import { Children } from './Children';

/**
 * Parent.
 *
 * @returns JSX.Element.
 */
export const Parent = () => {
  return (
    <div>
      <Children title="title" />
      <Button onClick={() => {}} />
    </div>
  );
};
