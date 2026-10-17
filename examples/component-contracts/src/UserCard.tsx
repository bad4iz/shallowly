import { useState } from 'react';

export interface UserCardProps {
  name: string;
  onSelect: () => void;
}

export function UserCard({ name, onSelect }: UserCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article>
      <h2>{name}</h2>
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide details' : 'Show details'}
      </button>
      {expanded && <p>Profile details</p>}
      <button onClick={onSelect}>Select profile</button>
    </article>
  );
}
