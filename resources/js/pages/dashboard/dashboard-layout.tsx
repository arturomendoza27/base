"use client"

import type React from "react"
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropletIcon,
  UsersIcon,
  FileTextIcon,
  BarChart3Icon,
  SettingsIcon,
  MenuIcon,
  HomeIcon,
  DollarSignIcon,
  CreditCardIcon,
  WalletIcon,
  Building2Icon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { can } from '@/lib/can';
import flasher from '@flasher/flasher'

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Usuarios", href: "/users", icon: UsersIcon, permission: "users.view" },
  { name: "Roles", href: "/roles", icon: UsersIcon, permission: "roles.view" },
  { name: "Predios", href: "/predios", icon: Building2Icon },
  { name: "Tarifas", href: "/tarifas", icon: DollarSignIcon },
  { name: "Facturación", href: "/facturacion", icon: FileTextIcon },
  { name: "Caja", href: "/caja", icon: WalletIcon },
  { name: "Pagos", href: "/pagos", icon: CreditCardIcon },
  { name: "Reportes", href: "/reportes", icon: BarChart3Icon },
  { name: "Configuración", href: "/settings", icon: SettingsIcon },

]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { messages } = usePage().props
  useEffect(() => {
    if (messages) {
      flasher.render(messages)
    }
  }, [messages])

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", mobile ? "w-full" : "w-64")}>
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <DropletIcon className="h-8 w-8 text-secondary" />
        <div>
          <h1 className="text-xl font-bold">Manantial</h1>
          <p className="text-sm text-muted-foreground">Sistema de Facturación</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          if (item.permission && !can(item.permission)) return null // 🔒 ocultar si no tiene permiso

          const isActive = location.pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-card border-r border-border">
          <Sidebar />
        </div>
      </div>

      {/* Sidebar Mobile */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
