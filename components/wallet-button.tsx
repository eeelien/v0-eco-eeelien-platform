"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      disconnect: () => Promise<void>
      on: (event: string, callback: () => void) => void
      publicKey?: { toString: () => string }
    }
  }
}

export function WalletButton() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Check if wallet is already connected
    if (window.solana?.publicKey) {
      setWalletAddress(window.solana.publicKey.toString())
    }

    // Listen for wallet changes
    if (window.solana) {
      window.solana.on("connect", () => {
        if (window.solana?.publicKey) {
          setWalletAddress(window.solana.publicKey.toString())
        }
      })
      window.solana.on("disconnect", () => {
        setWalletAddress(null)
      })
    }
  }, [])

  const connectWallet = async () => {
    if (!window.solana) {
      window.open("https://phantom.app/", "_blank")
      return
    }

    try {
      setIsConnecting(true)
      const response = await window.solana.connect()
      setWalletAddress(response.publicKey.toString())
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = async () => {
    if (window.solana) {
      try {
        await window.solana.disconnect()
        setWalletAddress(null)
      } catch (error) {
        console.error("Error disconnecting wallet:", error)
      }
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (walletAddress) {
    return (
      <Button variant="outline" onClick={disconnectWallet} className="gap-2 bg-transparent">
        <Wallet className="w-4 h-4" />
        {formatAddress(walletAddress)}
      </Button>
    )
  }

  return (
    <Button onClick={connectWallet} disabled={isConnecting} className="gap-2">
      <Wallet className="w-4 h-4" />
      {isConnecting ? "Conectando..." : "Conectar Wallet"}
    </Button>
  )
}
