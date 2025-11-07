import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dices, Trophy, Target } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('sessionId');
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
      setTimeout(() => setLocation('/dashboard'), 100);
    }
  }, [setLocation]);

  const handleDiscordLogin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/discord');
      const data = await response.json();
      
      if (data.authUrl && data.sessionId) {
        localStorage.setItem('sessionId', data.sessionId);
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Discord login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-violet-950/20 to-zinc-950 relative overflow-hidden">
      <div className="fixed inset-0 bg-grid opacity-[0.02] pointer-events-none" />
      
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <div className="space-y-8 text-center md:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-full">
                <Dices className="w-5 h-5 text-violet-400" />
                <span className="text-sm font-medium text-violet-300">Casino Platform</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black leading-tight">
                <span className="text-white">Project</span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Gamba</span>
              </h1>
              
              <p className="text-xl text-zinc-400 max-w-lg">
                Experience the thrill of casino gaming with leaderboards, challenges, and exclusive rewards
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <Trophy className="w-8 h-8 text-violet-400 mb-2" />
                <h3 className="font-bold text-white text-sm">Leaderboards</h3>
                <p className="text-xs text-zinc-500 mt-1">Compete for prizes</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <Target className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="font-bold text-white text-sm">Challenges</h3>
                <p className="text-xs text-zinc-500 mt-1">Complete tasks</p>
              </div>
            </div>
          </div>

          {/* Right side - Login Card */}
          <div>
            <Card className="p-10 border-zinc-800 bg-zinc-900/90 backdrop-blur-xl shadow-2xl">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                  <p className="text-zinc-400">Sign in to access your account</p>
                </div>

                <div className="space-y-4 pt-4">
                  <Button
                    onClick={handleDiscordLogin}
                    disabled={isLoading}
                    className="w-full h-14 bg-[#5865F2] hover:bg-[#4752C4] text-white border-0 gap-3 text-lg font-semibold rounded-xl shadow-lg shadow-[#5865F2]/20"
                    data-testid="button-discord-login"
                  >
                    <SiDiscord className="w-7 h-7" />
                    <span>
                      {isLoading ? 'Connecting...' : 'Continue with Discord'}
                    </span>
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-zinc-900 px-2 text-zinc-500">Features</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                      <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                      <span className="text-zinc-300">Play Casino Games</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-zinc-300">Track Your Progress</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                      <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                      <span className="text-zinc-300">Win Exclusive Rewards</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-xs text-zinc-600">
                    By continuing, you agree to our Terms of Service
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
