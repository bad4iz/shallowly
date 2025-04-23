import React from 'react';

/**
 * Button.
 *
 * @param props - Props.
 * @param props.onClick - OnClick.
 * @returns JSX.Element.
 */
export const Button = (props: { onClick: () => void }) => {
  const [state, setState] = React.useState(0);

  /**
   * Increment.
   */
  const increment = () => {
    setState(state + 1);
    props.onClick();
  };

  return (
    <div>
      <button onClick={increment}>Click me {state}</button>
    </div>
  );
};
