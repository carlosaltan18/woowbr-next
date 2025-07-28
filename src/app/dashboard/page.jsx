"use client";
import * as React from "react"
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Home,
  TrendingUp,
  DollarSign,
  Package2,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import {ProductsView} from './components_dashboard/products.jsx'
import {UsersView} from './components_dashboard/users.jsx'
import {OrdersView} from './components_dashboard/ordes.jsx'
import {CategoriesView} from './components_dashboard/categorias.jsx'
import {SettingsView} from './components_dashboard/settings.jsx'
import {ImageUploader} from './components_dashboard/imageUploader.jsx'

const sampleOrders = [
  { id: "#WB001", customer: "Ana García", total: 159.98, status: "Completado", date: "2024-01-15" },
  { id: "#WB002", customer: "Juan Pérez", total: 79.99, status: "Pendiente", date: "2024-01-14" },
  { id: "#WB003", customer: "María Rodríguez", total: 249.97, status: "Enviado", date: "2024-01-13" },
  { id: "#WB004", customer: "Carlos López", total: 49.99, status: "Cancelado", date: "2024-01-12" },
]

function DashboardOverview() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return null;
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Resumen general de tu tienda Woowbe</p>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold">546</div>
            <p className="text-xs text-muted-foreground">+19% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 desde la semana pasada</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y tablas */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
                <span className="text-muted-foreground">Gráfico de ventas</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
            <CardDescription>Últimos 5 pedidos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sampleOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${order.total}</div>
                    <Badge
                      variant={
                        order.status === "Completado"
                          ? "default"
                          : order.status === "Pendiente"
                            ? "secondary"
                            : order.status === "Enviado"
                              ? "outline"
                              : "destructive"
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default function Dashboard() {
  const [activeView, setActiveView] = React.useState("dashboard")
  const router = useRouter();
  const menuItems = [
    {
      title: "Principal",
      items: [
        { title: "Dashboard", icon: Home, key: "dashboard" },
        { title: "Análisis", icon: BarChart3, key: "analytics" },
      ],
    },
    {
      title: "Gestión",
      items: [
        { title: "Productos", icon: Package, key: "products" },
        { title: "Categorías", icon: Package2, key: "categories" },
        { title: "Pedidos", icon: ShoppingCart, key: "orders" },
        { title: "Usuarios", icon: Users, key: "users" },
        {title: "Images", icon: UserCheck, key: "images"}
      ],
    },
    {
      title: "Sistema",
      items: [{ title: "Configuración", icon: Settings, key: "settings" }],
    },
  ]

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview />
      case "products":
        return <ProductsView />
      case "users":
        return <UsersView />
      case "orders":
        return <OrdersView />
      case "categories":
        return <CategoriesView />
      case "settings":
        return <SettingsView />
      case "images":
        return <ImageUploader />
      default:
        return <DashboardOverview />
    }
  }


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-2 px-4 py-2">
            <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold bg-black bg-clip-text text-transparent">
              Woowbe Admin
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {menuItems.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton onClick={() => setActiveView(item.key)} isActive={activeView === item.key}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-background">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center space-x-4">
           <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/")}
            >
              Home
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6 max-w-7xl">{renderView()}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
