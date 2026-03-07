const Loader = ({ size = 'default', text = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    default: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizes[size]}`}>
        {/* Outer ring */}
        <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 border-r-purple-500 animate-spin`} />
        {/* Middle ring */}
        <div className={`absolute inset-1 rounded-full border-2 border-transparent border-b-neon-blue border-l-neon-pink animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
        </div>
      </div>
      {text && (
        <p className="text-sm text-white/50 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Full page loader with stunning animation
export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-dark-950 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Pulsing rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-primary-500/20 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border border-purple-500/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
        </div>

        {/* Main spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 border-r-purple-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-neon-blue border-l-neon-pink animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Brand text */}
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold gradient-text">EduVerse</h2>
        <div className="mt-3 flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
