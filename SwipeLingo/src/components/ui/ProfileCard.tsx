'use client';

interface ProfileCardProps {
  name: string;
  username?: string;
  photoUrl?: string;
  bio?: string;
}

export function ProfileCard({ name, username, photoUrl, bio }: ProfileCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-primary">{name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{name}</h3>
          {username && <p className="text-hint text-sm">@{username}</p>}
        </div>
      </div>
      {bio && <p className="mt-3 text-sm text-hint">{bio}</p>}
    </div>
  );
}
