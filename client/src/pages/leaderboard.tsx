import { useQuery } from "@tanstack/react-query";
import { Trophy, Crown, Medal, Award, User } from "lucide-react";
import { SiDiscord, SiTelegram } from "react-icons/si";
import { CountdownTimer } from "@/components/countdown-timer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LeaderboardEntry, LeaderboardSettings } from "@shared/schema";

export default function Leaderboard() {
  const { data: settings, isLoading: settingsLoading } = useQuery<LeaderboardSettings>({
    queryKey: ["/api/leaderboard/settings"],
  });

  const { data: entries = [], isLoading: entriesLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard/entries"],
  });

  const isLoading = settingsLoading || entriesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="text-zinc-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { label: "1st", color: "from-yellow-400 to-yellow-600", borderColor: "border-yellow-500/50", icon: Crown };
    if (rank === 2) return { label: "2nd", color: "from-zinc-300 to-zinc-500", borderColor: "border-zinc-400/50", icon: Medal };
    if (rank === 3) return { label: "3rd", color: "from-orange-400 to-orange-600", borderColor: "border-orange-500/50", icon: Award };
    return { label: "", color: "", borderColor: "", icon: Trophy };
  };

  // Reorder top three for podium display: [2nd, 1st, 3rd]
  const podiumOrder = topThree.length >= 3 
    ? [topThree[1], topThree[0], topThree[2]] 
    : topThree.length === 2 
    ? [topThree[1], topThree[0]]
    : topThree;

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none animate-gradient-slow" />
      
      {/* Hero Section - Simplified */}
      <div className="relative bg-zinc-900/50 border-b border-zinc-800/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 uppercase tracking-wide font-medium">Monthly Competition</p>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Wager Leaderboard
                  </h1>
                </div>
              </div>
            </div>
            {settings && (
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-sm text-zinc-500 mb-1">Total Prize Pool</p>
                  <p className="text-2xl font-bold text-violet-400" data-testid="text-prize-pool">
                    ${Number(settings.totalPrizePool).toLocaleString()}
                  </p>
                </div>
                <div className="text-right" data-testid="section-countdown">
                  <CountdownTimer endDate={new Date(settings.endDate)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {entries && entries.length > 0 ? (
          <div className="space-y-8">
            {/* Top 3 Podium */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {podiumOrder.map((entry, index) => {
                  const badge = getRankBadge(entry.rank);
                  const Icon = badge.icon;
                  const isFirst = entry.rank === 1;
                  
                  return (
                    <Card
                      key={entry.id}
                      className={`relative overflow-visible border-2 ${badge.borderColor} bg-zinc-900/80 backdrop-blur transition-all animate-scale-in ${
                        isFirst ? 'md:scale-110 md:z-10' : 'md:mt-8'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      data-testid={`card-leaderboard-${entry.rank}`}
                    >
                      {/* Gradient Glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-10 rounded-xl`}></div>
                      
                      <div className="relative p-6 space-y-4">
                        {/* Avatar */}
                        <div className="flex justify-center -mt-14">
                          <div className={`relative ${isFirst ? 'w-24 h-24' : 'w-20 h-20'}`}>
                            <Avatar className={`${isFirst ? 'w-24 h-24' : 'w-20 h-20'} border-4 ${
                              entry.rank === 1 ? 'border-yellow-500' :
                              entry.rank === 2 ? 'border-zinc-400' :
                              'border-orange-500'
                            }`}>
                              <AvatarImage src={settings?.logoUrl || ""} alt="Kick Logo" className="p-3" />
                              <AvatarFallback className={`text-xl font-bold bg-gradient-to-br ${badge.color} text-white`}>
                                {entry.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {/* Rank Badge */}
                            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r ${badge.color} text-white text-xs font-bold shadow-lg`}>
                              {badge.label}
                            </div>
                          </div>
                        </div>

                        {/* Username */}
                        <div className="text-center pt-4">
                          <div className={`${isFirst ? 'text-2xl' : 'text-xl'} font-black text-white mb-2 truncate`} data-testid={`text-username-${entry.rank}`}>
                            {entry.username}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-2 text-center">
                          <div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Wagered</div>
                            <div className={`${isFirst ? 'text-xl' : 'text-lg'} font-bold text-white`}>
                              ${Number(entry.wagered).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Prize</div>
                            <div className={`${isFirst ? 'text-2xl' : 'text-xl'} font-black text-violet-500`} data-testid={`text-prize-${entry.rank}`}>
                              ${Number(entry.prize).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Table Header */}
            {remaining.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                  <div className="col-span-2">Place</div>
                  <div className="col-span-5">User</div>
                  <div className="col-span-2 text-right">Wagered</div>
                  <div className="col-span-3 text-right">Prize</div>
                </div>

                {/* Remaining Players Table */}
                {remaining.map((entry, index) => (
                  <Card
                    key={entry.id}
                    className="border-zinc-800 bg-zinc-900/30 backdrop-blur hover-elevate transition-all animate-fade-in"
                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    data-testid={`card-leaderboard-${entry.rank}`}
                  >
                    <div className="px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Rank */}
                        <div className="col-span-2">
                          <Badge className="bg-zinc-800 text-white border-zinc-700 font-bold px-3 py-1">
                            #{entry.rank}
                          </Badge>
                        </div>

                        {/* User */}
                        <div className="col-span-5 flex items-center gap-3">
                          <Avatar className="w-10 h-10 border-2 border-zinc-700">
                            <AvatarImage src={settings?.logoUrl || ""} alt="Kick Logo" className="p-2" />
                            <AvatarFallback className="bg-zinc-800 text-white font-bold">
                              {entry.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-white truncate text-sm" data-testid={`text-username-${entry.rank}`}>
                              {entry.username}
                            </h3>
                          </div>
                        </div>

                        {/* Wagered */}
                        <div className="col-span-2 text-right">
                          <div className="text-sm text-zinc-400 font-medium">
                            ${Number(entry.wagered).toLocaleString()}
                          </div>
                        </div>

                        {/* Prize */}
                        <div className="col-span-3 text-right">
                          <div className="text-lg font-bold text-violet-500" data-testid={`text-prize-${entry.rank}`}>
                            ${Number(entry.prize).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Card className="p-16 text-center border-zinc-800 bg-zinc-900/30">
            <Trophy className="w-20 h-20 text-zinc-700 mx-auto mb-6 opacity-50" />
            <p className="text-zinc-500 text-lg">No leaderboard entries yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
