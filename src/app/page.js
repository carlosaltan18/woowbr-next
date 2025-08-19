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
  const imgWoowbeBlack= "https://res.cloudinary.com/dclzsvu62/image/upload/v1753671693/bodas-woowbe/ojjmuennpspdf44mgksn.png"
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
   <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1 }}
    className="relative w-40 sm:w-72 md:w-96 aspect-square rounded-xl overflow-hidden"
  >
    <motion.div
      animate={{ scale: [0.98, 0.99, 0.98] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }}
      className="relative w-full h-full"
    >
      <Image
        src={imgWoowbeBlack}
        alt="Productos Woowbe"
        fill
        className="object-contain"
        sizes="(max-width: 640px) 10rem,
        (max-width: 768px) 15rem,
        (max-width: 1024px) 15rem,
        24rem"
      />
    </motion.div>
  </motion.div>

  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.2, duration: 0.8 }}
    className="mt-6 text-lg sm:text-3xl font-semibold text-center"
  >
    ¡Siempre tan WOOW como tú!
  </motion.p>
</div>
  );
}