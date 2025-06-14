import React from 'react';

/**
 * Children.
 *
 * @param props - Props.
 * @param props.title - Title.
 * @returns JSX.Element.
 */
export const Children = (props: { title: string }) => {
  return <div>Children {props.title}</div>;
};
