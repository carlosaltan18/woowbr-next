"use client";
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";


export function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">Ajusta la configuración de tu tienda</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Configuración básica de la tienda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Nombre de la tienda</Label>
                <Input id="store-name" defaultValue="Woowbe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email">Email de contacto</Label>
                <Input id="store-email" defaultValue="contacto@woowbe.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-description">Descripción</Label>
              <Textarea
                id="store-description"
                defaultValue="Tu tienda en línea de confianza para encontrar los mejores productos"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Pagos</CardTitle>
            <CardDescription>Métodos de pago disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-sm text-muted-foreground">Pagos con PayPal</p>
                </div>
                <Badge>Activo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Stripe</p>
                  <p className="text-sm text-muted-foreground">Tarjetas de crédito y débito</p>
                </div>
                <Badge>Activo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}