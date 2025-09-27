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
import { Volume, VolumeOff } from 'tabler-icons-react';

export function InvitacionBoda() {
    const [isPlaying, setIsPlaying] = useState(true); // Estado para controlar el audio
    const audioRef = useRef(null); // Referencia al elemento de audio
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isFormVisible, setIsFormVisible] = useState(false); // Estado para manejar la visibilidad del formulario

    const toggleAudio = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
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
    const fotos = [
        "https://res.cloudinary.com/dclzsvu62/image/upload/v1758951408/bodas-woowbe/wlqjvnyseoab1coni5bq.jpg",
        "https://res.cloudinary.com/dclzsvu62/image/upload/v1756603869/bodas-woowbe/vidjsw0dbcqmofzhby1i.jpg",
        "https://res.cloudinary.com/dclzsvu62/image/upload/v1756603866/bodas-woowbe/srplewougho8u54nbsle.jpg",
        "https://res.cloudinary.com/dclzsvu62/image/upload/v1756603912/bodas-woowbe/bxsfriphhzgytktn1uzh.jpg",
        "https://res.cloudinary.com/dclzsvu62/image/upload/v1756603950/bodas-woowbe/odmvpwe5xc8k0zcygmyh.jpg",
        "https://res.cloudinary.com/dclzsvu62/image/upload/v1756603949/bodas-woowbe/sotozl5rrkq1wtzgbidr.jpg",
        "https://res.cloudinary.com/dclzsvu62/image/upload/v1756603909/bodas-woowbe/zkuciujbcnbbq5qptor4.jpg",
        "https://res.cloudinary.com/dclzsvu62/image/upload/v1758951408/bodas-woowbe/qzkcwncloyus5diayvzl.jpg",

    ];

    const [fotoPrincipal, setFotoPrincipal] = useState(fotos[0]);

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: false,
        focusOnSelect: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

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
        const fechaBoda = new Date("2025-12-05T12:00:00");
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
    const cristinaYAndres = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754591327/bodas-woowbe/mbkho0hgpj6nk5d6nhw0.png";
    const noviosPres = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754592461/bodas-woowbe/qsb6j8obe1bozozzkowl.png";
    const logoCA = "https://res.cloudinary.com/dclzsvu62/image/upload/v1758949126/bodas-woowbe/ek7posiwl9jlqgoi1tg0.png";
    const rings = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754617619/bodas-woowbe/uvbyhplyhq2xgruj8rox.png";
    const dressCode = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754689414/bodas-woowbe/bwpf9tqvqqu08affsxji.png";
    const money = "https://res.cloudinary.com/dclzsvu62/image/upload/v1758949126/bodas-woowbe/hlcolowzykymkvy7fb9l.png";
    const regalo = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754690281/bodas-woowbe/rlykjuccwkyszilrglin.png";
    const asistencia = "https://res.cloudinary.com/dclzsvu62/image/upload/v1755609043/bodas-woowbe/gokxkcfg4plke4sezbb5.png"
    const numero = "https://res.cloudinary.com/dclzsvu62/image/upload/v1758949126/bodas-woowbe/mtz4zjuzd7fhz4xbnkdz.png"
    const fechaNovios = "https://res.cloudinary.com/dclzsvu62/image/upload/v1758949125/bodas-woowbe/rmyc5zzmdbrzjbeeanbp.png"
    const calendario = "https://res.cloudinary.com/dclzsvu62/image/upload/v1755611870/bodas-woowbe/al9xjqxi9kmtiridnkce.png"
    const botella = "https://res.cloudinary.com/dclzsvu62/image/upload/v1756141616/bodas-woowbe/at9eqdskwknzrrddfwgq.png"
    const vestimenta = "https://res.cloudinary.com/dclzsvu62/image/upload/v1756141617/bodas-woowbe/c2cpdm3z3azfwwoqlyip.png"
    const etiqueta = "https://res.cloudinary.com/dclzsvu62/image/upload/v1756141617/bodas-woowbe/nqzfb4czbxvat2fgkmyf.png"
    const laurel = "https://res.cloudinary.com/dclzsvu62/image/upload/v1756141616/bodas-woowbe/dopbcsk0qkrogm6w7jfo.png"
    const fotoGaleriaPrincipal = "https://res.cloudinary.com/dclzsvu62/image/upload/v1756603909/bodas-woowbe/zkuciujbcnbbq5qptor4.jpg"
    return (
        <div
            style={{ fontFamily: 'Josefin Sans' }}
            className="font-josefin min-h-screen flex flex-col items-center justify-center px-0 relative"
        >
            {/* Barra de progreso */}
            <div
                style={{ width: `${scrollProgress}%` }}
                className="fixed top-0 left-0 h-3 bg-[#4F6E71] z-50"
            ></div>
            {/* Bocina para controlar el audio */}
            <div className="absolute top-4 right-4 z-50 cursor-pointer">
                <Volume
                    size={32}
                    onClick={toggleAudio}
                    className={`text-gray-800 hover:text-gray-600 ${isPlaying ? 'opacity-100' : 'opacity-50'
                        }`}
                />
            </div>

            {/* Audio de fondo */}
            <audio ref={audioRef} autoPlay loop>
                <source src="./BodaCristina.mp3" type="audio/mpeg" />
                Tu navegador no soporta el elemento de audio.
            </audio>

            {/* Contenido de la invitación */}
            <Toaster />
            <div
                className="w-full min-h-[40rem] h-[45rem] md:h-[50vh] lg:h-[60vh] flex flex-col justify-between text-white p-4"
                style={{
                    backgroundImage: `url(${cristinaYAndres})`,
                    backgroundSize: "cover",
                    backgroundPosition: "100% center",
                    backgroundRepeat: "no-repeat",
                }}
            >

                <div className="
                    flex-grow flex items-start justify-start w-full
                        md:items-center md:justify-center
                    ">
                    <div className="w-full flex flex-col items-start md:items-center">
                    </div>
                </div>
                <h2 className='text-black font-bold text-center'>Ahora permanecen la fe, <br />
                    la esperanza y el amor… <br /> y el mayor de ellos es el amor.</h2>
                <h4 className='text-black font-light text-sm text-center'>Corintios 13:13</h4>
                <br />
                <br />
                <Image src={logoCA} alt="Logo" width={200} height={60} className="mb-6 w-50 mx-auto" />
            </div>


            {/* Seccción de presentación de los novios*/}
            <div className="w-full h-[50rem] flex flex-col items-center justify-center text-center p-8 bg-[#4F6E71] text-white">
                <h2 className="text-2xl lg:text-4xl xl:text-5xl font-semibold mb-4 leading-loose">
                    Cristina & Andrés
                </h2>
                {/* Div vacío para separar componentes */}
                <div className="w-full h-19"></div>
                <Image src={fechaNovios} alt="noviosPres" width={100} height={80} className="mb-2 w-100 mx-auto" />
                <br />
                <div className="flex flex-col items-center justify-center text-center p-6">
                    <h2 className="text-1xl lg:text-3xl font-semibold mb-4">
                        <span className="text-3xl">Faltan:</span> <br />
                        <span className="text-1xl">Boda de Cristina y Andrés</span>
                    </h2>
                    <p className="text-2xl lg:text-6xl font-medium text-white">
                        {tiempoRestante.dias} días {tiempoRestante.horas}h : {tiempoRestante.minutos}m : {tiempoRestante.segundos}s
                    </p>
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
                    <span className='font-semibold'>Padres de la novia:</span> <br /> Mynor Estuardo Ramírez Godoy <br /> Irene ValeskaRodas Figueredo
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
                        href="https://www.waze.com/es/live-map/directions/zona-1,-mixco?navigate=yes&to=place.ws.row.41014680.none"
                        target="_blank"
                        rel="noopener noreferrer"
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
                    <span className='font-bold text-2xl lg:text-4xl xl:text-5xl'>MESA DE REGALOS</span> <br />  <br />  <span className='text-1xl lg:text-3xl xl:text-4xl'>Nuestro mejor regalo es poder celebrar contigo, <br />pero si quieres
                    tener un detalle te dejamos estas opciones:</span>

                </h2>
                <h2 className="pt-10 text-1xl lg:text-4xl xl:text-5xl font-thin mb-4 leading-loose">
                    <span className='text-2xl lg:text-3xl xl:text-5xl font-semibold'>BANCO INDUSTRIAL</span>  <br /><br /> <span className='text-1xl lg:text-2xl xl:text-4xl font-thin'>Ramirez Rodas Cristina Irene O / Sierra B <br /> Cuenta Monetaria GTQ <br /><span className='text-1xl lg:text-2xl xl:text-4xl font-bold'>2061390247</span></span>
                </h2>
                <div className="pt-10">
                    <Image src={money} alt="Logo" width={50} height={40} className="mb-6 w-15 mx-auto" />
                </div>
                <h2 className="pt-10 text-2xl lg:text-4xl xl:text-5xl font-thin leading-loose">
                    <span className='font-bold'>EFECTIVO</span></h2>
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
                <Image src={numero} alt="Logo" width={100} height={60} className=" w-25 mx-auto" />
                <span className='font-bold'>para ti</span> <br />
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
            {/* Sección 7*/}
            <div className="w-full min-h-[50rem] md:h-[90vh] lg:h-[120rem] flex flex-col items-center justify-center text-center bg-[#4c6454] text-white">
                <Image src={calendario} alt="Logo" width={150} height={60} className="mb-6 mx-auto w-16 sm:w-16 md:w-25 lg:w-25 h-auto mt-5" />
                <h1 className="text-2xl lg:text-4xl xl:text-5xl font-semibold mb-15 " >
                    Calendario
                </h1>
                <p className="text-00.5xl lg:text-4xl xl:text-5xl font-semibold mb-15 ">
                    No olvides guardar la fecha de <br />nuestra boda en tu calendario.
                </p>
                <a
                    href="https://www.google.com/calendar/render?action=TEMPLATE&text=Boda+de+Cristina+y+Andrés&dates=20251206T000000Z/20251206T050000Z&details=¡Acompáñanos+a+celebrar+este+día+tan+especial!&location=Cabaña+Suiza,+Km20.8+Carretera+Interamericana,+Guatemala"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 
             text-sm sm:text-base md:text-lg lg:text-xl 
             bg-[#1D2F23] text-white rounded-3xl shadow-lg 
             hover:bg-gray-800 transition duration-300"
                >
                    Calendario
                </a>
                {/*<div className="h-[8rem] text-lg font-light max-w-md mx-auto"></div>*/}

                {/* Galería de fotos */}
                <div className="w-full py-10 px-4 text-center bg-[#4c6454]">
                    {/* Foto principal */}
                    <div className="mb-8">
                        <Image
                            src={fotoPrincipal}
                            alt="Foto principal"
                            width={800}
                            height={500}
                            className="rounded-xl shadow-lg mx-auto object-cover"
                        />
                    </div>

                    {/* Carrusel con fotos alineadas */}
                    <div className="w-full max-w-md sm:max-w-15xl md:max-w-4xl lg:max-w-3xl xl:max-w-2xl mx-auto">
                        <Slider {...sliderSettings}>
                            {fotos.map((foto, i) => (
                                <div key={i} className="px-2">
                                    {/* Contenedor con tamaño fijo */}
                                    <div className="aspect-square max-w-[250px] mx-auto flex items-center justify-center bg-gray-200 rounded-lg overflow-hidden">
                                        <Image
                                            src={foto}
                                            alt={`Foto ${i + 1}`}
                                            width={500}
                                            height={500}
                                            className="object-cover w-full h-full cursor-pointer rounded-lg shadow-md hover:opacity-80 transition"
                                            onClick={() => setFotoPrincipal(foto)}
                                        />
                                    </div>

                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>

        </div>
    );
}
