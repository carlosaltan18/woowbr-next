'use client';

import Image from 'next/image';
import { BrandWaze } from 'tabler-icons-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


export function InvitacionBoda() {
  const cristinaYAndres = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754591327/bodas-woowbe/mbkho0hgpj6nk5d6nhw0.png";
  const noviosPres = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754592461/bodas-woowbe/qsb6j8obe1bozozzkowl.png";
  const logoCA = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754591438/bodas-woowbe/uqpe1e73edzinn3wlx23.png";
  const rings = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754617619/bodas-woowbe/uvbyhplyhq2xgruj8rox.png";
  const dressCode = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754689414/bodas-woowbe/bwpf9tqvqqu08affsxji.png";
  const cemaco = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754690226/bodas-woowbe/kowhqhfrn3oerkn5wtvh.png";
  const regalo = "https://res.cloudinary.com/dclzsvu62/image/upload/v1754690281/bodas-woowbe/rlykjuccwkyszilrglin.png";

    
    return (
        <div
            style={{ fontFamily: 'Josefin Sans' }}
            className="font-josefin min-h-screen flex flex-col items-center justify-center px-0"
        >
            <div
                className="w-full min-h-[40rem] h-[55rem] md:h-[50vh] lg:h-[60vh] flex flex-col justify-between text-white p-4"
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
                <Image src={logoCA} alt="Logo" width={200} height={60} className="mb-6 w-50 mx-auto" />
            </div>


            {/* Seccción de presentación de los novios*/}
            <div className="w-full h-[50rem] flex flex-col items-center justify-center text-center p-8 bg-[#4F6E71] text-white">
                <Image src={noviosPres} alt="noviosPres" width={100} height={80} className="mb-2 w-100 mx-auto" />
            </div>



            {/* Sección 2 */}
            <div className="w-full min-h-[60rem] md:h-[70vh] lg:h-[85rem] flex flex-col items-center justify-center text-center px-4 bg-[#ffff] text-black">
                <h2 className="text-2xl lg:text-4xl xl:text-5xl font-semibold mb-4 leading-loose">
                    Cristina Ramírez Rodas <br /> & <br /> Andrés Sierra Búcaro
                </h2>
                <div className="h-[6rem] text-lg font-light max-w-md mx-auto"></div>
                <h2 className="italic text-2xl lg:text-4xl xl:text-5xl font-light mb-15">
                    Con la bendición de Dios y <br/> la de nuestra familia
                </h2>
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-light mb-4 leading-loose">
                    <span className='font-semibold'>Padres de la novia:</span> <br /> Mynor Estuardo Ramírez Godoy <br /> Irene ValeskaRodas Figueredo
                </h2>
                <br />
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-light mb-4 leading-loose">
                    <span className='font-semibold'>Tíos del novio:</span> <br /> María Carolina Sierra Luna <br /> Roberto Sierra Luna
                </h2>
            </div>

            {/* Sección 3 - Información */}
            <div className="w-full py-25 px-4 text-center bg-[#1D2F23] text-white">
                <p className="text-2xl lg:text-3xl xl:text-4xl font-thin mb-4 pb-20 ">
                    Nos embarcamos en una nueva <br />
                    aventura, y nuestra boda no estaría<br />
                    completa sin la presencia de nuestros<br />
                    seres queridos, así que queremos que<br />
                    estes allí con nosotros.
                </p>
                <Image src={rings} alt="Logo" width={200} height={60} className="mb-6 w-50 mx-auto" />
                <h2 className="pt-10 text-2xl lg:text-4xl xl:text-5xl font-light mb-4 leading-loose">
                    <span className='font-bold'>FECHA</span>  <br /> DICIEMBRE 5, 2025
                
                </h2>
               <div className="w-[30%] sm:w-[35%] md:w-[40%] lg:w-[45%] xl:w-[50%] min-h-[3px] bg-white mx-auto opacity-60" />
                <h2 className="pt-10 text-2xl lg:text-4xl xl:text-5xl font-light mb-4 leading-loose">
                    <span className='font-bold'>Ceremonia y Recepción</span>  <br /> 18:00 hrs. <br /> <span className='font-semibold'>Cabaña Suiza</span>
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
                </div>
            </div>

            {/* Sección 4 - Participación */}
           <div className="w-full h-[65rem] flex flex-col items-center justify-center text-center p-8 bg-[#FFFF] text-white">
                <Image src={dressCode} alt="noviosPres" width={100} height={80} className="mb-2 w-100 mx-auto" />
            </div>

             <div className="w-full py-25 px-4 text-center bg-[#627552] text-white">
                <Image src={regalo} alt="Logo" width={50} height={40} className="mb-6 w-20 mx-auto" />
                <h2 className="pt-10 text-2xl lg:text-4xl xl:text-5xl font-thin mb-4 ">
                    <span className='font-bold'>MESA DE REGALOS</span> <br />  <br /> Nuestro mejor regalo eres tú, pero si <br />quieres tener un detalle
                
                </h2>
                <h2 className="pt-10 text-2xl lg:text-4xl xl:text-5xl font-thin mb-4 leading-loose">
                    <span className='font-bold'>BANCO INDUSTRIAL</span>  <br /> Cristina Ramírez/Andrés Sierra <br /> Cuenta Monetaria GTQ <br /> XXXXXXX
                </h2>
                <div className="pt-10">
                    <a
                        href="https://www.bing.com/search?q=cemaco&cvid=b2c3f5e424394854a83c239ad5868d45&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOdIBBzkxOWowajmoAgiwAgE&FORM=ANAB01&PC=ASTS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-white hover:opacity-80 transition"
                    >
                <Image src={cemaco} alt="Logo" width={50} height={40} className="mb-6 w-15 mx-auto" />
                    </a>
                </div>
            </div>

             
      {/* Formulario de registro 
      <div className="w-full py-20 px-4 text-center bg-[#F5F5F5] text-black">
        <h2 className="text-2xl lg:text-4xl font-semibold mb-6">Confirma tu asistencia</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-6">
          <div className="text-left">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input id="nombre" type="text" {...register("nombre")} placeholder="Tu nombre" />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          <div className="text-left">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" type="text" {...register("telefono")} placeholder="Tu teléfono" />
            {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
          </div>

          <div className="text-left">
            <Label htmlFor="confirmacion">Confirmación</Label>
            <Input id="confirmacion" type="text" {...register("confirmacion")} placeholder="Sí asistiré / No podré ir" />
            {errors.confirmacion && <p className="text-red-500 text-sm mt-1">{errors.confirmacion.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </div>
        */}

        </div>
    );
}
