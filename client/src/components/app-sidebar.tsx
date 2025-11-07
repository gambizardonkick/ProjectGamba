import { Trophy, Award, Target, Gift, ExternalLink, Dices, User, ShoppingBag, Bomb, Spade, TrendingUp, Swords, Grid3x3, Settings, PartyPopper, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useUser } from "@/contexts/UserContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SiDiscord, SiX, SiInstagram, SiKick } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const WHITELISTED_DISCORD_IDS = ['1356903329518583948', '398263473466769420'];

const mainMenuItems = [
\
  {
    title: "Tournament",
    url: "/tournament",
    icon: Swords,
  },
];

const communityMenuItems = [
  {
    title: "Challenges",
    url: "/challenges",
    icon: Target,
  },
  {
    title: "Giveaways",
    url: "/giveaways",
    icon: PartyPopper,
  },
];

const userMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: User,
  },
  {
    title: "Shop",
    url: "/shop",
    icon: ShoppingBag,
  },
];

const gameMenuItems = [
  {
    title: "Dice",
    url: "/games/dice",
    icon: Dices,
  },
  {
    title: "Limbo",
    url: "/games/limbo",
    icon: TrendingUp,
  },
  {
    title: "Mines",
    url: "/games/mines",
    icon: Bomb,
  },
  {
    title: "Blackjack",
    url: "/games/blackjack",
    icon: Spade,
  },
  {
    title: "Keno",
    url: "/games/keno",
    icon: Grid3x3,
  },
];

const socialLinks = [
  {
    name: "Discord",
    url: "https://discord.gg/fpQhAj4heF",
    icon: SiDiscord,
    color: "text-[#5865F2]",
  },
  {
    name: "Kick",
    url: "https://kick.com/projectgamba",
    icon: SiKick,
    color: "text-[#53FC18]",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/@ProjectGamba",
    icon: SiX,
    color: "text-foreground",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/projectgambakick",
    icon: SiInstagram,
    color: "text-[#E4405F]",
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user: currentUser } = useUser();
  
  const isAdmin = currentUser?.discordUserId && WHITELISTED_DISCORD_IDS.includes(currentUser.discordUserId);
  
  console.log('[AppSidebar] Current user:', currentUser);
  console.log('[AppSidebar] Discord ID:', currentUser?.discordUserId);
  console.log('[AppSidebar] Is Admin:', isAdmin);

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 ring-2 ring-violet-500/20">
            <AvatarImage 
              src="https://files.kick.com/images/user/99806/profile_image/conversion/423fe02f-679d-44c8-b5be-435fa715d015-fullsize.webp" 
              alt="ProjectGamba Logo" 
            />
            <AvatarFallback className="bg-violet-600 text-white font-bold">PG</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-base font-bold text-sidebar-foreground">
              ProjectGamba
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Rewards Hub</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {/* MAIN Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider px-3 pb-2 text-sidebar-foreground/50">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={isActive ? 'bg-violet-600/20 text-violet-400 font-medium' : ''}
                    >
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* COMMUNITY Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider px-3 pb-2 text-sidebar-foreground/50">
            Community
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communityMenuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={isActive ? 'bg-violet-600/20 text-violet-400 font-medium' : ''}
                    >
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* USER Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider px-3 pb-2 text-sidebar-foreground/50">
            Your Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={isActive ? 'bg-violet-600/20 text-violet-400 font-medium' : ''}
                    >
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GAMES Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider px-3 pb-2 text-sidebar-foreground/50">
            Casino Games
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gameMenuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={isActive ? 'bg-violet-600/20 text-violet-400 font-medium' : ''}
                    >
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ADMIN Section - Only for whitelisted Discord IDs */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider px-3 pb-2 text-sidebar-foreground/50">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === "/admin"}
                    className={location === "/admin" ? 'bg-violet-600/20 text-violet-400 font-medium' : ''}
                  >
                    <Link href="/admin" data-testid="link-admin">
                      <Settings className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 bg-gradient-to-t from-sidebar-accent/30 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="space-y-4 relative z-10">
          <div className="space-y-3 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-xs text-muted-foreground uppercase tracking-wider text-center font-semibold flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-muted-foreground/30" />
              Follow ProjectGamba
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-muted-foreground/30" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {socialLinks.map((social, index) => (
                <Button 
                  key={social.name}
                  asChild 
                  size="icon" 
                  variant="ghost"
                  className={`hover-elevate ${social.color} transition-all duration-300 hover:scale-110 hover:-translate-y-1 animate-slide-in`}
                  style={{ animationDelay: `${0.45 + index * 0.05}s` }}
                  data-testid={`button-social-${social.name.toLowerCase()}`}
                >
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    <social.icon className="w-4 h-4 transition-transform duration-300" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
