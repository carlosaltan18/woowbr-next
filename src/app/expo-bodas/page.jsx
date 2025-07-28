import Image from 'next/image';
import fondo from '@assets/mujer-png.png';
import bodasss from '@assets/bodasss.png';
import anillos from '@assets/anillos.png';
import wooebe from '@assets/wowbe.png';
import pasos from '@assets/pasos.png';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import woowbeBlack from '@assets/woowbeBlack.png';
import textura from '@assets/textura.jpg';

export default function Boda1() {
  return (
    <div
      style={{ fontFamily: 'Josefin Sans' }}
      className="font-josefin min-h-screen flex flex-col items-center justify-center px-0"
    >
      {/* Fondo de textura en todo el body */}
      <div
        className="fixed inset-0 w-full h-full -z-10"
        style={{
          backgroundImage: `url(${textura.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="w-full h-[40rem] flex flex-col justify-between bg-black text-white p-4">
        <div className="
          flex-grow flex items-start justify-start w-full
          md:items-center md:justify-center
        ">
          <div className="w-full flex flex-col items-start md:items-center">
            <h1 className="
              w-full flex flex-col items-start justify-center text-left
              md:items-center md:text-center
              mt-32 md:mt-0
            ">
              <span className="block text-6xl mb-2 font-medium">Mi primer</span>
              <span className="block text-6xl mb-2 font-thin">Regalo de</span>
              <span className="block text-8xl font-bold">Bodas</span>
            </h1>
            <Image
              src={bodasss}
              alt="Invitación"
              width={240}
              height={320}
              className="w-[15rem] mt-8 object-cover rounded-md self-start md:self-center"
            />
          </div>
        </div>
        <Image src={woowbeBlack} alt="Woebe Logo" width={200} height={60} className="mb-6 w-50 mx-auto" />
      </div>


      <div
        className="w-full relative mb-0 overflow-hidden"
        style={{ aspectRatio: "1 / 1.1" }}
      >
        {/* Imagen de fondo posicionada y movida visualmente hacia la izquierda */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={fondo}
            alt="Invitación"
            fill
            style={{ objectFit: "cover", objectPosition: "left", zIndex: 7, transform: "translateX(-35%)" }}
          />
        </div>

        {/* Overlay blanco translúcido */}
        <div className="absolute inset-0 bg-white/10 z-10" />

        {/* Texto encima */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 pr-10 flex flex-col items-end text-right w-full">
          <span className="block text-xl md:text-2xl lg:text-3xl font-light tracking-[0.15em] text-gray-600 mb-1">
            LA INVITACIÓN
          </span>
          <span className="block text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.05em] text-gray-800">
            PERFECTA
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col items-center mx-auto mb-10 overflow-hidden space-y-8 p-0">

        <div className="fixed left-0 w-screen bg-black py-8 flex justify-center items-center my-none z-10" style={{ position: "relative" }}>
          <h2 className="text-6xl font-semibold text-center text-white m-0">
            Junio 30, 2025.
          </h2>
        </div>
        <Image
          src={anillos}
          alt="Descripción de la imagen"
          width={176}
          height={176}
          className="w-[11rem] mx-auto object-cover rounded-md py-20 pb-none"
        />
        <div className="relative w-full flex flex-col items-center">
          <h2 className="text-5xl font-bold text-center text-black z-10 m-0">
            SAVE THE DATE.
          </h2>
        </div>
        <hr />
        <Image
          src={wooebe}
          alt="Descripción de la imagen"
          width={240}
          height={160}
          className="w-[15rem] mx-25 object-cover rounded-md mt-15 mb-25"
        />
        <div className="fixed left-0 w-screen bg-black py-8 flex justify-center items-center my-4 z-10" style={{ position: "relative" }}>
          <h2 className="text-4xl font-semibold text-center text-white m-0 w-full">
            Obsequiaremos 3 invitaciones digitales.
          </h2>
        </div>
        <br />
        <div>
          <h3 className="text-2xl font-semibold mb-4">¿Qué incluye?</h3>
          <ol className="text-lg list-disc list-inside text-left max-w-[14rem] mx-auto font-thin">
            <li>Información de boda</li>
            <li>Mención de los padres</li>
            <li>Ubicación por Waze</li>
            <li>Confirmación por Whatsapp</li>
            <li>Enlace a mesa de regalo</li>
            <li>3 espacios para fotografías</li>
            <li>Contador regresivo</li>
          </ol>
        </div>
      </div>

      <div className="w-full flex flex-col items-center mx-auto mb-10 overflow-hidden space-y-8 p-4">
        <div className="fixed left-0 w-screen bg-black py-8 flex justify-center items-center my-4 z-10" style={{ position: "relative" }}>
          <Image
            src={pasos}
            alt="Descripción de la imagen"
            width={400}
            height={200}
            className="w-[25rem] mx-auto object-cover rounded-md"
          />
        </div>
        <div className="text-center px-4 font-thin mt-15 " >
          <h3 className="text-3xl mb-4 " >Participar es muy fácil:</h3>
          <p className="text-2xl mb-4">Pasos a seguir en Instagram:</p>
          <ol className="text-center list-decimal list-inside font-thin text-lg max-w-md mx-auto space-y-2">
            <li>
              Sigue a <strong>@woowbegt</strong> y <strong>@Expoboda</strong>
            </li>
            <li>
              Dale <span className="text-red-500">❤</span> a esta publicación
            </li>
            <li>
              Comenta la fecha de tu boda y etiqueta a tu pareja o a alguien que se vaya a casar
            </li>
            <li>
              Comparte esta publicación en tus historias y etiquétanos <em>(cuenta pública)</em>
            </li>
          </ol>
        </div>
      </div>

      <div className="text-4xl text-center font-semibold mb-8 py-30 pb-30">
        <p className="mb-4 pb-10">Síguenos</p>
        <div className="flex justify-center gap-8 text-black">
          <a href="https://www.instagram.com/woowbe/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="hover:scale-110 transition-transform" />
          </a>
          <a href="https://www.tiktok.com/@woowbegt" target="_blank" rel="noopener noreferrer">
            <SiTiktok className="hover:scale-110 transition-transform text-black" />
          </a>
          <a href="https://www.facebook.com/WoowBeGT/?locale=es_LA" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
