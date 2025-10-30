"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { WalletButton } from "@/components/wallet-button"
import { ArrowLeftRight, TrendingUp, Coins, ArrowRight, Info } from "lucide-react"
import Link from "next/link"

export default function ExchangePage() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("SOL")
  const [tokenAmount, setTokenAmount] = useState<string>("")

  const exchangeRates = {
    SOL: { rate: 0.0001, symbol: "SOL", name: "Solana", icon: "◎" },
    USDT: { rate: 0.01, symbol: "USDT", name: "Tether", icon: "₮" },
    USDC: { rate: 0.01, symbol: "USDC", name: "USD Coin", icon: "$" },
    USD: { rate: 0.01, symbol: "USD", name: "Dólares", icon: "$" },
    MXN: { rate: 0.2, symbol: "MXN", name: "Pesos Mexicanos", icon: "$" },
  }

  const calculateExchange = (tokens: string) => {
    const amount = Number.parseFloat(tokens) || 0
    return (amount * exchangeRates[selectedCurrency as keyof typeof exchangeRates].rate).toFixed(4)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/logo-eco-eeelien.jpeg" alt="Eco-Eeelien" className="h-12 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <WalletButton />
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ArrowLeftRight className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Intercambio de Tokens</h1>
              <p className="text-muted-foreground">Convierte tus eco-tokens en diferentes monedas</p>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="p-6 border-border mb-8 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Balance Disponible</div>
              <div className="text-4xl font-bold text-foreground mb-2">1,235</div>
              <div className="text-sm text-muted-foreground">Eco-Tokens</div>
            </div>
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Coins className="w-10 h-10 text-primary" />
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Exchange Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-border">
              <h2 className="text-xl font-bold text-card-foreground mb-6">Realizar Intercambio</h2>

              {/* From Section */}
              <div className="mb-4">
                <label className="text-sm font-medium text-card-foreground mb-2 block">Desde</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    className="text-2xl font-bold h-16 pr-32"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                    <Coins className="w-5 h-5 text-primary" />
                    <span className="font-semibold">ECO</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center my-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              {/* To Section */}
              <div className="mb-6">
                <label className="text-sm font-medium text-card-foreground mb-2 block">Hacia</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={calculateExchange(tokenAmount)}
                    readOnly
                    className="text-2xl font-bold h-16 pr-32 bg-muted/50"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="bg-background border border-border px-3 py-2 rounded-lg font-semibold cursor-pointer"
                    >
                      {Object.entries(exchangeRates).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.icon} {value.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Exchange Info */}
              <div className="bg-muted/30 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tasa de Cambio</span>
                  <span className="font-semibold text-card-foreground">
                    1 ECO = {exchangeRates[selectedCurrency as keyof typeof exchangeRates].rate}{" "}
                    {exchangeRates[selectedCurrency as keyof typeof exchangeRates].symbol}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Comisión de Red</span>
                  <span className="font-semibold text-card-foreground">0.5%</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Recibirás</span>
                  <span className="font-bold text-primary">
                    {(Number.parseFloat(calculateExchange(tokenAmount)) * 0.995).toFixed(4)}{" "}
                    {exchangeRates[selectedCurrency as keyof typeof exchangeRates].symbol}
                  </span>
                </div>
              </div>

              <Button size="lg" className="w-full" disabled={!tokenAmount || Number.parseFloat(tokenAmount) <= 0}>
                <ArrowLeftRight className="w-5 h-5 mr-2" />
                Confirmar Intercambio
              </Button>

              <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Los intercambios se procesan en la blockchain de Solana. Asegúrate de tener tu wallet Phantom
                  conectada para recibir los fondos.
                </p>
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="p-6 border-border mt-6">
              <h3 className="text-lg font-bold text-card-foreground mb-4">Transacciones Recientes</h3>
              <div className="space-y-3">
                {[
                  { amount: "500 ECO", to: "0.05 SOL", time: "hace 2 horas", status: "Completado" },
                  { amount: "1000 ECO", to: "10.00 USDT", time: "hace 1 día", status: "Completado" },
                  { amount: "250 ECO", to: "50.00 MXN", time: "hace 3 días", status: "Completado" },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium text-card-foreground text-sm">
                        {tx.amount} → {tx.to}
                      </div>
                      <div className="text-xs text-muted-foreground">{tx.time}</div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                      {tx.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Currency Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-4">Monedas Disponibles</h3>
            {Object.entries(exchangeRates).map(([key, value]) => (
              <Card
                key={key}
                className={`p-4 border-border cursor-pointer transition-all hover:border-primary ${
                  selectedCurrency === key ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedCurrency(key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                      {value.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-card-foreground">{value.name}</div>
                      <div className="text-xs text-muted-foreground">{value.symbol}</div>
                    </div>
                  </div>
                  {selectedCurrency === key && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      Seleccionado
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    1 ECO = {value.rate} {value.symbol}
                  </span>
                </div>
              </Card>
            ))}

            {/* Info Card */}
            <Card className="p-4 border-border bg-muted/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-card-foreground text-sm mb-1">Sobre los Intercambios</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Las tasas de cambio se actualizan en tiempo real. Los intercambios a criptomonedas se procesan
                    instantáneamente en Solana. Los retiros a moneda fiat pueden tardar 1-3 días hábiles.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
