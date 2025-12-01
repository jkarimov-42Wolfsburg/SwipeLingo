'use client';

interface MatchCardProps {
  id: string;
  name: string;
  photoUrl?: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: boolean;
  onClick?: () => void;
}

export function MatchCard({
  name,
  photoUrl,
  lastMessage,
  timestamp,
  unread,
  onClick,
}: MatchCardProps) {
  return (
    <div
      className="card cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4"
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-primary">{name.charAt(0)}</span>
          )}
        </div>
        {unread && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold truncate ${unread ? 'text-foreground' : ''}`}>
            {name}
          </h3>
          {timestamp && (
            <span className="text-xs text-hint flex-shrink-0 ml-2">{timestamp}</span>
          )}
        </div>
        {lastMessage && (
          <p className={`text-sm truncate ${unread ? 'text-foreground' : 'text-hint'}`}>
            {lastMessage}
          </p>
        )}
      </div>
    </div>
  );
}
