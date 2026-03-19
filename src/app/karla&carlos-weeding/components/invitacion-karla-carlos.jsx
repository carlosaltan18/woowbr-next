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

const greatVibes = Great_Vibes({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});

const bodoni = Bodoni_Moda({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    display: 'swap',
});

export function InvitacionBoda() {

    const [scrollProgress, setScrollProgress] = useState(0);
    const [isFormVisible, setIsFormVisible] = useState(false); // Estado para manejar la visibilidad del formulario

    const searchParams = useSearchParams();
    const adultos = searchParams.get("adultos") ?? "1";
    const ninos = searchParams.get("ninos");
    const totalInvitados = (parseInt(adultos) || 1) + (parseInt(ninos) || 0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / windowHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await fetch("/api/registrarInvitado/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Error al enviar los datos");

            toast.success("Datos enviados correctamente");
            reset(); // limpia el formulario
            setIsFormVisible(false); // Oculta el formulario después de enviarlo
        } catch (err) {
            toast.error("Hubo un problema al enviar el formulario");
            console.error(err);
        }
    };

    const [tiempoRestante, setTiempoRestante] = useState({
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0,
    });

    useEffect(() => {
        const fechaBoda = new Date("2026-04-18T12:00:00");
        const intervalo = setInterval(() => {
            const ahora = new Date();
            const diferencia = fechaBoda.getTime() - ahora.getTime();

            if (diferencia <= 0) {
                clearInterval(intervalo);
                setTiempoRestante({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
            } else {
                const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                const horas = Math.floor(
                    (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutos = Math.floor(
                    (diferencia % (1000 * 60 * 60)) / (1000 * 60)
                );
                const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

                setTiempoRestante({ dias, horas, minutos, segundos });
            }
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);
    const karlaYCarlos = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773795757/INVITACIÓN_KARLA_ALVIZURES_-01_1_wsuj5x.png";
    const logoCA = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773796060/INVITACIÓN_KARLA_ALVIZURES_-07_zblmvt.png";
    const regalo = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773891813/regalo_uodqap.png";
    const numero = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773892384/cuadros-10_oox1kk.png"
    const muerto = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773805374/INVITACIÓN_KARLA_ALVIZURES_-09_sfrsbc.png"
    const vestimenta = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773888935/dress_u5fzam.png"
    const iglesia = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773895995/Iglesia_ualwgw.png"
    const numeroUno = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773892710/cuadros-11_hrdhvy.png"
    const fondoSeccion1 = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773803989/INVITACIÓN_KARLA_ALVIZURES_-02_xh1jtz.png"
    const fondoSeccion2 = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773889044/INVITACIÓN_KARLA_ALVIZURES_-03_afd5xx.png"
    const fondoSeccion3 = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773894367/4_pxx5xb.png"
    const cemaco = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754690226/bodas-woowbe/kowhqhfrn3oerkn5wtvh.png"
    const siman = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773895928/logo_siman_cemaco-12_hcggfc.png"
    const fondSeccion4 = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773896071/INVITACIÓN_KARLA_ALVIZURES_-05_1_s9ulqv.png"
    const copas = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773895991/brindis_xbfn9i.png"
    const fotoLuguar = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773896848/WhatsApp_Image_2026-03-18_at_11.04.32_PM_vzoli0.jpg"
    return (
        <div
            style={{ fontFamily: 'Josefin Sans' }}
            className="font-josefin min-h-screen flex flex-col items-center justify-center px-0 relative"
        >
            {/* Barra de progreso */}
            <div
                style={{ width: `${scrollProgress}%` }}
                className="fixed top-0 left-0 h-3 bg-[#688440] z-50"
            ></div>


            {/* Contenido de la invitación */}
            <Toaster />
            {/* Portada*/}

            <div
                className="w-full h-[100svh] md:h-[60vh] lg:h-[80vh] relative overflow-hidden text-white p-4" style={{
                    backgroundImage: `url(${karlaYCarlos})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 "></div>

                <div className="relative z-10 w-full h-full flex flex-col items-center justify-end text-center pb-43 md:pb-32">
                    <h1 className={`${greatVibes.className} text-[#b6bdae] text-5xl md:text-7xl lg:text-8xl  mb-3`}>
                        Karla & Carlos
                    </h1>
                    <div className="mt-3">
                        <Image
                            src={logoCA}
                            alt="Logo"
                            width={150}
                            height={150}
                            className="rounded-full  rotate-90 -translate-x-6 translate-y-3"
                        />
                    </div>
                    <h1 className={`${bodoni.className} text-[#b6bdae] text-2xl md:text-3xl lg:text-5xl absolute bottom-8 md:bottom-12`}>
                        ABRIL 18, 2026
                    </h1>
                </div>
            </div>


            {/* Seccción de presentación de los novios*/}
            <div
                className="w-full min-h-[100svh] flex flex-col items-center justify-center text-center p-4 md:p-12 text-white relative overflow-hidden"
                style={{
                    backgroundImage: `url(${fondoSeccion1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Overlay para legibilidad */}
                <div className="absolute inset-0 z-0 bg-black/10"></div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto">

                    {/* Contador Responsivo */}
                    <div className="flex flex-col items-center justify-center text-center p-4 md:mb-12">
                        <p className={`${bodoni.className} text-3xl md:text-5xl lg:text-6xl font-medium text-white tracking-widest`}>
                            {tiempoRestante.dias} Días {tiempoRestante.horas}h : {tiempoRestante.minutos}m : {tiempoRestante.segundos}s
                        </p>
                    </div>

                    {/* Espaciado controlado */}
                    <div className="h-12 md:h-20"></div>

                    {/* Mensaje de Privilegio */}
                    <div className={`${bodoni.className} text-xl md:text-3xl lg:text-4xl italic leading-relaxed max-w-[90%] md:max-w-3xl mx-auto mb-12`}>
                        <p>
                            Dios nos ha concedido el privilegio <br className="hidden md:block" />
                            de conocernos y amarnos, y hoy <br className="hidden md:block" />
                            con su bendición <br className="hidden md:block" />
                            y la de nuestros padres queremos <br className="hidden md:block" />
                            unir nuestras vidas para siempre
                        </p>
                    </div>

                    {/* Padres de la Novia */}
                    <div className={`${bodoni.className} text-xl md:text-2xl lg:text-3xl italic leading-relaxed max-w-[90%] md:max-w-4xl mx-auto mb-10`}>
                        <p className='italic uppercase tracking-[0.2em] text-sm md:text-lg mb-4'>
                            PADRES DE LA NOVIA:
                        </p>
                        <p >Adela del Rosario Rivera</p>
                        <div className="flex items-center justify-center ">
                            <p>Adolfo Arcenio Alvizures Hernández</p>
                            <div className="w-6 h-6 md:w-10 md:h-10 flex-shrink-0">
                                <Image
                                    src={muerto}
                                    alt="Paloma con olivo"
                                    width={120}
                                    height={120}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Padres del Novio */}
                    <div className={`${bodoni.className} text-xl md:text-2xl lg:text-3xl italic leading-relaxed max-w-[90%] md:max-w-4xl mx-auto`}>
                        <p className="italic uppercase tracking-[0.2em] text-sm md:text-lg mb-4 ">
                            PADRES DEL NOVIO:
                        </p>
                        <p>
                            Alba Lorena Fajardo Rodríguez<br />
                            Hernán Humberto Ambrocio Alonzo
                        </p>
                    </div>
                </div>
            </div>



            {/* Sección 3 */}
            <div
                className="w-full min-h-[100svh] flex flex-col items-center justify-center text-center p-4 md:p-12 text-white relative overflow-hidden"
                style={{
                    backgroundImage: `url(${fondoSeccion2})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className={`relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto ${bodoni.className}`}>

                    <div className={`${bodoni.className} text-2xl md:text-3xl lg:text-4xl italic leading-relaxed max-w-[90%] md:max-w-3xl mx-auto mb-12`}>
                        <p className='text-black font-semibold italic'>
                            Vestidos de amor, unidos <br />
                            por Dios para siempre.
                        </p>
                        <h2 className='text-black italic text-xl md:text-2xl lg:text-3xl'>Colosenses.3:11</h2>
                    </div>
                    <div className="h-50 md:h-65"></div>

                    <h2 className="pt-3 text-2xl lg:text-4xl xl:text-5xl font-light mb-1 leading-loose text-black italic font-semibold">
                        DRESS CODE <br />

                    </h2>
                    <Image src={vestimenta} alt="vestimenta" width={60} height={60} className="mb-2 w-35 mx-auto" />
                    <h2 className="pt-3 text-2xl lg:text-4xl xl:text-5xl font-light mb-1 leading-loose text-black italic font-semibold">
                        FORMAL <br />

                    </h2>



                </div>
            </div>

            {/* Sección 4 - registro */}
            <div
                className={`${bodoni.className} w-full min-h-[75rem] md:h-[85rem] lg:h-[95rem] flex flex-col items-center justify-center text-center text-black relative overflow-hidden text-white`}
                style={{
                    backgroundImage: `url(${fondoSeccion3})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <Image src={regalo} alt="Logo" width={100} height={60} className="mb-6 w-10 mx-auto" />

                <p className="text-1xl lg:text-3xl xl:text-4xl  mb-15 italic ">
                    Agradecemos a Dios por bendecirnos <br />
                    con este momento tan especial. <br />
                    Su presencia, cariño y oraciones son el regalo <br />
                    más valioso para nosotros.
                </p>

                <p className="text-1xl lg:text-3xl xl:text-4xl  mb-15 italic ">
                    Si desean acompañarnos con un detalle, <br />
                    hemos preparado una pequeña lista como <br />
                    sugerencia opcional. Lo más importante para nosotros <br />
                    es compartir este día con ustedes
                </p>

                <h2 className="text-1xl lg:text-3xl xl:text-4xl  mb-15 italic font-light">
                    LISTA DE REGALOS
                </h2>
                <div className="flex justify-center items-center gap-4 mb-6">
                    <Link
                        href="https://www.cemaco.com/list/BodaAmbrocioFajardoyAlvizuresRivera18042026" // Reemplaza con el link exacto de tu lista
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity" // Opcional: un efecto visual al pasar el mouse
                    >
                        <Image
                            src={cemaco}
                            alt="Logo Cemaco"
                            width={100}
                            height={60}
                            className="w-10"
                        />
                    </Link>
                    <Link
                        href="https://simangiftregistry.web.app/table/20008918" // Reemplaza con el link exacto de tu lista
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity" // Opcional: un efecto visual al pasar el mouse
                    >
                        <Image
                            src={siman}
                            alt="Logo siman"
                            width={100}
                            height={60}
                            className="w-20"
                        />
                    </Link>
                </div>

                <br />
                <h2 className={`${bodoni.className} text-1xl text-white lg:text-3xl xl:text-4xl font-light mb-4 leading-loose italic text-center`}>
                    <span>Tenemos reservado <br /> un lugar para ti</span> <br />

                    <div className="flex justify-center items-center my-6">

                        {ninos ? (
                            /* CASO: adultos + niños → imagen con DOS cuadros */
                            <div className="relative inline-block">
                                <Image
                                    src={numero}
                                    alt="Lugares"
                                    width={300}
                                    height={120}
                                    className="w-64 md:w-80 mx-auto"
                                />
                                {/* Números encima de cada cuadro */}
                                <div className="absolute inset-0 flex justify-between items-center px-11 md:px-14">                                    {/* Cuadro izquierdo - Adultos */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl md:text-4xl font-extrabold text-[#ffff] drop-shadow-md">
                                            {adultos}
                                        </span>
                                        <span className="text-xs md:text-sm font-light text-white tracking-widest mt-1">
                                            Adultos
                                        </span>
                                    </div>
                                    {/* Cuadro derecho - Niños */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl md:text-4xl font-extrabold text-[#ffff] drop-shadow-md">
                                            {ninos}
                                        </span>
                                        <span className="text-xs md:text-sm font-light text-white tracking-widest mt-1">
                                            {ninos === "1" ? "Niño" : "Niños"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* CASO: solo adultos → imagen con UN cuadro */
                            <div className="relative inline-block">
                                <Image
                                    src={numeroUno}
                                    alt="Lugares"
                                    width={200}
                                    height={120}
                                    className="w-40 md:w-50 mx-auto"
                                />
                                {/* Número + etiqueta encima */}
                                <div className="absolute inset-0 flex flex-col justify-start items-center pt-11 md:pt-15">
                                    <span className="text-4xl md:text-5xl font-extrabold text-[#ffff] drop-shadow-md">
                                        {adultos}
                                    </span>
                                    <span className="text-xs md:text-sm font-light text-white tracking-widest mt-1">
                                        {adultos === "1" ? "Adulto" : "Adultos"}
                                    </span>
                                </div>
                            </div>
                        )}

                    </div>

                    { /**<span className="font-bold">
                        {ninos
                            ? `${adultos} ${adultos === "1" ? "Adulto" : "Adultos"} y ${ninos} ${ninos === "1" ? "Niño" : "Niños"}`
                            : `${adultos} ${adultos === "1" ? "Lugar" : "Lugares"} para ti`
                        }
                    </span>**/}
                </h2>

                <div id="formulario-asistencia" className={`${bodoni.className} w-full py-10 px-4 text-center bg-transparent text-white`}>
                    <h2 className="text-2xl lg:text-4xl font-semibold mb-6">Confirma tu asistencia</h2>

                    {!isFormVisible ? (
                        <Button
                            onClick={() => setIsFormVisible(true)}
                            className="mt-4 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 
            text-sm sm:text-base md:text-lg lg:text-xl 
            bg-[#5c6c34] text-white rounded-2xl shadow-lg 
            hover:bg-[#5c6c34] transition duration-300"
                        >
                            Confirmar asistencia
                        </Button>
                    ) : (
                        <div className="max-w-md mx-auto space-y-10">

                            {/* Un formulario por cada invitado */}
                            {Array.from({ length: totalInvitados }).map((_, index) => (
                                <InvitadoForm
                                    key={index}
                                    index={index}
                                    total={totalInvitados}
                                    adultos={parseInt(adultos)}
                                />
                            ))}

                        </div>
                    )}
                </div>

                <p className="text-1xl lg:text-3xl xl:text-4xl  mb-15 italic ">
                    Esperamos que puedas acompañarnos <br />
                    y confirmar tu asistencia antes del 02 de abril
                </p>



            </div>

            {/* Sección 5 - Participación */}
            <div
                className={`${bodoni.className} w-full min-h-[75rem] md:h-[85rem] lg:h-[95rem] flex flex-col items-center justify-center text-center text-black relative overflow-hidden text-black`}
                style={{
                    backgroundImage: `url(${fondSeccion4})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <Image src={iglesia} alt="iglesia" width={30} height={20} className="w-10 mx-auto" />
                <h2 className="pt-6 text-2xl lg:text-4xl italic xl:text-5xl font-light mb-4 leading-loose">
                    <span className='font-light'>CEREMONIA</span> <br /> 12:30 hrs.

                </h2>
                <Image src={copas} alt="etiqueta" width={80} height={80} className="mb-4 w-12 mx-auto" />
                <h2 className="pt-4 italic text-2xl lg:text-4xl xl:text-5xl font-light mb-1 leading-loose">
                    RECEPCIÓN <br /><span className='font-light'>13:15 hrs.</span>

                </h2>

                <div className="relative mt-10 w-[80%] max-w-sm ml-auto mr-4 md:mr-10 bg-white/80 backdrop-blur-sm rounded-tl-[3rem] rounded-br-[1rem] rounded-tr-[1rem] rounded-bl-[1rem] shadow-lg p-6 text-left">

                    {/* Nombre del lugar */}
                    <h3 className="text-lg md:text-xl lg:text-2xl italic tracking-widest text-center text-black mb-1">
                        LAGUNA BERMEJA
                    </h3>

                    {/* Dirección */}
                    <p className="text-xs md:text-sm text-center text-gray-600 italic mb-3 leading-relaxed">
                        Eventos laguna bermeja, Aldea Laguna Bermeja, <br />
                        Santa Catarina Pínula, Guatemala.
                    </p>

                    {/* Ícono Waze clickeable */}
                    <div className="flex justify-center mb-3">
                        <a
                            href="https://waze.com/ul/h9fxdy53sq"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition-transform duration-200"
                        >
                            <BrandWaze size={48} className="mx-auto" />
                        </a>
                    </div>

                    {/* Foto del lugar */}
                    <div className="w-full rounded-xl overflow-hidden">
                        <Image
                            src={fotoLuguar}
                            alt="Laguna Bermeja"
                            width={400}
                            height={250}
                            className="w-full h-44 object-cover rounded-xl"
                        />
                    </div>
                </div>

                <p className="text-1xl lg:text-2xl xl:text-3xl font-thin mb-2 italic text-center mt-10">
                    Gracias por ser parte de este momento tan especial. <br />
                    Su compañía significa mucho para nosotros. <br />
                    Con cariño, le pedimos presentar <br />
                    su invitación al ingresar.
                </p>
                <div
                    className="w-full py-12 flex flex-col items-center justify-center text-center"
                    style={{
                        backgroundImage: `url(${fondSeccion4})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <p className={`${bodoni.className} text-sm md:text-base italic text-gray-500 tracking-widest mb-1`}>
                        Designed by Woowbe
                    </p>
                    <p className="text-xs md:text-sm tracking-[0.3em] text-gray-400 uppercase">
                        www.woowbegt.com
                    </p>
                </div>
            </div>
        </div>
    );

}

function InvitadoForm({ index, total, adultos }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const [enviado, setEnviado] = useState(false);

    const esAdulto = index < adultos;
    const etiqueta = esAdulto ? `Adulto ${index + 1}` : `Niño ${index + 1 - adultos}`;

    const onSubmit = async (data) => {
        try {
            const res = await fetch("/api/registrarInvitado/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    tipo: esAdulto ? "adulto" : "nino",
                    fechaRegistro: new Date().toLocaleString("es-GT", {
                        timeZone: "America/Guatemala",
                        dateStyle: "short",
                        timeStyle: "medium",
                    }),
                }),
            });

            if (!res.ok) throw new Error("Error al enviar");

            toast.success(`Datos de ${etiqueta} enviados correctamente`);
            setEnviado(true);
            reset();
        } catch (err) {
            toast.error("Hubo un problema al enviar el formulario");
            console.error(err);
        }
    };

    if (enviado) {
        return (
            <div className="max-w-md mx-auto p-6 border border-white/30 rounded-2xl text-center">
                <p className="text-xl text-white italic">✓ {etiqueta} confirmado</p>
            </div>
        );
    }

    return (
        <div className="border border-white/30 rounded-2xl p-6">
            <h3 className="text-xl lg:text-2xl font-semibold mb-4 italic">
                {etiqueta}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Nombre */}
                <div className="text-left">
                    <Label htmlFor={`nombre-${index}`}>Nombre</Label>
                    <Input
                        id={`nombre-${index}`}
                        type="text"
                        {...register("nombre", { required: "Este campo es obligatorio" })}
                        placeholder="Tu nombre"
                    />
                    {errors.nombre && (
                        <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>
                    )}
                </div>

                {/* Apellido */}
                <div className="text-left">
                    <Label htmlFor={`apellido-${index}`}>Apellido</Label>
                    <Input
                        id={`apellido-${index}`}
                        type="text"
                        {...register("apellido", { required: "Este campo es obligatorio" })}
                        placeholder="Tu apellido"
                    />
                    {errors.apellido && (
                        <p className="text-red-400 text-sm mt-1">{errors.apellido.message}</p>
                    )}
                </div>

                {/* Confirmación */}
                <div className="text-left">
                    <Label>Confirmación</Label>
                    <div className="flex flex-col gap-3 mt-2">
                        {[
                            "Asistiré a Ceremonia",
                            "Asistiré a Recepción",
                            "Asistiré a Ceremonia y Recepción",
                            "No podré asistir",
                        ].map((opcion) => (
                            <label key={opcion} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    value={opcion}
                                    {...register("confirmacion", { required: "Por favor selecciona una opción" })}
                                    className="form-radio accent-[#5c6c34] w-4 h-4"
                                />
                                <span className="text-sm md:text-base">{opcion}</span>
                            </label>
                        ))}
                    </div>
                    {errors.confirmacion && (
                        <p className="text-red-400 text-sm mt-1">{errors.confirmacion.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 px-6 py-3 text-base lg:text-xl 
                    bg-[#5c6c34] text-white rounded-2xl shadow-lg 
                    hover:bg-[#5c6c34] transition duration-300"
                >
                    {isSubmitting ? "Enviando..." : `Confirmar ${etiqueta}`}
                </Button>
            </form>
        </div>
    );
}