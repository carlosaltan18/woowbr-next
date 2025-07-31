"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Star,
  Truck,
  Shield,
  Headphones,
  CreditCard,
  Search,
  Menu,
  Heart,
  User,
  PhoneCallIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Component() {
  const clickCountRef = useRef(0);
  const [showSplash, setShowSplash] = useState(true);
  const resetTimeoutRef = useRef(null);
  const router = useRouter();
  const imgWooebe = "https://res.cloudinary.com/dclzsvu62/image/upload/v1753670788/bodas-woowbe/z9rajz3y6q53pkbdkfsa.png"

  const handleLogoClick = (e) => {
    e.preventDefault();

    clickCountRef.current++;

    if (clickCountRef.current === 3) {
      router.push('/login');
      clickCountRef.current = 0;
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    } else {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      resetTimeoutRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 4000);
    }
  };
  const handleLogoClickUser = (e) => {
    router.push('/login');
  };


  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 3500); // Muestra el splash por 2.5 segundos

    return () => clearTimeout(timeout);
  }, []);

  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3 }}
          className="relative w-40 sm:w-72 md:w-96 aspect-square rounded-xl overflow-hidden"
        >
          <Image
            src="https://res.cloudinary.com/dclzsvu62/image/upload/v1753671693/bodas-woowbe/ojjmuennpspdf44mgksn.png"
            alt="Productos Woowbe"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 10rem,
          (max-width: 768px) 15rem,
          (max-width: 1024px) 15rem,
          24rem"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-6 text-lg sm:text-xl font-medium text-center"
        >
          Tu mejor impresión
        </motion.p>
      </div>
    );
  }




  return (

      <div className="josefin-sans flex flex-col min-h-screen bg-white text-black">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3 sm:gap-6">
              <Link href="/" className="flex items-center space-x-2" onClick={handleLogoClick}>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                  <Image
                    src={imgWooebe}
                    alt="Logo Woowbe"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="text-lg sm:text-2xl font-bold text-black">
                  Woowbe
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="#home" className="text-sm font-medium hover:text-gray-900 transition-colors">
                  Inicio
                </Link>
                <Link href="#services" className="text-sm font-medium hover:text-gray-900 transition-colors">
                  Servicios
                </Link>
                <Link href="#contact" className="text-sm font-medium hover:text-gray-900 transition-colors">
                  Contacto
                </Link>
                <Link href="#aboutus" className="text-sm font-medium hover:text-gray-900 transition-colors">
                  Sobre nosotros
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center space-x-2">
                {
                  /*
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input type="search" placeholder="Buscar productos..." className="pl-8 w-32 sm:w-64 bg-gray-100 text-black" />
                  </div>
                  */
                }
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogoClickUser}>
                <User className="h-5 w-5 text-black" />
              </Button>
              {

                /*
                  <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5 text-black" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-black text-white">
                   Assuming you have a way to get the cart item count 0 }
                  </Badge>
                < /Button>
                */
              }
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5 text-black" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}

          <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-100 to-gray-200 py-8 md:py-24" id="home">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <Badge className="w-fit bg-black text-white text-xs sm:text-base">
                      ¡Siempre tan WOOW!
                    </Badge>
                    <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-black">
                      Encuentra lo mejor en{" "}
                      <span className="text-black underline decoration-gray-400">Woowbe</span>
                    </h1>
                    <p className="max-w-full text-gray-600 text-sm sm:text-base md:text-xl">
                      Tu tienda de confianza. Encuentra productos de calidad, precios increíbles y la mejor
                      experiencia de compra.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button
                      size="lg"
                      className="bg-black hover:bg-gray-900 text-white w-full min-[400px]:w-auto"
                      onClick={() => router.push('/#services')}
                    >
                      Ver servicios
                    </Button>
                    <Button variant="outline" size="lg" className="w-full min-[400px]:w-auto border-black text-black hover:bg-gray-100"
                      onClick={() => router.push('/#contact')}
                    >
                      Contacto
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-6 lg:mt-0">
                  <div className="w-40 h-40 sm:w-72 sm:h-72 md:w-96 md:h-96 relative">
                    <Image
                      src="https://res.cloudinary.com/dclzsvu62/image/upload/v1753670788/bodas-woowbe/z9rajz3y6q53pkbdkfsa.png"
                      alt="Productos Woowbe"
                      fill
                      className="object-contain rounded-xl bg-gray-200"
                      sizes="(max-width: 768px) 100vw,
             (max-width: 1200px) 50vw,
             33vw"
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-8 md:py-24 bg-gray-100" id="aboutus">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-center">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-lg bg-black flex items-center justify-center">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-black">Envío a todo el pais</h3>
                  <p className="text-sm text-gray-600">En la compra de cualquier producto</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-lg bg-black flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-black">Compra Segura</h3>
                  <p className="text-sm text-gray-600">Productos de calidad</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-lg bg-black flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-black">Asesoramiento</h3>
                  <p className="text-sm text-gray-600">Atención personalizada</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-lg bg-black flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-black">Pago Fácil</h3>
                  <p className="text-sm text-gray-600">Múltiples métodos</p>
                </div>
              </div>
            </div>
          </section>

          {/* Products Section */}

          <section className="py-8 md:py-24" id="services">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-5xl">Servicios destacados</h2>
                  <p className="max-w-full text-muted-foreground text-sm sm:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Descubre nuestra selección de servicios más populares
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-8 sm:py-12 grid-cols-1 lg:grid-cols-3 lg:gap-12">
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src="https://res.cloudinary.com/dclzsvu62/image/upload/v1753670193/bodas-woowbe/olwdxux9ugpoqlg1quwt.jpg"
                        alt="Producto 1"
                        width={300}
                        height={200}
                        className="aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">Serigrafía</CardTitle>
                      <CardDescription>Creación de playeras, tazas, etc.</CardDescription>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" onClick={() => router.push('https://www.instagram.com/woowbe/')}>
                      <PhoneCallIcon className="mr-2 h-4 w-4" />
                      Contactanos
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src="https://res.cloudinary.com/dclzsvu62/image/upload/v1753670256/bodas-woowbe/d28d9hdvvwiyme2ku55k.webp"
                        alt="Producto 2"
                        width={300}
                        height={200}
                        className="aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">Bodas</CardTitle>
                      <CardDescription>Productos para tu boda</CardDescription>
                      <div className="flex items-center space-x-1">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" onClick={() => router.push('https://www.instagram.com/woowbe/')}>
                      <PhoneCallIcon className="mr-2 h-4 w-4" />
                      Contactanos
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src="https://res.cloudinary.com/dclzsvu62/image/upload/v1753670257/bodas-woowbe/dexdt7pdvpgusqwtoxxj.jpg"
                        alt="Producto 3"
                        width={300}
                        height={200}
                        className="aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">Venta de productos geek</CardTitle>
                      <CardDescription>Productos de todo tipó del mundo geek</CardDescription>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" onClick={() => router.push('https://www.instagram.com/woowbe/')}>
                      <PhoneCallIcon className="mr-2 h-4 w-4" />
                      Contactanos
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-8 md:py-24 bg-gray-900" id="contact">
            <div className="container mx-auto max-w-2xl px-4">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl text-white">
                    ¡No te pierdas nuestras ofertas!
                  </h2>
                <p className="max-w-full text-gray-300 text-sm sm:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Si quieres que te contactemos dejanos tu email y te enviaremos las mejores ofertas y novedades de nuestros productos.
                </p>
              </div>
              <div className="w-full max-w-sm mx-auto space-y-2">
                <form className="flex flex-col gap-2 sm:flex-row">
                  <Input type="email" placeholder="Tu email" className="flex-1 bg-white text-black" />
                  <Button type="submit" variant="secondary" className="w-full sm:w-auto bg-black text-white hover:bg-gray-800">
                    Contactar
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-gray-100">
          <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                    <Image
                      src={imgWooebe}
                      alt="Logo Woowbe"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xl font-bold text-black bg-clip-text">
                    Woowbe
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tu tienda en línea de confianza para encontrar los mejores productos a precios increíbles.
                </p>
              </div>
              <div className="space-y-4">
                <span className="text-base text-muted-foreground font-medium">Síguenos:</span>
                <div className="flex space-x-3">
                  <a
                    href="https://www.facebook.com/WoowBeGT/?locale=es_LA"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 flex items-center justify-center min-w-0"
                    >
                      <span className="sr-only">Facebook</span>
                      <FaFacebook className="!h-6 !w-6 text-muted-foreground" />
                    </Button>
                  </a>
                  <a
                    href="https://www.instagram.com/woowbe/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 flex items-center justify-center min-w-0"
                    >
                      <span className="sr-only">Instagram</span>
                      <FaInstagram className="!h-6 !w-6 text-muted-foreground" />
                    </Button>
                  </a>
                  <a
                    href="https://www.tiktok.com/@woowbegt"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 flex items-center justify-center min-w-0"
                    >
                      <span className="sr-only">TikTok</span>
                      <FaTiktok className="!h-6 !w-6 text-muted-foreground" />
                    </Button>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}