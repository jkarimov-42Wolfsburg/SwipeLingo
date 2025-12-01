'use client';

interface TeacherCardProps {
  id: string;
  name: string;
  subject: string;
  rating: number;
  reviews: number;
  photoUrl?: string;
  hourlyRate?: number;
  onClick?: () => void;
}

export function TeacherCard({
  name,
  subject,
  rating,
  reviews,
  photoUrl,
  hourlyRate,
  onClick,
}: TeacherCardProps) {
  return (
    <div
      className="card cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-primary">{name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{name}</h3>
          <p className="text-sm text-hint">{subject}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-amber-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span className="text-sm ml-1">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-hint">({reviews} reviews)</span>
          </div>
        </div>
        {hourlyRate && (
          <div className="text-right">
            <p className="font-semibold text-primary">${hourlyRate}</p>
            <p className="text-xs text-hint">/hour</p>
          </div>
        )}
      </div>
    </div>
  );
}
