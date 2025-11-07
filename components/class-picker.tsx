import { getClassImage } from '@/lib/get-images';
import { PlayerClass } from '@/lib/types';

interface ClassPickerProps {
  selectedClass: PlayerClass | null;
  onSelectClass: (playerClass: PlayerClass) => void;
}

export function ClassPicker({ selectedClass, onSelectClass }: ClassPickerProps) {
  const classes = Object.values(PlayerClass);

  // Class color themes for visual feedback
  const getClassColor = (cls: PlayerClass): string => {
    const colorMap: Record<PlayerClass, string> = {
      [PlayerClass.Warrior]: 'amber',
      [PlayerClass.Paladin]: 'pink',
      [PlayerClass.Hunter]: 'green',
      [PlayerClass.Rogue]: 'yellow',
      [PlayerClass.Priest]: 'gray',
      [PlayerClass.Shaman]: 'blue',
      [PlayerClass.Mage]: 'cyan',
      [PlayerClass.Warlock]: 'purple',
      [PlayerClass.Druid]: 'orange',
    };
    return colorMap[cls] || 'blue';
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    if (isSelected) {
      const colorStyles: Record<string, string> = {
        amber: 'bg-amber-500/30 border-amber-400/60 shadow-lg shadow-amber-500/50',
        pink: 'bg-pink-500/30 border-pink-400/60 shadow-lg shadow-pink-500/50',
        green: 'bg-green-500/30 border-green-400/60 shadow-lg shadow-green-500/50',
        yellow: 'bg-yellow-500/30 border-yellow-400/60 shadow-lg shadow-yellow-500/50',
        gray: 'bg-gray-400/30 border-gray-300/60 shadow-lg shadow-gray-500/50',
        blue: 'bg-blue-500/30 border-blue-400/60 shadow-lg shadow-blue-500/50',
        cyan: 'bg-cyan-500/30 border-cyan-400/60 shadow-lg shadow-cyan-500/50',
        purple: 'bg-purple-500/30 border-purple-400/60 shadow-lg shadow-purple-500/50',
        orange: 'bg-orange-500/30 border-orange-400/60 shadow-lg shadow-orange-500/50',
      };
      return colorStyles[color];
    }
    return 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40';
  };

  const getGlowClasses = (color: string) => {
    const glowStyles: Record<string, string> = {
      amber: 'from-amber-400/20 via-transparent to-amber-600/20',
      pink: 'from-pink-400/20 via-transparent to-pink-600/20',
      green: 'from-green-400/20 via-transparent to-green-600/20',
      yellow: 'from-yellow-400/20 via-transparent to-yellow-600/20',
      gray: 'from-gray-300/20 via-transparent to-gray-500/20',
      blue: 'from-blue-400/20 via-transparent to-blue-600/20',
      cyan: 'from-cyan-400/20 via-transparent to-cyan-600/20',
      purple: 'from-purple-400/20 via-transparent to-purple-600/20',
      orange: 'from-orange-400/20 via-transparent to-orange-600/20',
    };
    return glowStyles[color];
  };

  const getCheckmarkClasses = (color: string) => {
    const checkmarkStyles: Record<string, string> = {
      amber: 'from-amber-400 to-amber-600',
      pink: 'from-pink-400 to-pink-600',
      green: 'from-green-400 to-green-600',
      yellow: 'from-yellow-400 to-yellow-600',
      gray: 'from-gray-300 to-gray-500',
      blue: 'from-blue-400 to-blue-600',
      cyan: 'from-cyan-400 to-cyan-600',
      purple: 'from-purple-400 to-purple-600',
      orange: 'from-orange-400 to-orange-600',
    };
    return checkmarkStyles[color];
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-fit">
      {classes.map((wowClass) => {
        const isSelected = selectedClass === wowClass;
        const classColor = getClassColor(wowClass);

        return (
          <button
            key={wowClass}
            onClick={() => onSelectClass(wowClass)}
            className={`
              group relative w-20 h-20 rounded-xl overflow-hidden
              transition-all duration-500 ease-out
              ${isSelected ? 'scale-110 shadow-2xl' : 'scale-100 hover:scale-105'}
            `}
            title={wowClass}
          >
            {/* Glassmorphism container */}
            <div
              className={`
              absolute inset-0 rounded-xl backdrop-blur-sm border-2
              transition-all duration-500
              ${getColorClasses(classColor, isSelected)}
            `}
            >
              {/* Image */}
              <img
                src={getClassImage(wowClass)}
                alt={wowClass}
                className="w-full h-full object-cover"
              />

              {/* Selection glow overlay */}
              {isSelected && (
                <div
                  className={`
                  absolute inset-0 pointer-events-none
                  bg-linear-to-br ${getGlowClasses(classColor)}
                  animate-pulse-slow
                `}
                />
              )}

              {/* Hover shine effect */}
              <div className="absolute inset-0 bg-linear-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Selected checkmark */}
            {isSelected && (
              <div
                className={`
                absolute -top-1 -right-1 w-7 h-7 rounded-full
                flex items-center justify-center z-10
                bg-linear-to-br ${getCheckmarkClasses(classColor)}
                shadow-lg animate-check-pop
              `}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}

            {/* Class name tooltip on hover */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-20 border border-white/20">
              {wowClass}
            </div>
          </button>
        );
      })}
    </div>
  );
}
