import { useState } from 'react';

export interface Profile {
  id: string;
  name: string;
}

export type ProfileState = { status: 'loading' } | { status: 'ready'; profile: Profile };

// Local demo data keeps the example independent of a server or data library.
// The component tests mock this hook's result instead of running React state.
export function useProfile(): ProfileState {
  const [state] = useState<ProfileState>({
    status: 'ready',
    profile: { id: 'ada', name: 'Ada Lovelace' },
  });

  return state;
}
