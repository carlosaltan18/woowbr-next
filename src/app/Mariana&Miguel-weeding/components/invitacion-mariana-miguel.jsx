"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  MapPin,
  Music2,
  Pause,
  X,
} from "lucide-react";

const ASSET = (path) => `/mariana-miguel/${path}`;

const EVENT = {
  startsAt: "2026-11-28T15:00:00-06:00",
  endsAt: "2026-11-29T00:00:00-06:00",
  location: "Granja Santa Isabel, Santa Catarina Pinula",
  address:
    "Km 16.5 Carretera a El Salvador, Res. San Antonio 3ra Ave. 0-55 (dentro de Residenciales San Antonio)",
  googleMaps: "https://maps.app.goo.gl/URyvEkNHh245Szs8A",
  waze: "https://waze.com/ul/h9fxdtx13d",
};

const RSVP_SHEET_CONFIG = {
  spreadsheetId: "116YqFxtiOD3MGQNTyXfbYCuleFJrW6Y9XNdSyDW4yXc",
  range: "Confirmaciones!A:H",
  headers: [
    "Invitación",
    "Pases reservados",
    "Asistentes y celebración",
    "Total confirmados",
    "Misa",
    "Recepción",
    "Comentario",
    "Fecha de registro",
  ],
};

const MESSAGE_SHEET_CONFIG = {
  spreadsheetId: RSVP_SHEET_CONFIG.spreadsheetId,
  range: "Mensajes!A:E",
  headers: ["Fecha", "ID", "Invitación", "Nombre", "Mensaje"],
};

const GALLERY = Array.from({ length: 8 }, (_, index) =>
  ASSET(`img/fotos/foto-${String(index + 1).padStart(2, "0")}.webp`),
);
const CELEBRATION_OPTIONS = [
  ["both", "Misa y recepción"],
  ["mass", "Solo misa"],
  ["reception", "Solo recepción"],
  ["no", "No asistiré"],
];

function getReservation(searchParams) {
  const first = (...keys) =>
    keys.map((key) => searchParams.get(key)?.trim()).find(Boolean) ?? "";
  const requestedSeats = Number.parseInt(
    first("pases", "adultos", "invitados", "cantidad") || "1",
    10,
  );
  const seats = Number.isFinite(requestedSeats)
    ? Math.min(Math.max(requestedSeats, 1), 12)
    : 1;
  return {
    guestName: first("nombre", "invitado", "n", "familia"),
    seats,
    id: first("id", "codigo"),
  };
}

function useCountdown(date) {
  const getTime = () => {
    const remaining = Math.max(
      0,
      Math.floor((new Date(date).getTime() - Date.now()) / 1000),
    );
    return {
      days: String(Math.floor(remaining / 86400)).padStart(2, "0"),
      hours: String(Math.floor((remaining % 86400) / 3600)).padStart(2, "0"),
      minutes: String(Math.floor((remaining % 3600) / 60)).padStart(2, "0"),
      seconds: String(remaining % 60).padStart(2, "0"),
    };
  };
  const [time, setTime] = useState(getTime);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(getTime()), 1000);
    return () => window.clearInterval(timer);
  }, [date]);
  return time;
}

function Section({ children, className = "", id }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -9% 0px", threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative px-[8cqw] py-[6cqw] text-center transition-[opacity,transform] duration-1000 ease-out motion-reduce:transform-none motion-reduce:transition-none ${visible ? "opacity-100" : "translate-y-6 opacity-0"} ${className}`}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }) {
  return (
    <p className="text-[.62rem] font-semibold uppercase tracking-[.3em] text-[#4b4c35]">
      {children}
    </p>
  );
}

function Branch({ flipped = false, className = "" }) {
  return (
    <img
      src={ASSET("img/ramita.webp")}
      alt=""
      aria-hidden="true"
      className={`mx-auto mb-8 w-9 ${flipped ? "-scale-x-100 rotate-[-12deg]" : ""} ${className}`}
    />
  );
}

function Envelope({ reservation, open, onOpen }) {
  return (
    <div
      className={`fixed inset-0 z-[70] grid place-items-center overflow-hidden bg-[#10301d] transition duration-[1400ms] ${open ? "pointer-events-none invisible opacity-0" : "opacity-100"}`}
      style={{ transitionDelay: open ? "400ms" : "0ms" }}
      aria-hidden={open || undefined}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label="Abrir invitación de Mariana y Miguel"
        className="relative aspect-[9/16] max-h-[100dvh] max-w-full overflow-hidden text-[#cfe0c6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-5px] focus-visible:outline-[#cfe0c6]"
        style={{ width: "min(100vw, calc(100dvh * 9 / 16), 480px)" }}
      >
        <img
          src={ASSET("img/sobre.webp")}
          alt="Sobre de la invitación de Mariana y Miguel"
          className={`h-full w-full object-cover transition duration-[1400ms] ease-[cubic-bezier(.7,0,.3,1)] ${open ? "scale-125" : ""}`}
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[57.2%] aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b8d0ab]/10 shadow-[0_0_0_10px_rgba(184,208,171,.1)] animate-pulse"
        />
        {reservation.guestName && (
          <div className="absolute inset-x-[8%] top-[72%] text-center [text-shadow:0_1px_0_rgba(0,0,0,.55)]">
            <span className="block text-xs uppercase tracking-[.4em] opacity-80">
              Para
            </span>
            <span className="mt-1 block font-serif text-4xl italic leading-tight sm:text-5xl">
              {reservation.guestName}
            </span>
          </div>
        )}
        <span className="absolute inset-x-0 bottom-[max(5vh,env(safe-area-inset-bottom))] text-center text-[.65rem] font-medium uppercase tracking-[.3em]">
          Toca el sello para abrir
        </span>
      </button>
    </div>
  );
}

function MusicButton({ playing, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Pausar música" : "Reproducir música"}
      className={`fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-[#f5eadb]/70 bg-[#6a0f1b] text-[#f5eadb] shadow-lg transition hover:scale-105 after:absolute after:inset-0 after:bg-[#6a0f1b]/70 after:mix-blend-multiply ${playing ? "after:animate-pulse" : ""}`}
      style={{
        backgroundImage: `url(${ASSET("img/boton.webp")})`,
        backgroundSize: "cover",
      }}
    >
      {playing ? (
        <Pause className="relative z-10" size={17} fill="currentColor" />
      ) : (
        <Music2 className="relative z-10" size={18} />
      )}
    </button>
  );
}

function CalendarLinks() {
  const [open, setOpen] = useState(false);
  const googleCalendarUrl = useMemo(() => {
    const stamp = (value) =>
      new Date(value)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Boda Mariana & Miguel")}&dates=${stamp(EVENT.startsAt)}/${stamp(EVENT.endsAt)}&location=${encodeURIComponent(`${EVENT.location} — ${EVENT.address}`)}&details=${encodeURIComponent("¡Te esperamos!")}`;
  }, []);
  const downloadIcs = () => {
    const stamp = (value) =>
      new Date(value)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Woowbe//Mariana y Miguel//ES",
      "BEGIN:VEVENT",
      `UID:boda-mariana-miguel-20261128@woowbe`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(EVENT.startsAt)}`,
      `DTEND:${stamp(EVENT.endsAt)}`,
      "SUMMARY:Boda Mariana & Miguel",
      `LOCATION:${EVENT.location}`,
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Boda Mariana & Miguel",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([content], { type: "text/calendar;charset=utf-8" }),
    );
    link.download = "boda-mariana-y-miguel.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <div className="relative mx-auto mt-[6cqw] flex max-w-xs flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="inline-flex min-h-11 min-w-[37cqw] items-center justify-center gap-[2.5cqw] rounded-[3cqw] bg-[#6a0f1b] bg-cover bg-center px-[6cqw] py-[2.8cqw] text-[3.3cqw] font-medium uppercase tracking-[.22em] text-[#d8c8be] italic shadow-md transition hover:brightness-110"
        style={{ backgroundImage: `url(${ASSET("img/boton.webp")})` }}
      >
        <CalendarDays size={18} />
        Save the date
        <ChevronDown size={15} className={open ? "rotate-180" : ""} />
      </button>
      {open && (
        <div className="mt-[2.5cqw] overflow-hidden rounded-[2.5cqw] bg-[#fbf4ea] shadow-[0_2cqw_5cqw_rgba(0,0,0,.12)]">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noreferrer"
            className="block min-h-11 px-[6cqw] py-[3cqw] text-center text-[3.4cqw] font-semibold tracking-[.08em] text-[#2b2f16] italic hover:bg-[#f1e5d3]"
          >
            Google Calendar
          </a>
          <button
            type="button"
            onClick={() => {
              downloadIcs();
              setOpen(false);
            }}
            className="block min-h-11 w-full border-t border-[#2b2f16]/10 px-[6cqw] py-[3cqw] text-center text-[3.4cqw] font-semibold tracking-[.08em] text-[#2b2f16] italic hover:bg-[#f1e5d3]"
          >
            Apple / Outlook (.ics)
          </button>
        </div>
      )}
    </div>
  );
}

function LocationLinks() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mx-auto mt-[6cqw] flex max-w-xs flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="inline-flex min-h-11 min-w-[37cqw] items-center justify-center gap-[2.5cqw] rounded-[3cqw] bg-[#6a0f1b] bg-cover bg-center px-[6cqw] py-[2.8cqw] text-[3.3cqw] font-medium uppercase tracking-[.22em] text-[#d8c8be] italic shadow-md transition hover:brightness-110"
        style={{ backgroundImage: `url(${ASSET("img/boton.webp")})` }}
      >
        <MapPin size={18} />
        Ver ubicación
        <ChevronDown size={15} className={open ? "rotate-180" : ""} />
      </button>
      {open && (
        <div className="mt-[2.5cqw] overflow-hidden rounded-[2.5cqw] bg-[#fbf4ea] shadow-[0_2cqw_5cqw_rgba(0,0,0,.12)]">
          <a
            href={EVENT.googleMaps}
            target="_blank"
            rel="noreferrer"
            className="block min-h-11 px-[6cqw] py-[3cqw] text-center text-[3.4cqw] font-semibold tracking-[.08em] text-[#2b2f16] italic hover:bg-[#f1e5d3]"
          >
            Google Maps
          </a>
          <a
            href={EVENT.waze}
            target="_blank"
            rel="noreferrer"
            className="block min-h-11 border-t border-[#2b2f16]/10 px-[6cqw] py-[3cqw] text-center text-[3.4cqw] font-semibold tracking-[.08em] text-[#2b2f16] italic hover:bg-[#f1e5d3]"
          >
            Waze
          </a>
        </div>
      )}
    </div>
  );
}

function GiftAccount({ account }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(account.number);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <article className="mt-4 rounded-[1.5rem] border border-[#2b2f16]/35 bg-white/35 px-5 py-6 text-left">
      <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#2b2f16]">
        {account.bank}
      </p>
      <dl className="mt-4 grid gap-2 text-sm text-[#4b4c35]">
        <div className="flex justify-between gap-4">
          <dt>Tipo</dt>
          <dd className="font-medium">{account.type}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Moneda</dt>
          <dd className="font-medium">{account.currency}</dd>
        </div>
        <div className="border-t border-[#2b2f16]/20 pt-3">
          <dt className="text-xs uppercase tracking-[.16em]">
            Número de cuenta
          </dt>
          <dd className="mt-1 font-serif text-2xl tracking-[.08em] text-[#2b2f16]">
            {account.number}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[.16em]">A nombre de</dt>
          <dd className="mt-1 font-medium">{account.holder}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={copy}
        className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-[#6a0f1b]/45 px-4 py-2 text-xs font-semibold uppercase tracking-[.13em] text-[#6a0f1b]"
      >
        <Copy size={14} />
        {copied ? "Copiado" : "Copiar número"}
      </button>
    </article>
  );
}

function GiftStores() {
  const stores = [
    {
      alt: "Mesa de regalos Siman",
      image: "img/siman.webp",
      href: "https://simangiftregistry.web.app/table/20008889",
      width: "w-[14cqw]",
    },
    {
      alt: "Mesa de regalos Max",
      image: "img/max.webp",
      href: "https://www.max.com.gt/bodas-max/bodas/W83ANBO0",
      width: "w-[15cqw]",
    },
    {
      alt: "Mesa de regalos Cemaco",
      image: "img/cemaco.webp",
      href: "https://www.cemaco.com/list/BodaRosalesSchwartz28112026",
      width: "w-[12cqw]",
    },
  ];

  return (
    <div className="mt-10 grid grid-cols-6 items-end gap-x-3 gap-y-9">
      {stores.map((store) => (
        <a
          key={store.alt}
          href={store.href}
          target="_blank"
          rel="noreferrer"
          className="group col-span-2 grid min-h-20 place-items-center rounded-lg transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6a0f1b]"
        >
          <img
            src={ASSET(store.image)}
            alt={store.alt}
            className={`${store.width} h-auto transition duration-300 group-hover:scale-105`}
          />
          <span className="mt-2 border-b border-[#2b2f16]/35 pb-0.5 text-[.57rem] uppercase tracking-[.16em] text-[#4b4c35] italic">
            Ver mesa
          </span>
        </a>
      ))}
      <div className="col-span-3 flex justify-center">
        <img
          src={ASSET("img/casa-casa.webp")}
          alt="Casa Casa"
          className="w-[32cqw] h-auto"
        />
      </div>
      <div className="col-span-3 flex justify-center">
        <img
          src={ASSET("img/casa-cocina.webp")}
          alt="Casa Cocina"
          className="w-[26cqw] h-auto"
        />
      </div>
      <p className="col-span-full -mt-3 px-3 text-center text-xs leading-6 text-[#4b4c35] italic">
        Casa Casa y Casa Cocina: registro abierto. Puedes comprar cualquier
        producto en tienda indicando que es para la boda{" "}
        <strong className="font-semibold text-[#2b2f16]">
          Rosales Schwartz
        </strong>
        .
      </p>
    </div>
  );
}

function WeddingMessage({ reservation }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(reservation.guestName);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => setName(reservation.guestName), [reservation.guestName]);

  const submit = async (event) => {
    event.preventDefault();
    setStatus("");
    if (!name.trim()) return setStatus("Por favor escribe tu nombre.");
    if (!message.trim())
      return setStatus("Escribe un mensaje para Mariana y Miguel.");

    setSaving(true);
    try {
      const response = await fetch("/api/registrarInvitado/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...MESSAGE_SHEET_CONFIG,
          values: [
            new Date().toLocaleString("es-GT", {
              timeZone: "America/Guatemala",
              dateStyle: "short",
              timeStyle: "short",
            }),
            reservation.id || "",
            reservation.guestName || "Invitado sin nombre",
            name.trim(),
            message.trim(),
          ],
        }),
      });
      if (!response.ok) throw new Error("No se pudo enviar");
      setMessage("");
      setStatus(
        "¡Gracias! Mariana y Miguel leerán tu mensaje con mucho cariño.",
      );
    } catch {
      setStatus("No pudimos enviar tu mensaje. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const sent = status.startsWith("¡Gracias!");
  return (
    <Section className={open ? "z-[100]" : ""}>
      <Branch />
      <h2 className="text-[4.6cqw] font-medium uppercase tracking-[.3em] italic">
        Mensaje a los novios
      </h2>
      <p className="mx-auto mt-6 max-w-sm text-[3cqw] leading-[1.75] tracking-[.24em] text-[#4b4c35] italic">
        Déjanos tus buenos deseos,
        <br />
        un consejo o unas palabras
        <br />
        para este nuevo capítulo.
      </p>
      <button
        type="button"
        onClick={() => {
          setStatus("");
          setOpen(true);
        }}
        className="mt-8 min-h-12 rounded-full bg-[#6a0f1b] px-8 py-3 font-serif text-base tracking-[.14em] text-[#f5eadb] italic shadow-md transition hover:scale-[1.02]"
      >
        Escribir mensaje
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/65 p-3 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="message-title"
        >
          <form
            onSubmit={submit}
            className="mm-rsvp-panel max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-[1.75rem] p-6 text-left shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar mensaje a los novios"
              className="float-right grid h-10 w-10 place-items-center rounded-full text-[#4b4c35] hover:bg-black/5"
            >
              <X size={20} />
            </button>
            <Eyebrow>Para Mariana y Miguel</Eyebrow>
            <h3
              id="message-title"
              className="mt-3 font-serif text-3xl italic text-[#2b2f16]"
            >
              Mensaje a los novios
            </h3>
            {sent ? (
              <div className="py-9 text-center">
                <Check className="mx-auto h-12 w-12 rounded-full bg-[#6a0f1b] p-3 text-[#f5eadb]" />
                <p className="mt-5 leading-7 text-[#4b4c35]">{status}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-7 rounded-full border border-[#6a0f1b]/50 px-6 py-3 text-sm uppercase tracking-[.14em] text-[#6a0f1b]"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <label className="mt-7 block">
                  <span className="text-xs uppercase tracking-[.16em] text-[#4b4c35]">
                    Tu nombre
                  </span>
                  <input
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#2b2f16]/20 bg-white/50 p-3 text-[#2b2f16] outline-none focus:border-[#6a0f1b]"
                  />
                </label>
                <label className="mt-5 block">
                  <span className="text-xs uppercase tracking-[.16em] text-[#4b4c35]">
                    Tu mensaje
                  </span>
                  <textarea
                    rows={5}
                    maxLength={1500}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Escribe aquí tus buenos deseos…"
                    className="mt-2 w-full resize-y rounded-xl border border-[#2b2f16]/20 bg-white/50 p-3 text-[#2b2f16] outline-none focus:border-[#6a0f1b]"
                  />
                </label>
                {status && (
                  <p role="alert" className="mt-4 text-sm text-[#6a0f1b]">
                    {status}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-7 min-h-12 w-full rounded-full bg-[#6a0f1b] px-6 py-3 font-serif text-base tracking-[.12em] text-[#f5eadb] italic disabled:cursor-wait disabled:opacity-60"
                >
                  {saving ? "Enviando…" : "Enviar mensaje"}
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </Section>
  );
}

function Gallery() {
  const [active, setActive] = useState(null);
  const move = (direction) =>
    setActive(
      (current) => (current + direction + GALLERY.length) % GALLERY.length,
    );
  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3">
        {GALLERY.map((source, index) => (
          <button
            key={source}
            type="button"
            onClick={() => setActive(index)}
            className={`overflow-hidden rounded-t-[7rem] rounded-b-lg border-4 border-[#fbf6ee] bg-[#fbf6ee] shadow-md ${index % 2 ? "translate-y-8" : ""}`}
          >
            <img
              src={source}
              alt="Mariana y Miguel"
              loading="lazy"
              className="aspect-[3/4] w-full object-cover transition duration-500 hover:scale-105"
            />
          </button>
        ))}
      </div>
      {active !== null && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-[#0a180e]/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Fotos de Mariana y Miguel"
          onClick={(event) =>
            event.target === event.currentTarget && setActive(null)
          }
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Cerrar galería"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/50 text-white"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Foto anterior"
            className="absolute left-3 grid h-11 w-11 place-items-center rounded-full border border-white/50 text-white"
          >
            <ChevronLeft size={22} />
          </button>
          <img
            src={GALLERY[active]}
            alt={`Foto ${active + 1} de Mariana y Miguel`}
            className="max-h-[84svh] max-w-[82vw] rounded-lg object-contain shadow-2xl"
          />
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Foto siguiente"
            className="absolute right-3 grid h-11 w-11 place-items-center rounded-full border border-white/50 text-white"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </>
  );
}

function Rsvp({ reservation }) {
  const attendeeTemplate = () =>
    Array.from({ length: reservation.seats }, (_, index) => ({
      name: index === 0 ? reservation.guestName : "",
      celebration: "",
    }));
  const [open, setOpen] = useState(false);
  const [attendees, setAttendees] = useState(attendeeTemplate);
  const [comment, setComment] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const updateAttendee = (index, field, value) =>
    setAttendees((current) =>
      current.map((attendee, attendeeIndex) =>
        attendeeIndex === index ? { ...attendee, [field]: value } : attendee,
      ),
    );
  const answered = attendees.filter(
    (attendee) => attendee.name.trim() || attendee.celebration,
  );
  const attending = attendees.filter((attendee) =>
    ["both", "mass", "reception"].includes(attendee.celebration),
  );
  const celebrationLabel = (value) =>
    CELEBRATION_OPTIONS.find(([key]) => key === value)?.[1] ?? "";

  const submit = async (event) => {
    event.preventDefault();
    setNotice("");
    if (!answered.length)
      return setNotice("Indica al menos una persona y su respuesta.");
    if (
      answered.some(
        (attendee) => !attendee.name.trim() || !attendee.celebration,
      )
    )
      return setNotice(
        "Cada persona indicada debe incluir su nombre y seleccionar una opción.",
      );
    if (!RSVP_SHEET_CONFIG.spreadsheetId)
      return setNotice(
        "La hoja de respuestas aún no está conectada. Podrás confirmar muy pronto.",
      );
    const details = answered
      .map(
        (attendee) =>
          `${attendee.name.trim()}: ${celebrationLabel(attendee.celebration)}`,
      )
      .join(" · ");
    setSaving(true);
    try {
      const response = await fetch("/api/registrarInvitado/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...RSVP_SHEET_CONFIG,
          values: [
            reservation.guestName || "Invitado sin nombre",
            String(reservation.seats),
            details,
            String(attending.length),
            String(
              attendees.filter((item) =>
                ["both", "mass"].includes(item.celebration),
              ).length,
            ),
            String(
              attendees.filter((item) =>
                ["both", "reception"].includes(item.celebration),
              ).length,
            ),
            comment.trim(),
            new Date().toLocaleString("es-GT", {
              timeZone: "America/Guatemala",
              dateStyle: "short",
              timeStyle: "short",
            }),
          ],
        }),
      });
      if (!response.ok) throw new Error("No se pudo guardar la respuesta");
      setSubmitted(true);
    } catch {
      setNotice(
        "No pudimos guardar tu respuesta. Inténtalo de nuevo en unos momentos.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section id="rsvp" className={open ? "z-[100]" : ""}>
      <img
        src={ASSET("img/sobre-icono.webp")}
        alt=""
        aria-hidden="true"
        className="mx-auto mb-8 w-20"
      />
      <h2 className="text-[7.6cqw] font-bold uppercase tracking-[.32em] italic text-[#2b2f16]">
        RSVP
      </h2>
      <p className="mx-auto mt-[7cqw] max-w-sm text-[3cqw] uppercase leading-[1.75] tracking-[.24em] text-[#4b4c35] italic">
        Nos encantará contar
        <br />
        contigo, por favor
        <br />
        confirma tu asistencia.
      </p>
      {reservation.guestName && (
        <p className="mt-6 text-sm italic text-[#4b4c35]">
          Invitación para{" "}
          <span className="font-semibold text-[#2b2f16]">
            {reservation.guestName}
          </span>{" "}
          ·{" "}
          {reservation.seats === 1 ? "1 lugar" : `${reservation.seats} lugares`}
        </p>
      )}
      <button
        type="button"
        onClick={() => {
          setNotice("");
          setSubmitted(false);
          setShowForm(false);
          setOpen(true);
        }}
        className="mt-[6cqw] min-h-11 min-w-[37cqw] rounded-[3cqw] bg-[#6a0f1b] bg-cover bg-center px-[6cqw] py-[2.8cqw] text-[3.3cqw] font-medium uppercase tracking-[.26em] text-[#d8c8be] italic shadow-md"
        style={{ backgroundImage: `url(${ASSET("img/boton.webp")})` }}
      >
        Confirmar asistencia
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/65 p-3 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={showForm ? "mariana-rsvp-title" : "mariana-rsvp-cover-title"}
        >
          {!showForm ? (
            <div className="relative aspect-[9/16] max-h-[92svh] w-full max-w-[430px] overflow-hidden rounded-[1.6rem] bg-[#10301d] shadow-2xl">
              <img
                src={ASSET("img/sobre.webp")}
                alt="Portada de la invitación de Mariana y Miguel"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar RSVP"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-[#d7e4d0]/70 bg-[#0a2b1b]/35 text-[#f4f0df] backdrop-blur-sm"
              >
                <X size={20} />
              </button>
              <div className="absolute inset-x-[8%] top-[72%] text-center text-[#e7efdf] [text-shadow:0_1px_1px_rgba(0,0,0,.72)]">
                <span className="block text-[.62rem] uppercase tracking-[.42em] opacity-85">
                  Para
                </span>
                <h3
                  id="mariana-rsvp-cover-title"
                  className="mt-2 font-serif text-[clamp(2rem,9vw,3.35rem)] leading-tight italic"
                >
                  {reservation.guestName || "nuestros invitados"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="absolute inset-x-[10%] bottom-[max(1.25rem,env(safe-area-inset-bottom))] min-h-12 rounded-full border border-[#e7efdf]/70 bg-[#10301d]/45 px-5 py-3 text-[.72rem] font-semibold uppercase tracking-[.24em] text-[#f4f0df] backdrop-blur-sm transition hover:bg-[#10301d]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4f0df]"
              >
                Continuar a confirmación
              </button>
            </div>
          ) : (
            <div className="mm-form-modal mm-rsvp-panel max-h-[92svh] w-full overflow-y-auto p-[26px] text-left shadow-2xl">
              {submitted ? (
              <div className="py-8 text-center">
                <Check className="mx-auto h-12 w-12 rounded-full bg-[#6a0f1b] p-3 text-[#f5eadb]" />
                <h3 className="mt-6 font-serif text-3xl italic text-[#2b2f16]">
                  ¡Gracias por confirmar!
                </h3>
                <p className="mx-auto mt-4 max-w-sm leading-7 text-[#4b4c35]">
                  Nos alegra celebrar este día junto a ustedes.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-6 rounded-xl border border-[#6a0f1b]/50 px-6 py-3 text-[15px] font-medium uppercase tracking-[.16em] text-[#6a0f1b] italic"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar formulario"
                  className="float-right grid h-10 w-10 place-items-center rounded-lg text-[#4b4c35] hover:bg-black/5"
                >
                  <X size={20} />
                </button>
                <Eyebrow>RSVP</Eyebrow>
                <h3
                  id="mariana-rsvp-title"
                  className="mt-1 pr-8 text-[1.2rem] font-semibold uppercase tracking-[.22em] text-[#2b2f16] italic"
                >
                  ¿Quiénes nos acompañarán?
                </h3>
                <p className="mt-3 text-[15px] leading-[1.55] text-[#4b4c35]">
                  Registra la respuesta individual de cada invitado. Puedes
                  dejar libres los lugares que no se utilizarán.
                </p>
                <div className="mt-5 space-y-4">
                  {attendees.map((attendee, index) => (
                    <fieldset
                      key={index}
                      className="rounded-[14px] border border-[#2b2f16]/20 bg-white/40 p-4"
                    >
                      <legend className="px-1 text-xs font-semibold uppercase tracking-[.18em] text-[#6a0f1b]">
                        Invitado {index + 1}
                      </legend>
                      <label className="block">
                        <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-[#4b4c35] italic">
                          Nombre
                        </span>
                        <input
                          type="text"
                          value={attendee.name}
                          onChange={(event) =>
                            updateAttendee(index, "name", event.target.value)
                          }
                          maxLength={120}
                          placeholder="Escribe su nombre"
                          className="mt-2 w-full border-b border-[#2b2f16]/30 bg-transparent px-0 py-2 text-[17px] font-medium text-[#2b2f16] outline-none focus:border-[#6a0f1b]"
                        />
                      </label>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {CELEBRATION_OPTIONS.map(([value, label]) => (
                          <label
                            key={value}
                            className={`cursor-pointer rounded-[10px] border px-3 py-3 text-[17px] leading-tight italic transition ${attendee.celebration === value ? "border-[#6a0f1b] bg-[#6a0f1b]/10 text-[#4a0812]" : "border-[#2b2f16]/20 text-[#4b4c35]"}`}
                          >
                            <input
                              type="radio"
                              name={`attendee-${index}`}
                              value={value}
                              checked={attendee.celebration === value}
                              onChange={(event) =>
                                updateAttendee(
                                  index,
                                  "celebration",
                                  event.target.value,
                                )
                              }
                              className="sr-only"
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
                <label className="mt-6 block">
                  <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-[#4b4c35] italic">
                    Comentario <em className="normal-case">(opcional)</em>
                  </span>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Alergias, restricciones alimentarias o un mensaje"
                    className="mt-2 w-full resize-y rounded-[10px] border border-[#2b2f16]/20 bg-white/50 p-3 text-[17px] text-[#2b2f16] outline-none focus:border-[#6a0f1b]"
                  />
                </label>
                {notice && (
                  <p
                    role="alert"
                    className="mt-5 text-center text-sm leading-6 text-[#6a0f1b]"
                  >
                    {notice}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 min-h-11 w-full rounded-xl bg-[#6a0f1b] px-6 py-3 text-[15px] font-medium uppercase tracking-[.2em] text-[#f5eadb] italic disabled:cursor-wait disabled:opacity-60"
                >
                  {saving ? "Enviando…" : "Enviar confirmación"}
                </button>
              </form>
              )}
            </div>
          )}
        </div>
      )}
    </Section>
  );
}

export default function InvitacionMarianaMiguel() {
  const searchParams = useSearchParams();
  const reservation = useMemo(
    () => getReservation(searchParams),
    [searchParams],
  );
  const countdown = useCountdown(EVENT.startsAt);
  const audioRef = useRef(null);
  const [opened, setOpened] = useState(searchParams.get("abierto") === "1");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    document.title = reservation.guestName
      ? `${reservation.guestName} · Mariana & Miguel`
      : "Mariana & Miguel";
  }, [reservation.guestName]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [opened]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };
  const openInvitation = () => {
    setOpened(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    audioRef.current?.play().catch(() => {});
  };

  return (
    <main className="min-h-screen bg-[#0c2416] font-serif text-[#2b2f16]">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .mm-paper {
          container-type: inline-size;
          background-color: #f5eadb;
          background-image:
            linear-gradient(
              rgba(245, 234, 219, 0.9),
              rgba(245, 234, 219, 0.94)
            ),
            url("${ASSET("img/papel.webp")}");
          background-size: 100% auto;
        }
        .mm-invitation,
        .mm-invitation button,
        .mm-invitation input,
        .mm-invitation textarea {
          font-family:
            var(--font-mariana-serif), "Cormorant Garamond", Garamond,
            "Times New Roman", serif;
        }
        .mm-paper > div {
          isolation: isolate;
        }
        .mm-paper > div > img {
          z-index: -1;
        }
        .mm-rsvp-panel {
          background-color: #f5eadb;
        }
        .mm-form-modal {
          max-width: 440px;
          border-radius: 18px;
          background-image: url("${ASSET("img/papel.webp")}");
          background-position: center;
          background-size: cover;
        }
        .mm-paper footer::after {
          content: "Design by woowbegt.com";
          display: block;
          margin-top: 0.85rem;
          font-family: ui-sans-serif, system-ui, sans-serif;
          font-size: 0.52rem;
          font-style: normal;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6a0f1b;
        }
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
      <audio
        ref={audioRef}
        src={ASSET("audio/cancion.mp3")}
        loop
        preload="metadata"
      />
      <Envelope
        reservation={reservation}
        open={opened}
        onOpen={openInvitation}
      />
      <div className="mm-invitation mm-paper mx-auto w-[min(100vw,480px)] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,.45)]">
        <header className="relative">
          <img
            src={ASSET("img/portada.webp")}
            alt="Mariana y Miguel"
            className="aspect-[9/16] w-full object-cover"
          />
        </header>
        <div className="relative overflow-hidden">
          <img
            src={ASSET("img/flores-arriba.webp")}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 w-full opacity-80"
          />
          <Section className="pt-28">
            <Branch />
            <p className="text-[3.9cqw] leading-[1.85] tracking-[.24em] uppercase italic">
              Hay historias
              <br />
              que desde el inicio
              <br />
              parecen destinadas
              <br />a ser siempre.
            </p>
            <p className="mt-[11cqw] text-[3.9cqw] leading-[1.85] tracking-[.24em] uppercase italic">
              Queremos compartir
              <br />
              contigo uno de los capítulos
              <br />
              más especiales
              <br />
              de la nuestra.
            </p>
          </Section>
          {reservation.guestName && (
            <Section className="pt-2">
              <Eyebrow>Esta invitación es para</Eyebrow>
              <p className="mt-[1cqw] text-[8.8cqw] leading-[1.3] text-[#2b2f16]">
                {reservation.guestName}
              </p>
              <div className="mx-auto mt-[2cqw] min-w-[64cqw] border-y border-[#2b2f16]/25 px-[6cqw] py-[3cqw] text-[2.9cqw] uppercase tracking-[.22em] text-[#4b4c35]">
                Hemos reservado{" "}
                <strong className="block pt-[.6cqw] text-[5cqw] font-bold tracking-[.16em] text-[#2b2f16]">
                  {reservation.seats === 1
                    ? "1 lugar"
                    : `${reservation.seats} lugares`}
                </strong>{" "}
                en tu honor
              </div>
            </Section>
          )}
          <Section>
            <p className="text-[3.4cqw] uppercase tracking-[.24em] italic">
              Te invitamos
              <br />a nuestra boda
            </p>
            <p className="mt-[4cqw] text-[3.4cqw] font-bold uppercase tracking-[.24em] italic">
              Noviembre 28, 2026
            </p>
            <Branch flipped className="mt-10" />
            <h1 className="text-[5cqw] font-bold uppercase tracking-[.32em] italic">
              ¡ Nos casamos !
            </h1>
            <img
              src={ASSET("img/novios-arcos.webp")}
              alt="Mariana y Miguel"
              className="mx-auto mt-8 w-[82%]"
            />
            <img
              src={ASSET("img/nombres.webp")}
              alt="Miguel Rosales Cordón y Mariana Schwartz Chávez"
              className="relative mx-auto -mt-[29%] w-[82%]"
            />
          </Section>
          <Section>
            <Branch />
            <p className="mt-[10cqw] text-[3.4cqw] font-bold uppercase leading-[1.75] tracking-[.24em] italic">
              Nuestros padres
              <br />
              nos acompañan
              <br />
              en este día tan especial
            </p>
            <img
              src={ASSET("img/papas.webp")}
              alt=""
              aria-hidden="true"
              className="mx-auto mt-[2cqw] mb-[4cqw] w-[15cqw]"
            />
            <p className="text-[3.1cqw] leading-[1.75] tracking-[.24em] text-[#4b4c35] italic">
              Padres del novio
            </p>
            <p className="mt-[4cqw] text-[3cqw] font-bold leading-[1.75] tracking-[.24em] italic">
              Eduardo Rosales Arenales
              <br />
              María Celia Cordón Chang
            </p>
            <img
              src={ASSET("img/papas.webp")}
              alt=""
              aria-hidden="true"
              className="mx-auto mt-[6cqw] mb-[4cqw] w-[13cqw]"
            />
            <p className="text-[3.1cqw] leading-[1.75] tracking-[.24em] text-[#4b4c35] italic">
              Padres de la novia
            </p>
            <p className="mt-[4cqw] text-[3cqw] font-bold leading-[1.75] tracking-[.24em] italic">
              Lisseth María Chávez Escandón
              <br />
              Otto Mauricio Schwartz Izquierdo
            </p>
          </Section>
          <Section>
            <Branch flipped />
            <h2 className="mt-[10cqw] text-[3.4cqw] font-bold uppercase leading-[1.75] tracking-[.24em] italic">
              Cuenta regresiva
              <br />
              para nuestro gran día
            </h2>
            <div className="mt-[2cqw] mb-[4cqw] flex items-start justify-center gap-[1.2cqw] tabular-nums">
              {[
                ["Días", countdown.days],
                ["Horas", countdown.hours],
                ["Min", countdown.minutes],
                ["Seg.", countdown.seconds],
              ].map(([label, value], index) => (
                <div key={label} className="flex items-start gap-[1.2cqw]">
                  <div className="flex min-w-[15cqw] flex-col items-center">
                    <p className="text-[8.3cqw] leading-none font-bold tracking-[.12em]">
                      {value}
                    </p>
                    <p className="mt-[2cqw] text-[2.4cqw] font-bold uppercase tracking-[.18em] text-[#4b4c35]">
                      {label}
                    </p>
                  </div>
                  {index < 3 && (
                    <span className="text-[7.2cqw] leading-[.95] font-bold">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
            <img
              src={ASSET("img/calendario.webp")}
              alt="Calendario"
              className="mx-auto mt-[6cqw] mb-[3cqw] w-[17cqw]"
            />
            <CalendarLinks />
          </Section>
          <Section>
            <p className="text-[3.9cqw] uppercase leading-[1.85] tracking-[.24em] italic">
              Esperamos compartir
              <br />
              contigo este día tan especial
            </p>
            <Branch />
            <h2 className="text-[4.6cqw] font-medium uppercase tracking-[.3em] italic">
              Ceremonia y recepción
            </h2>
            <img
              src={ASSET("img/iglesia.webp")}
              alt="Ilustración de Granja Santa Isabel"
              className="-mx-[8cqw] mb-[8cqw] mt-7 w-[116cqw] max-w-none"
            />
            <p className="text-[3.9cqw] uppercase leading-[1.85] tracking-[.24em] italic">
              Granja Santa Isabel
              <br />
              Santa Catarina Pinula
            </p>
            <p className="-mx-[4cqw] mt-5 text-[2.75cqw] leading-[1.75] tracking-[.17em] text-[#4b4c35] italic">
              Km 16.5 Carretera a El Salvador,
              <br />
              Res. San Antonio 3ra Ave. 0-55
              <br />
              (dentro de Residenciales San Antonio)
            </p>
            <LocationLinks />
          </Section>
          <Section>
            <h2 className="text-[7.6cqw] font-medium uppercase tracking-[.32em] italic">
              Itinerario
            </h2>
            <img
              src={ASSET("img/itinerario.webp")}
              alt="Itinerario: ceremonia 15:00, cóctel 16:00, recepción 17:00 y fin 00:00"
              className="mx-auto mt-8 w-[86%]"
            />
          </Section>
          <img
            src={ASSET("img/flores-arriba.webp")}
            alt=""
            aria-hidden="true"
            className="pointer-events-none relative -mb-[95cqw] w-full opacity-80 [mask-image:linear-gradient(to_bottom,transparent,black_28%,black_72%,transparent)]"
          />
          <Section>
            <h2 className="text-[6.6cqw] font-bold uppercase tracking-[.3em] italic">
              Dress code
            </h2>
            <p className="mb-[8cqw] text-[4.1cqw] uppercase tracking-[.26em] italic">
              Formal · Elegante
            </p>
            <img
              src={ASSET("img/dresscode.webp")}
              alt="Código de vestimenta"
              className="mx-auto mt-8 w-[62%]"
            />
            <p className="text-[3.9cqw] uppercase leading-[1.85] tracking-[.24em] italic">
              Paleta de colores sugerida
            </p>
            <Branch flipped className="mt-9" />
          </Section>
          <Section>
            <img
              src={ASSET("img/brindis.webp")}
              alt=""
              aria-hidden="true"
              className="mx-auto mb-8 w-16"
            />
            <p className="text-[3.9cqw] font-bold uppercase leading-[1.85] tracking-[.24em] italic">
              Amamos a los niños,
              <br />
              pero nuestra boda
              <br />
              será solo para adultos.
            </p>
          </Section>
          <Section>
            <img
              src={ASSET("img/regalo.webp")}
              alt=""
              aria-hidden="true"
              className="mx-auto mb-8 w-16"
            />
            <p className="text-[2.65cqw] uppercase leading-[1.9] tracking-[.24em] italic">
              Tu presencia es nuestro
              <br />
              mejor regalo, pero
              <br />
              si deseas hacernos
              <br />
              un obsequio, puedes
              <br />
              hacerlo en cualquiera
              <br />
              de las siguientes tiendas.
            </p>
            <GiftStores />
            <img
              src={ASSET("img/sobre-icono.webp")}
              alt=""
              aria-hidden="true"
              className="mx-auto mt-14 mb-7 w-20"
            />
            <p className="text-lg font-semibold uppercase leading-[1.75] tracking-[.15em] italic">
              Si deseas hacernos un regalo en efectivo, puedes hacerlo a las
              siguientes cuentas.
            </p>
            <div className="mx-auto mt-7 max-w-sm">
              <GiftAccount
                account={{
                  bank: "Interbanco",
                  type: "Ahorros",
                  number: "7200108014",
                  currency: "USD",
                  holder: "Rosales Cordón Miguel",
                }}
              />
              <GiftAccount
                account={{
                  bank: "Interbanco",
                  type: "Ahorros",
                  number: "7100569419",
                  currency: "Quetzales",
                  holder: "Rosales Cordón Miguel",
                }}
              />
            </div>
          </Section>
          <Rsvp reservation={reservation} />
          <WeddingMessage reservation={reservation} />
          <Section>
            <Eyebrow>Momentos</Eyebrow>
            <h2 className="mt-4 text-[4.6cqw] font-medium uppercase tracking-[.3em] italic">
              Photos
            </h2>
            <Gallery />
          </Section>
          <footer className="relative z-10 px-6 pb-28 pt-12 text-center text-xs uppercase tracking-[.25em] text-[#4b4c35] italic">
            <p>Mariana &amp; Miguel</p>
            <p className="mt-3">28 · 11 · 2026</p>
          </footer>
          <img
            src={ASSET("img/flores-abajo.webp")}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-80"
          />
        </div>
      </div>
      {opened && <MusicButton playing={playing} onToggle={toggleMusic} />}
    </main>
  );
}
