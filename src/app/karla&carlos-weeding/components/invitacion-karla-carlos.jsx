'use client';

import Image from 'next/image';
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
    const [isPlaying, setIsPlaying] = useState(true); // Estado para controlar el audio
    const audioRef = useRef(null); // Referencia al elemento de audio
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isFormVisible, setIsFormVisible] = useState(false); // Estado para manejar la visibilidad del formulario

    const searchParams = useSearchParams();
    const invitado = searchParams.get("invitado");


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
    const rings = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754617619/bodas-woowbe/uvbyhplyhq2xgruj8rox.png";
    const money = "https://res.cloudinary.com/dclzsvu62/image/upload/v1758949126/bodas-woowbe/hlcolowzykymkvy7fb9l.png";
    const regalo = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754690281/bodas-woowbe/rlykjuccwkyszilrglin.png";
    const asistencia = "https://res.cloudinary.com/dclzsvu62/image/upload/v1755609043/bodas-woowbe/gokxkcfg4plke4sezbb5.png"
    const numero = "https://res.cloudinary.com/dclzsvu62/image/upload/v1758949126/bodas-woowbe/mtz4zjuzd7fhz4xbnkdz.png"
    const muerto = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773805374/INVITACIÓN_KARLA_ALVIZURES_-09_sfrsbc.png"
    const calendario = "https://res.cloudinary.com/dclzsvu62/image/upload/v1755611870/bodas-woowbe/al9xjqxi9kmtiridnkce.png"
    const botella = "https://res.cloudinary.com/dclzsvu62/image/upload/v1756141616/bodas-woowbe/at9eqdskwknzrrddfwgq.png"
    const vestimenta = "https://res.cloudinary.com/dclzsvu62/image/upload/v1756141617/bodas-woowbe/c2cpdm3z3azfwwoqlyip.png"
    const etiqueta = "https://res.cloudinary.com/dclzsvu62/image/upload/v1756141617/bodas-woowbe/nqzfb4czbxvat2fgkmyf.png"
    const laurel = "https://res.cloudinary.com/dclzsvu62/image/upload/v1756141616/bodas-woowbe/dopbcsk0qkrogm6w7jfo.png"
    const numeroUno = "https://res.cloudinary.com/dclzsvu62/image/upload/v1759203153/bodas-woowbe/kyeog6wdeaxmdmbshkvw.png"
    const fondoSeccion1 = "https://res.cloudinary.com/dclzsvu62/image/upload/v1773803989/INVITACIÓN_KARLA_ALVIZURES_-02_xh1jtz.png"

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
                    <div className="mt-2">
                        <Image
                            src={logoCA}
                            alt="Logo"
                            width={150}
                            height={150}
                            className="rounded-full  rotate-90 -translate-x-5"
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
                            Dios nos ha concedido el privilegio<br className="hidden md:block" />
                            de conocernos y amarnos, y hoy<br className="hidden md:block" />
                            con su bendición<br className="hidden md:block" />
                            y la de nuestros padres queremos<br className="hidden md:block" />
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
            <div className="w-full min-h-[60rem] md:h-[70vh] lg:h-[85rem] flex flex-col items-center justify-center text-center px-4 bg-[#ffff] text-black">
                <h2 className="text-2xl lg:text-4xl xl:text-5xl font-semibold mb-4 leading-loose">
                    Cristina Ramírez Rodas <br /> & <br /> Andrés Sierra Búcaro
                </h2>
                <div className="h-[6rem] text-lg font-light max-w-md mx-auto"></div>
                <h2 className="italic text-2xl lg:text-4xl xl:text-5xl font-light mb-15">
                    Con la bendición de Dios y <br /> la de nuestra familia
                </h2>
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-light mb-4 leading-loose">
                    <span className='font-semibold'>Padres de la novia:</span> <br /> Mynor Estuardo Ramírez Godoy <br /> Irene Valeska Rodas Figueredo
                </h2>
                <br />
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-light mb-4 leading-loose">
                    <span className='font-semibold'>Tíos del novio:</span> <br /> María Carolina Sierra Luna <br /> Roberto Sierra Luna
                </h2>
            </div>

            {/* Sección 4 - Información */}
            <div className="w-full py-25 px-4 text-center bg-[#1D2F23] text-white">
                <p className="text-1xl lg:text-3xl xl:text-4xl font-thin mb-4 pb-15 ">
                    Nos embarcamos en una nueva <br />
                    aventura, y nuestra boda no estaría<br />
                    completa sin la presencia de nuestros<br />
                    seres queridos, así que queremos que<br />
                    estes allí con nosotros.
                </p>
                <Image src={rings} alt="Logo" width={200} height={60} className="mb-6 w-50 mx-auto" />
                {/**   <div className="w-[90%] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[90%] min-h-[3px] bg-white mx-auto opacity-60" />
 */}
                <h2 className="pt-10 text-2xl lg:text-4xl xl:text-5xl font-light mb-4 ">
                    <span className='font-bold'>CEREMONIA RELIGIOSA</span> <br /><br /> <span className='text-sm font-light'>Capilla San Benito Abad , ubicada en Cabaña Suiza</span>
                    <br /> <span className='text-sm font-light'>18:00 - 19:00 hrs. </span>
                </h2>
                <h2 className="pt-10 text-2xl lg:text-4xl xl:text-5xl font-light mb-4 ">
                    <span className='font-bold'>RECEPCIÓN</span>  <br /><br /><span className='text-sm font-light'> Plaza Helvetia Cabaña Suiza</span>
                    <br /> <span className='text-sm font-light'>19:30 - 00:30 hrs. </span>
                </h2>
                <div className="pt-10">
                    <a
                        href="waze://?ll=14.616129,-90.618389&navigate=yes"
                        onClick={(e) => {
                            // Fallback a web si la app no está instalada
                            setTimeout(() => {
                                window.location.href =
                                    "https://www.waze.com/es/live-map/directions?to=ll.14.616129%2C-90.618389";
                            }, 500);
                        }}
                        className="inline-block text-white hover:opacity-80 transition"
                    >
                        <BrandWaze size={48} className="mx-auto" />
                    </a>
                    <h4>Cabaña Suiza</h4>
                </div>
            </div>

            {/* Sección 5 - Participación */}
            <div className="w-full min-h-[65rem] md:h-[70vh] lg:h-[85rem] flex flex-col items-center justify-center text-center p-8 bg-[#FFFF] text-black">
                <Image src={laurel} alt="laurel" width={30} height={20} className="w-10 mx-auto" />
                <h2 className="pt-6 text-2xl lg:text-4xl xl:text-5xl font-light mb-4 leading-loose">
                    <span className='font-bold'>DRESS CODE</span>

                </h2>
                <Image src={etiqueta} alt="etiqueta" width={80} height={80} className="mb-4 w-60 mx-auto" />
                <h2 className="pt-4 text-2xl lg:text-4xl xl:text-5xl font-light mb-1 leading-loose">
                    ETIQUETA <br /><span className='font-bold'>FORMAL</span>

                </h2>
                <Image src={vestimenta} alt="vestimenta" width={80} height={80} className="mb-2 w-60 mx-auto" />
                <Image src={botella} alt="etiqueta" width={80} height={80} className="mb-4 w-60 mx-auto" />
                <h2 className="pt-4 text-2xl lg:text-4xl xl:text-5xl font-light mb-1 leading-loose">
                    <span className='font-thin'>B  O  D  A</span> <br /><span className='font-bold'>SIN NIÑOS</span>
                </h2>

                <p className="text-1xl lg:text-2xl xl:text-3xl font-light mb-4">
                    Aunque nos gustan mucho los niños, <br />
                    esta será una celebración sólo para adultos,  <br />
                    por lo que agradeceremos tu comprensión.
                </p>
            </div>

            <div className="w-full py-25 px-4 text-center bg-[#627552] text-white">
                <Image src={regalo} alt="Logo" width={50} height={40} className="mb-6 w-20 mx-auto" />
                <h2 className="pt-10 text-1xl lg:text-3xl xl:text-4xl font-thin mb-4 ">
                    <span className='font-bold text-2xl lg:text-4xl xl:text-5xl'>MESA DE REGALOS</span> <br />  <br />  <span className='text-1xl lg:text-3xl xl:text-4xl'>Nuestro mayor regalo es poder celebrar junto a ti.<br />Como ya tenemos nuestra casa equipada, si deseas obsequiarnos algo,
                        agradeceríamos una colaboración monetaria. Recuerda que tu compañía es lo que realmente hará de nuestra boda un momento inolvidable.</span>

                </h2>
                <h2 className="pt-10 text-1xl lg:text-4xl xl:text-5xl font-thin mb-4 leading-loose">
                    <span className='text-2xl lg:text-3xl xl:text-5xl font-semibold'>BANCO INDUSTRIAL</span>  <br /><br /> <span className='text-1xl lg:text-2xl xl:text-4xl font-thin'>Ramirez Rodas Cristina Irene O / Sierra Búcaro Andrés <br /> Cuenta Monetaria GTQ <br /><span className='text-1xl lg:text-2xl xl:text-4xl font-bold'>2061390247</span></span>
                </h2>
                <h2 className='text-2xl lg:text-3xl xl:text-5xl font-semibold'> Ó</h2>
                <div className="pt-10">
                    <Image src={money} alt="Logo" width={50} height={40} className="mb-6 w-15 mx-auto" />
                </div>
                <h2 className="pt-10 text-2xl lg:text-4xl xl:text-5xl font-thin leading-loose">
                    <span className='font-bold'>LLUVIA DE SOBRES</span></h2>
            </div>


            {/* Sección 6 */}
            <div className="w-full min-h-[75rem] md:h-[85rem] lg:h-[95rem] flex flex-col items-center justify-center text-center bg-[#ffff] text-black">
                <Image src={asistencia} alt="Logo" width={100} height={60} className="mb-6 w-25 mx-auto" />

                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-15">
                    ASISTENCIA
                </h1>

                <h2 className="text-1xl lg:text-3xl xl:text-4xl font-light mb-4">
                    Tu presencia es muy importante <br /> para nosotros, por favor confírmanos <br /> tu asistencia llenando el siguiente formulario.
                </h2>
                <br />
                <h2 className="text-1xl lg:text-3xl xl:text-4xl font-light mb-4 leading-loose">
                    <span className='font-bold'>Hemos reservado</span> <br />
                    <Image
                        src={invitado === "1"
                            ? numero
                            : numeroUno}
                        alt="Número"
                        width={100}
                        height={60}
                        className="w-25 mx-auto"
                    />
                    <span className='font-bold'> {invitado === "1" ? "Lugares" : "Lugar"} para ti</span> <br />
                    <span className='font-thin'>Fecha límite para confirmar: <br /> 2 de noviembre del 2025. <br /> </span>
                </h2>

                <div id="formulario-asistencia" className="w-full py-10 px-4 text-center bg-[#FFFF] text-black">
                    <h2 className="text-2xl lg:text-4xl font-semibold mb-6">Confirma tu asistencia</h2>
                    {!isFormVisible ? (
                        <Button
                            onClick={() => setIsFormVisible(true)} // Muestra el formulario
                            className="mt-4 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 
          text-sm sm:text-base md:text-lg lg:text-xl 
          bg-black text-white rounded-2xl shadow-lg 
          hover:bg-gray-800 transition duration-300"
                        >
                            Confirmar asistencia
                        </Button>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-6">
                            <div className="text-left">
                                <Label htmlFor="nombre">Nombre completo</Label>
                                <Input id="nombre" type="text" {...register("nombre", { required: "Este campo es obligatorio" })} placeholder="Tu nombre" />
                                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
                            </div>

                            <div className="text-left">
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input id="telefono" type="text" {...register("telefono", { required: "Este campo es obligatorio" })} placeholder="Tu teléfono" />
                                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
                            </div>

                            <div className="text-left">
                                <Label htmlFor="confirmacion">Confirmación</Label>
                                <div className="flex items-center gap-4 mt-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="Sí asistiré"
                                            {...register("confirmacion", { required: "Por favor selecciona una opción" })}
                                            className="form-radio"
                                        />
                                        Sí asistiré
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="No podré ir"
                                            {...register("confirmacion", { required: "Por favor selecciona una opción" })}
                                            className="form-radio"
                                        />
                                        No podré ir
                                    </label>
                                </div>
                                {errors.confirmacion && <p className="text-red-500 text-sm mt-1">{errors.confirmacion.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-4 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 
            text-sm sm:text-base md:text-lg lg:text-xl 
            bg-black text-white rounded-2xl shadow-lg 
            hover:bg-gray-800 transition duration-300"
                            >
                                {isSubmitting ? "Enviando..." : "Enviar confirmación"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
            {/* Sección etinerario 
            <div className="w-full min-h-[55rem] md:h-[70vh] lg:h-[85rem] flex flex-col items-center justify-center text-center bg-[#4c6454] text-black">
                <Image src={ubicacion} alt="Logo" width={150} height={60} className="mb-6 w-13 mx-auto" />
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-15 text-white" >
                    ETINERARIO
                </h1>
                <Image src={etinerario} alt="Logo" width={150} height={60} className="mb-6 mx-auto w-60 sm:w-52 md:w-60 lg:w-90 h-auto" />

            </div>*/}


        </div>
    );
}
