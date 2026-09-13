'use client';

import Image from 'next/image';
import Link from 'next/link'
import { BrandWaze } from 'tabler-icons-react';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Great_Vibes, Bodoni_Moda } from 'next/font/google';
import { useSearchParams } from "next/navigation";


const logo_google_maps = "https://res.cloudinary.com/dclzsvu62/image/upload/v1789266701/maps_ltlcmu.webp"
const iglesia_logo = "https://res.cloudinary.com/dclzsvu62/image/upload/v1789266701/iglesialogo_urlkzy.webp"
const nombreMarce = "https://res.cloudinary.com/dclzsvu62/image/upload/v1789266701/MARCE_dk6xe2.webp"
const margarita = "https://res.cloudinary.com/dclzsvu62/image/upload/v1789266702/margarita_mhgros.webp"
const margarita_mini ="https://res.cloudinary.com/dclzsvu62/image/upload/v1789266702/margaritamini_gclz5f.webp"
const margarita_grande ="https://res.cloudinary.com/dclzsvu62/image/upload/v1789266702/margaritacompleta_rreyc3.webp"
const mariposas_portada = "https://res.cloudinary.com/dclzsvu62/image/upload/v1789266702/MARIPOSASPORTADA_i8hjkx.webp"
const ramitas = "https://res.cloudinary.com/dclzsvu62/image/upload/v1789266702/ramita_p4xssh.webp"
const regalo = "https://res.cloudinary.com/dclzsvu62/image/upload/v1789266703/regalo_tbir1i.webp"
const dresscode = "https://res.cloudinary.com/dclzsvu62/image/upload/v1789266722/dresscode_dl2z32.webp"
const esfera_con_estrellas ="https://res.cloudinary.com/dclzsvu62/image/upload/v1789266723/esfera_con_estrellas_kdwces.webp"
const angel_inicio ="https://res.cloudinary.com/dclzsvu62/image/upload/v1789266723/Angel_inicio_bpp7ce.webp"
const bailarina ="https://res.cloudinary.com/dclzsvu62/image/upload/v1789266723/bailarina_zrnjor.webp"
const bolda_disco ="https://res.cloudinary.com/dclzsvu62/image/upload/v1789266724/boladisco_deygk1.webp"
const boton_dorado = "https://res.cloudinary.com/dclzsvu62/image/upload/v1789266724/BOTO_üN_r76vul.webp"
const calendario = "https://res.cloudinary.com/dclzsvu62/image/upload/v1789266725/calendario_lpye9e.webp"
const circulos_dresscode = "https://res.cloudinary.com/dclzsvu62/image/upload/v1789266725/Circulosdresscode-04_t6xnyn.webp"
const disco ="https://res.cloudinary.com/dclzsvu62/image/upload/v1789266726/Disco_anhjtj.webp"

export function InvitacionXVLiz() {
    
}