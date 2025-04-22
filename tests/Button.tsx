import React from "react";

export const Button = (props: { onClick: () => void }) => {
  const [state, setState] = React.useState(0);

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
