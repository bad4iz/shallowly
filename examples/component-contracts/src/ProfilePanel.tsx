import { UserCard } from './UserCard';
import { useProfile } from './useProfile';

export interface ProfilePanelProps {
  onProfileSelected: (profileId: string) => void;
}

export function ProfilePanel({ onProfileSelected }: ProfilePanelProps) {
  const state = useProfile();

  if (state.status === 'loading') {
    return <p role="status">Loading profile...</p>;
  }

  return (
    <section aria-label="Profile">
      <h1>Your profile</h1>
      <UserCard name={state.profile.name} onSelect={() => onProfileSelected(state.profile.id)} />
    </section>
  );
}
