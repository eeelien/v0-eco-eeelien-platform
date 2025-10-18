import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Recycle, Trophy, Coins, Leaf, Gift, Zap, Users, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-eco-eeelien.jpeg" alt="Eco-Eeelien" className="h-12 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Tabla de Posiciones
            </Button>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">JD</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenido de nuevo, Juan!</h1>
          <p className="text-muted-foreground">Has reciclado 47 botellas este mes. ¡Sigue con el gran trabajo!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Recycle className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                +12 hoy
              </Badge>
            </div>
            <div className="text-3xl font-bold text-card-foreground mb-1">247</div>
            <div className="text-sm text-muted-foreground">Botellas Recicladas</div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Coins className="w-6 h-6 text-accent" />
              </div>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                +60 hoy
              </Badge>
            </div>
            <div className="text-3xl font-bold text-card-foreground mb-1">1,235</div>
            <div className="text-sm text-muted-foreground">Eco-Tokens</div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-card-foreground mb-1">148kg</div>
            <div className="text-sm text-muted-foreground">CO₂ Ahorrado</div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-card-foreground mb-1">12</div>
            <div className="text-sm text-muted-foreground">Logros</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Action */}
            <Card className="p-8 border-border bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">¿Listo para Reciclar?</h2>
                  <p className="text-muted-foreground mb-6">
                    Encuentra el contenedor inteligente más cercano y comienza a ganar tokens
                  </p>
                  <Button size="lg" className="gap-2">
                    <Zap className="w-5 h-5" />
                    Escanear Contenedor NFC
                  </Button>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-6xl">👽</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Current Challenge */}
            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-card-foreground">Desafío Semanal</h3>
                <Badge className="bg-accent text-accent-foreground">3 días restantes</Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">Recicla 50 botellas esta semana</span>
                    <span className="text-sm font-semibold text-primary">47/50</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-card-foreground">Recompensa: 500 Tokens Bonus</div>
                    <div className="text-sm text-muted-foreground">+ Insignia NFT Exclusiva</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 border-border">
              <h3 className="text-xl font-bold text-card-foreground mb-6">Actividad Reciente</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Recycle,
                    text: "Reciclaste 5 botellas en OXXO Centro",
                    tokens: "+25",
                    time: "hace 2 horas",
                    color: "primary",
                  },
                  {
                    icon: Trophy,
                    text: 'Desbloqueaste el logro "Guerrero Eco"',
                    tokens: "+100",
                    time: "hace 1 día",
                    color: "accent",
                  },
                  {
                    icon: Gift,
                    text: "Canjeaste 200 tokens por descuento en café",
                    tokens: "-200",
                    time: "hace 2 días",
                    color: "secondary",
                  },
                  {
                    icon: Recycle,
                    text: "Reciclaste 8 botellas en Plaza Mayor",
                    tokens: "+40",
                    time: "hace 3 días",
                    color: "primary",
                  },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg bg-${activity.color}/10 flex items-center justify-center`}>
                      <activity.icon className={`w-5 h-5 text-${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-card-foreground text-sm">{activity.text}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                    <div
                      className={`font-semibold ${activity.tokens.startsWith("+") ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {activity.tokens}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-card-foreground">Logros</h3>
                <Button variant="ghost" size="sm" className="text-primary">
                  Ver Todos
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { emoji: "🌱", name: "Primeros Pasos", unlocked: true },
                  { emoji: "♻️", name: "Reciclador", unlocked: true },
                  { emoji: "🏆", name: "Campeón", unlocked: true },
                  { emoji: "⚡", name: "Veloz", unlocked: true },
                  { emoji: "🌍", name: "Salvando el Planeta", unlocked: false },
                  { emoji: "👑", name: "Rey Eco", unlocked: false },
                ].map((achievement, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 ${
                      achievement.unlocked ? "bg-primary/10" : "bg-muted/30 opacity-50"
                    }`}
                  >
                    <span className="text-3xl">{achievement.emoji}</span>
                    <span className="text-xs font-medium text-center text-card-foreground">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Rewards */}
            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-card-foreground">Recompensas Disponibles</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Descuento en Café", cost: 200, icon: "☕" },
                  { name: "Insignia NFT Eco", cost: 500, icon: "🎨" },
                  { name: "Cupón de Tienda", cost: 1000, icon: "🎁" },
                ].map((reward, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center text-2xl">
                      {reward.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-card-foreground text-sm">{reward.name}</div>
                      <div className="text-xs text-muted-foreground">{reward.cost} tokens</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Ver Todas las Recompensas
              </Button>
            </Card>

            {/* Leaderboard Preview */}
            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-card-foreground">Top Recicladores</h3>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                  #8
                </Badge>
              </div>
              <div className="space-y-3">
                {[
                  { name: "María G.", bottles: 342, rank: 1 },
                  { name: "Carlos R.", bottles: 298, rank: 2 },
                  { name: "Ana L.", bottles: 276, rank: 3 },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        i === 0 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-card-foreground text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.bottles} botellas</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
