import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WalletButton } from "@/components/wallet-button"
import { Recycle, Smartphone, Trophy, Leaf, Users, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-eco-eeelien.jpeg" alt="Eco-Eeelien" className="h-12 w-auto object-contain" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Características
            </Link>
            <Link href="#impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Impacto
            </Link>
            <Link href="#partners" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Aliados
            </Link>
            <Link href="/exchange" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Intercambio
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <WalletButton />
            <Link href="/dashboard">
              <Button variant="outline">Abrir App</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" />
                Reciclaje Reimaginado
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
                Cambia tu mundo
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Únete a la revolución del reciclaje. Deposita botellas de plástico en contenedores inteligentes, gana
                eco-tokens y desbloquea recompensas exclusivas mientras salvas el planeta.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Comenzar a Reciclar
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Ver Demo
                </Button>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary">2.5M+</div>
                  <div className="text-sm text-muted-foreground">Botellas Recicladas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Usuarios Activos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">200+</div>
                  <div className="text-sm text-muted-foreground">Contenedores Inteligentes</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8 flex items-center justify-center">
                <img
                  src="/eco-friendly-recycling-app-interface-with-alien-ma.jpg"
                  alt="App Eco-Eeelien"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Cómo Funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tres simples pasos para comenzar a ganar recompensas por reciclar
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Escanea con NFC</h3>
              <p className="text-muted-foreground leading-relaxed">
                Abre la app y acerca tu teléfono a cualquier contenedor inteligente Eco-Eeelien para iniciar tu sesión
                de reciclaje.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                <Recycle className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Deposita Botellas</h3>
              <p className="text-muted-foreground leading-relaxed">
                Inserta tus botellas de plástico en el contenedor. Cada botella se cuenta y verifica automáticamente.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Trophy className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Gana Recompensas</h3>
              <p className="text-muted-foreground leading-relaxed">
                Recibe eco-tokens al instante. Canjéalos por descuentos, NFTs o dona a causas ambientales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20 p-8 flex items-center justify-center">
                <img
                  src="/environmental-impact-data-visualization-with-recyc.jpg"
                  alt="Impacto Ambiental"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Impacto Real, Cambio Real</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Cada botella que reciclas contribuye a un planeta más limpio. Rastrea tu impacto personal y observa cómo
                la comunidad está marcando la diferencia juntos.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Rastrea tu Progreso</h3>
                    <p className="text-muted-foreground">
                      Visualiza estadísticas detalladas sobre botellas recicladas, CO2 ahorrado y la reducción de tu
                      huella ambiental.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Desafíos Comunitarios</h3>
                    <p className="text-muted-foreground">
                      Compite con amigos y únete a desafíos de toda la ciudad para desbloquear recompensas y logros
                      especiales.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">¿Listo para Hacer la Diferencia?</h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Únete a miles de usuarios que están convirtiendo sus hábitos de reciclaje en recompensas e impacto
            ambiental.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo-eco-eeelien.jpeg" alt="Eco-Eeelien" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-sm text-muted-foreground">Gamificando el reciclaje para un futuro sostenible.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Cómo Funciona
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Recompensas
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Aliados
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 Eco-Eeelien. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
