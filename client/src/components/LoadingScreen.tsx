import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-zinc-950 flex items-center justify-center ${
        !isVisible ? "animate-fade-out" : ""
      }`}
      data-testid="loading-screen"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-zinc-950 to-zinc-950"></div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Spinning circle with logo */}
        <div className="relative">
          {/* Outer spinning circle */}
          <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-violet-600 border-r-violet-600 animate-spin-slow"></div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 w-32 h-32 rounded-full bg-violet-600/20 blur-xl animate-pulse-glow"></div>

          {/* Logo container */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-violet-600/30 shadow-2xl shadow-violet-600/30">
              <img
                src="https://files.kick.com/images/user/99806/profile_image/conversion/423fe02f-679d-44c8-b5be-435fa715d015-fullsize.webp"
                alt="ProjectGamba Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black text-white">
            Project<span className="text-violet-600">Gamba</span>
          </h2>
          <p className="text-sm text-zinc-500 animate-pulse">Loading Rewards Hub...</p>
        </div>

        {/* Loading dots animation */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}
