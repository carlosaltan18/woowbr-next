"use client";

import { useState } from "react"
import { useRouter } from "next/navigation" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLogin } from "@/hooks/useLogin"


export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError } = useLogin()
  const router = useRouter() 
  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    const formData = new FormData(e.target)
    const username = formData.get('username') 
    const password = formData.get('password')
  
    const result = await login({
      username, 
      password,
    })

    if (result.success) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-black hover:text-gray-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Volver a Woowbe</span>
          </Link>
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-black">Bienvenido de vuelta</h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta de Woowbe</p>
        </div>

        {/* Login Card */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-black">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-medium">
                  Usuario
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="user"
                    name="username" // <-- agrega name="username"
                    type="text"
                    placeholder="TuUsuario"
                    className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-black font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password" // <-- agrega esto
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 border-gray-300 focus:border-black focus:ring-black"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password 
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                    Recordarme
                  </Label>
                </div>
                <Link href="#" className="text-sm text-black hover:text-gray-600 underline underline-offset-4">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              */}
              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>


          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link href="#" className="text-black hover:text-gray-600 underline underline-offset-4 font-medium">
                Regístrate aquí
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}