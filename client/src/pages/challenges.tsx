import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Target, DollarSign, TrendingUp, Trophy, ExternalLink, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Challenge } from "@shared/schema";

export default function Challenges() {
  const { data: challenges = [], isLoading } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
  });

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [username, setUsername] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "claimed">("active");
  const { toast } = useToast();

  const claimMutation = useMutation({
    mutationFn: async (data: { id: string; username: string; discordUsername: string }) => {
      return apiRequest("POST", `/api/challenges/${data.id}/claim`, {
        username: data.username,
        discordUsername: data.discordUsername,
      });
    },
    onSuccess: () => {
      toast({
        title: "Prize Claimed!",
        description: "Join our Discord server and open a ticket to receive your prize.",
      });
      setSelectedChallenge(null);
      setUsername("");
      setDiscordUsername("");
      
      window.open("https://discord.gg/fpQhAj4heF", "_blank");
    },
    onError: () => {
      toast({
        title: "Claim Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClaim = () => {
    if (!selectedChallenge || !username.trim() || !discordUsername.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    claimMutation.mutate({
      id: selectedChallenge.id,
      username: username.trim(),
      discordUsername: discordUsername.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="text-zinc-400">Loading challenges...</p>
        </div>
      </div>
    );
  }

  const activeChallenges = challenges.filter((c) => c.isActive && (c.claimStatus === "unclaimed" || c.claimStatus === "pending" || c.claimStatus === "claimed"));
  const claimedChallenges = challenges.filter((c) => c.claimStatus === "verified");

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none animate-gradient-slow" />
      
      {/* Compact Hero */}
      <div className="relative bg-zinc-900/30 border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 uppercase font-medium">Complete & Win</p>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Slot Challenges
                </h1>
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "claimed")}>
              <TabsList className="bg-zinc-900 border-zinc-800">
                <TabsTrigger value="active" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white" data-testid="tab-active">
                  Active
                </TabsTrigger>
                <TabsTrigger value="claimed" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white" data-testid="tab-claimed">
                  Claimed
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Info Banner */}
        <div className="mb-6 p-4 border border-zinc-800 bg-zinc-900/30 rounded-lg">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-400 font-bold">1</span>
              </div>
              <span className="text-zinc-300">Choose a Challenge</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-400 font-bold">2</span>
              </div>
              <span className="text-zinc-300">Hit the Target</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-400 font-bold">3</span>
              </div>
              <span className="text-zinc-300">Claim Reward</span>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        {activeTab === "active" && activeChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeChallenges.map((challenge, index) => (
              <Card
                key={challenge.id}
                className="relative overflow-hidden border-zinc-800 bg-zinc-900/80 backdrop-blur hover-elevate hover:scale-105 transition-all duration-300 group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`card-challenge-${challenge.id}`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white border-0 font-bold" data-testid={`badge-status-${challenge.id}`}>
                    Active
                  </Badge>
                  {(challenge.claimStatus === "pending" || challenge.claimStatus === "claimed") && (
                    <Badge className="bg-gradient-to-r from-amber-600 to-amber-500 text-white border-0 font-bold" data-testid={`badge-verifying-${challenge.id}`}>
                      Verifying Claim
                    </Badge>
                  )}
                </div>

                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-violet-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>

                {/* Game Image */}
                <div className="relative aspect-video overflow-hidden bg-zinc-800/50">
                  <img
                    src={challenge.gameImage}
                    alt={challenge.gameName}
                    className="w-full h-full object-cover"
                    data-testid={`img-game-${challenge.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative p-6 space-y-4">
                  {/* Game Name */}
                  <h3 className="text-xl font-bold text-white" data-testid={`text-game-name-${challenge.id}`}>
                    {challenge.gameName}
                  </h3>

                  {/* Requirements */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider">
                        <TrendingUp className="w-3 h-3" />
                        Multiplier
                      </div>
                      <p className="text-2xl font-black text-violet-500" data-testid={`text-multiplier-${challenge.id}`}>
                        {Number(challenge.minMultiplier)}x
                      </p>
                    </div>

                    <div className="space-y-1 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider">
                        <DollarSign className="w-3 h-3" />
                        Min Bet
                      </div>
                      <p className="text-2xl font-black text-white" data-testid={`text-min-bet-${challenge.id}`}>
                        ${Number(challenge.minBet)}
                      </p>
                    </div>
                  </div>

                  {/* Prize */}
                  <div className="pt-4 border-t border-zinc-800 space-y-3">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Prize Pool</p>
                      <p className="text-3xl font-black bg-gradient-to-r from-violet-500 to-violet-600 bg-clip-text text-transparent" data-testid={`text-prize-${challenge.id}`}>
                        ${Number(challenge.prize).toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      onClick={() => setSelectedChallenge(challenge)} 
                      className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:opacity-90 text-white border-0"
                      data-testid={`button-claim-${challenge.id}`}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Claim Prize
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : activeTab === "active" ? (
          <Card className="p-20 text-center border-zinc-800 bg-zinc-900/50">
            <Target className="w-20 h-20 text-zinc-700 mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">No Active Challenges</h2>
            <p className="text-zinc-500 text-lg">Check back later for new challenges and opportunities to win!</p>
          </Card>
        ) : null}

        {/* Claimed Challenges Grid */}
        {activeTab === "claimed" && claimedChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {claimedChallenges.map((challenge, index) => (
              <Card
                key={challenge.id}
                className="relative overflow-hidden border-zinc-800 bg-zinc-900/80 backdrop-blur transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`card-claimed-${challenge.id}`}
              >
                {/* Verified Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white border-0 font-bold" data-testid={`badge-verified-${challenge.id}`}>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-500 opacity-5"></div>

                {/* Game Image */}
                <div className="relative aspect-video overflow-hidden bg-zinc-800/50">
                  <img
                    src={challenge.gameImage}
                    alt={challenge.gameName}
                    className="w-full h-full object-cover"
                    data-testid={`img-claimed-game-${challenge.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative p-6 space-y-4">
                  {/* Game Name */}
                  <h3 className="text-xl font-bold text-white" data-testid={`text-claimed-game-name-${challenge.id}`}>
                    {challenge.gameName}
                  </h3>

                  {/* Requirements */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider">
                        <TrendingUp className="w-3 h-3" />
                        Multiplier
                      </div>
                      <p className="text-2xl font-black text-green-500" data-testid={`text-claimed-multiplier-${challenge.id}`}>
                        {Number(challenge.minMultiplier)}x
                      </p>
                    </div>

                    <div className="space-y-1 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider">
                        <DollarSign className="w-3 h-3" />
                        Min Bet
                      </div>
                      <p className="text-2xl font-black text-white" data-testid={`text-claimed-min-bet-${challenge.id}`}>
                        ${Number(challenge.minBet)}
                      </p>
                    </div>
                  </div>

                  {/* Winner Info */}
                  <div className="pt-4 border-t border-zinc-800 space-y-3">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Prize</p>
                      <p className="text-3xl font-black bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent" data-testid={`text-claimed-prize-${challenge.id}`}>
                        ${Number(challenge.prize).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                      <p className="text-xs text-green-400 font-semibold mb-1">Winner</p>
                      <p className="text-sm text-green-200" data-testid={`text-winner-${challenge.id}`}>{challenge.claimedBy}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : activeTab === "claimed" ? (
          <Card className="p-20 text-center border-zinc-800 bg-zinc-900/50">
            <Trophy className="w-20 h-20 text-zinc-700 mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">No Claimed Challenges Yet</h2>
            <p className="text-zinc-500 text-lg">Completed challenges will appear here once verified.</p>
          </Card>
        ) : null}
      </div>

      {/* Claim Prize Modal */}
      <Dialog open={!!selectedChallenge} onOpenChange={(open) => !open && setSelectedChallenge(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white" data-testid="dialog-claim-prize">
          <DialogHeader>
            <DialogTitle className="text-white">Claim Your Prize</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Fill in your details to claim your prize for {selectedChallenge?.gameName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-300">Gamdom Username</Label>
              <Input
                id="username"
                placeholder="Enter your Gamdom username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="input-username"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discord" className="text-zinc-300">Discord Username</Label>
              <Input
                id="discord"
                placeholder="Enter your Discord username"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                data-testid="input-discord"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <Card className="p-4 bg-zinc-800/50 border-zinc-700">
              <p className="text-sm text-zinc-400">
                After claiming, you'll be redirected to join our Discord server. Open a ticket to verify your win and receive your prize.
              </p>
            </Card>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedChallenge(null)} data-testid="button-cancel" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Cancel
            </Button>
            <Button 
              onClick={handleClaim} 
              disabled={claimMutation.isPending}
              data-testid="button-submit-claim"
              className="bg-gradient-to-r from-violet-600 to-violet-500 hover:opacity-90 text-white border-0"
            >
              {claimMutation.isPending ? "Claiming..." : "Claim & Join Discord"}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
