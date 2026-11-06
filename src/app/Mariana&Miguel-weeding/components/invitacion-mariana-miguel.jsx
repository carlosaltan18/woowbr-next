'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Copy, MapPin, Music2, Pause, X } from 'lucide-react';

const ASSET = (path) => `/mariana-miguel/${path}`;

const EVENT = {
    startsAt: '2026-11-28T15:00:00-06:00',
    endsAt: '2026-11-29T00:00:00-06:00',
    location: 'Granja Santa Isabel, Santa Catarina Pinula',
    address: 'Km 16.5 Carretera a El Salvador, Res. San Antonio 3ra Ave. 0-55 (dentro de Residenciales San Antonio)',
    googleMaps: 'https://maps.app.goo.gl/URyvEkNHh245Szs8A',
    waze: 'https://waze.com/ul/h9fxdtx13d',
};

const RSVP_SHEET_CONFIG = {
    spreadsheetId: '116YqFxtiOD3MGQNTyXfbYCuleFJrW6Y9XNdSyDW4yXc',
    range: 'Hoja 1!A:H',
    headers: ['Invitación', 'Pases reservados', 'Asistentes y celebración', 'Total confirmados', 'Misa', 'Recepción', 'Comentario', 'Fecha de registro'],
};

const GALLERY = Array.from({ length: 8 }, (_, index) => ASSET(`img/fotos/foto-${String(index + 1).padStart(2, '0')}.webp`));
const CELEBRATION_OPTIONS = [
    ['both', 'Misa y recepción'],
    ['mass', 'Solo misa'],
    ['reception', 'Solo recepción'],
    ['no', 'No asistiré'],
];

function getReservation(searchParams) {
    const first = (...keys) => keys.map((key) => searchParams.get(key)?.trim()).find(Boolean) ?? '';
    const requestedSeats = Number.parseInt(first('pases', 'adultos', 'invitados', 'cantidad') || '1', 10);
    const seats = Number.isFinite(requestedSeats) ? Math.min(Math.max(requestedSeats, 1), 12) : 1;
    return { guestName: first('nombre', 'invitado', 'n', 'familia'), seats, id: first('id', 'codigo') };
}

function useCountdown(date) {
    const getTime = () => {
        const remaining = Math.max(0, Math.floor((new Date(date).getTime() - Date.now()) / 1000));
        return {
            days: String(Math.floor(remaining / 86400)).padStart(2, '0'),
            hours: String(Math.floor((remaining % 86400) / 3600)).padStart(2, '0'),
            minutes: String(Math.floor((remaining % 3600) / 60)).padStart(2, '0'),
            seconds: String(remaining % 60).padStart(2, '0'),
        };
    };
    const [time, setTime] = useState(getTime);
    useEffect(() => {
        const timer = window.setInterval(() => setTime(getTime()), 1000);
        return () => window.clearInterval(timer);
    }, [date]);
    return time;
}

function Section({ children, className = '', id }) {
    return <><section id={id} className={`relative px-6 py-12 text-center sm:px-10 sm:py-16 ${className}`}>{children}</section><style jsx global>{`
        .mm-paper > div { isolation: isolate; }
        .mm-paper > div > img { z-index: -1; }
        .mm-rsvp-panel { background-color: #f5eadb; }
        .mm-paper .font-semibold { font-weight: 400; }
        .mm-paper .text-base { font-size: .92rem; }
        .mm-paper .text-lg { font-size: .98rem; }
        .mm-paper .text-xl { font-size: 1rem; }
        .mm-paper .text-2xl { font-size: 1.3rem; }
        .mm-paper .text-3xl { font-size: 1.5rem; }
        .mm-paper .text-4xl { font-size: 1.7rem; }
        .mm-paper footer::after { content: 'Design by woowbegt.com'; display: block; margin-top: .85rem; font-family: ui-sans-serif, system-ui, sans-serif; font-size: .52rem; font-style: normal; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; color: #6a0f1b; }
        @media (min-width: 640px) {
          .mm-paper .text-base { font-size: .96rem; }
          .mm-paper .text-lg { font-size: 1.04rem; }
          .mm-paper .text-xl { font-size: 1.06rem; }
          .mm-paper .text-2xl { font-size: 1.36rem; }
          .mm-paper .text-3xl { font-size: 1.6rem; }
          .mm-paper .text-4xl { font-size: 1.8rem; }
        }
      `}</style></>;
}

function Eyebrow({ children }) {
    return <p className="text-[.62rem] font-semibold uppercase tracking-[.3em] text-[#4b4c35]">{children}</p>;
}

function Branch({ flipped = false, className = '' }) {
    return <img src={ASSET('img/ramita.webp')} alt="" aria-hidden="true" className={`mx-auto mb-8 w-9 ${flipped ? '-scale-x-100 rotate-[-12deg]' : ''} ${className}`} />;
}

function Envelope({ reservation, open, onOpen }) {
    return <div className={`fixed inset-0 z-[70] grid place-items-center overflow-hidden bg-[#10301d] transition duration-[1400ms] ${open ? 'pointer-events-none invisible opacity-0' : 'opacity-100'}`} style={{ transitionDelay: open ? '400ms' : '0ms' }} aria-hidden={open || undefined}>
        <button type="button" onClick={onOpen} aria-label="Abrir invitación de Mariana y Miguel" className="relative h-full w-full max-w-[540px] overflow-hidden text-[#cfe0c6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-5px] focus-visible:outline-[#cfe0c6]">
            <img src={ASSET('img/sobre.webp')} alt="Sobre de la invitación de Mariana y Miguel" className={`h-full w-full object-cover transition duration-[1400ms] ease-[cubic-bezier(.7,0,.3,1)] ${open ? 'scale-125' : ''}`} />
            <span aria-hidden="true" className="absolute left-1/2 top-[57.2%] aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse" />
            {reservation.guestName && <div className="absolute inset-x-[8%] top-[72%] text-center [text-shadow:0_1px_0_rgba(0,0,0,.55)]"><span className="block text-xs uppercase tracking-[.4em] opacity-80">Para</span><span className="mt-1 block font-serif text-4xl italic leading-tight sm:text-5xl">{reservation.guestName}</span></div>}
            <span className="absolute inset-x-0 bottom-[max(5vh,env(safe-area-inset-bottom))] text-center text-[.65rem] font-medium uppercase tracking-[.3em]">Toca el sello para abrir</span>
        </button>
    </div>;
}

function MusicButton({ playing, onToggle }) {
    return <button type="button" onClick={onToggle} aria-label={playing ? 'Pausar música' : 'Reproducir música'} className="fixed bottom-5 right-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-[#f5eadb]/60 bg-[#10301d]/85 text-[#f5eadb] shadow-lg backdrop-blur transition hover:scale-105">{playing ? <Pause size={17} fill="currentColor" /> : <Music2 size={18} />}</button>;
}

function CalendarLinks() {
    const googleCalendarUrl = useMemo(() => {
        const stamp = (value) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Boda Mariana & Miguel')}&dates=${stamp(EVENT.startsAt)}/${stamp(EVENT.endsAt)}&location=${encodeURIComponent(`${EVENT.location} — ${EVENT.address}`)}&details=${encodeURIComponent('¡Te esperamos!')}`;
    }, []);
    const downloadIcs = () => {
        const stamp = (value) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Woowbe//Mariana y Miguel//ES', 'BEGIN:VEVENT', `UID:boda-mariana-miguel-20261128@woowbe`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(EVENT.startsAt)}`, `DTEND:${stamp(EVENT.endsAt)}`, 'SUMMARY:Boda Mariana & Miguel', `LOCATION:${EVENT.location}`, 'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Boda Mariana & Miguel', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
        link.download = 'boda-mariana-y-miguel.ics';
        link.click();
        URL.revokeObjectURL(link.href);
    };
    return <div className="mx-auto mt-8 grid max-w-xs gap-3"><a href={googleCalendarUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#6a0f1b] px-5 py-3 text-sm font-medium tracking-[.13em] text-[#f5eadb] italic shadow-md"><CalendarDays size={16} />Google Calendar</a><button type="button" onClick={downloadIcs} className="min-h-11 rounded-full border border-[#6a0f1b]/45 px-5 py-3 text-sm font-medium tracking-[.13em] text-[#4b4c35] italic">Apple / Outlook</button></div>;
}

function GiftAccount({ account }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try { await navigator.clipboard.writeText(account.number); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
    };
    return <article className="mt-4 rounded-[1.5rem] border border-[#2b2f16]/35 bg-white/35 px-5 py-6 text-left"><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#2b2f16]">{account.bank}</p><dl className="mt-4 grid gap-2 text-sm text-[#4b4c35]"><div className="flex justify-between gap-4"><dt>Tipo</dt><dd className="font-medium">{account.type}</dd></div><div className="flex justify-between gap-4"><dt>Moneda</dt><dd className="font-medium">{account.currency}</dd></div><div className="border-t border-[#2b2f16]/20 pt-3"><dt className="text-xs uppercase tracking-[.16em]">Número de cuenta</dt><dd className="mt-1 font-serif text-2xl tracking-[.08em] text-[#2b2f16]">{account.number}</dd></div><div><dt className="text-xs uppercase tracking-[.16em]">A nombre de</dt><dd className="mt-1 font-medium">{account.holder}</dd></div></dl><button type="button" onClick={copy} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-[#6a0f1b]/45 px-4 py-2 text-xs font-semibold uppercase tracking-[.13em] text-[#6a0f1b]"><Copy size={14} />{copied ? 'Copiado' : 'Copiar número'}</button></article>;
}

function Gallery() {
    const [active, setActive] = useState(null);
    const move = (direction) => setActive((current) => (current + direction + GALLERY.length) % GALLERY.length);
    return <><div className="mt-8 grid grid-cols-2 gap-3">{GALLERY.map((source, index) => <button key={source} type="button" onClick={() => setActive(index)} className={`overflow-hidden rounded-t-[7rem] rounded-b-lg border-4 border-[#fbf6ee] bg-[#fbf6ee] shadow-md ${index % 2 ? 'translate-y-8' : ''}`}><img src={source} alt="Mariana y Miguel" loading="lazy" className="aspect-[3/4] w-full object-cover transition duration-500 hover:scale-105" /></button>)}</div>{active !== null && <div className="fixed inset-0 z-[80] grid place-items-center bg-[#0a180e]/95 p-4" role="dialog" aria-modal="true" aria-label="Fotos de Mariana y Miguel" onClick={(event) => event.target === event.currentTarget && setActive(null)}><button type="button" onClick={() => setActive(null)} aria-label="Cerrar galería" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/50 text-white"><X size={20} /></button><button type="button" onClick={() => move(-1)} aria-label="Foto anterior" className="absolute left-3 grid h-11 w-11 place-items-center rounded-full border border-white/50 text-white"><ChevronLeft size={22} /></button><img src={GALLERY[active]} alt={`Foto ${active + 1} de Mariana y Miguel`} className="max-h-[84svh] max-w-[82vw] rounded-lg object-contain shadow-2xl" /><button type="button" onClick={() => move(1)} aria-label="Foto siguiente" className="absolute right-3 grid h-11 w-11 place-items-center rounded-full border border-white/50 text-white"><ChevronRight size={22} /></button></div>}</>;
}

function Rsvp({ reservation }) {
    const attendeeTemplate = () => Array.from({ length: reservation.seats }, (_, index) => ({ name: index === 0 ? reservation.guestName : '', celebration: '' }));
    const [open, setOpen] = useState(false);
    const [attendees, setAttendees] = useState(attendeeTemplate);
    const [comment, setComment] = useState('');
    const [notice, setNotice] = useState('');
    const [saving, setSaving] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const updateAttendee = (index, field, value) => setAttendees((current) => current.map((attendee, attendeeIndex) => attendeeIndex === index ? { ...attendee, [field]: value } : attendee));
    const answered = attendees.filter((attendee) => attendee.name.trim() || attendee.celebration);
    const attending = attendees.filter((attendee) => ['both', 'mass', 'reception'].includes(attendee.celebration));
    const celebrationLabel = (value) => CELEBRATION_OPTIONS.find(([key]) => key === value)?.[1] ?? '';

    const submit = async (event) => {
        event.preventDefault();
        setNotice('');
        if (!answered.length) return setNotice('Indica al menos una persona y su respuesta.');
        if (answered.some((attendee) => !attendee.name.trim() || !attendee.celebration)) return setNotice('Cada persona indicada debe incluir su nombre y seleccionar una opción.');
        if (!RSVP_SHEET_CONFIG.spreadsheetId) return setNotice('La hoja de respuestas aún no está conectada. Podrás confirmar muy pronto.');
        const details = answered.map((attendee) => `${attendee.name.trim()}: ${celebrationLabel(attendee.celebration)}`).join(' · ');
        setSaving(true);
        try {
            const response = await fetch('/api/registrarInvitado/registrar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...RSVP_SHEET_CONFIG, values: [reservation.guestName || 'Invitado sin nombre', String(reservation.seats), details, String(attending.length), String(attendees.filter((item) => ['both', 'mass'].includes(item.celebration)).length), String(attendees.filter((item) => ['both', 'reception'].includes(item.celebration)).length), comment.trim(), new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala', dateStyle: 'short', timeStyle: 'short' })] }) });
            if (!response.ok) throw new Error('No se pudo guardar la respuesta');
            setSubmitted(true);
        } catch { setNotice('No pudimos guardar tu respuesta. Inténtalo de nuevo en unos momentos.'); } finally { setSaving(false); }
    };

    return <Section id="rsvp"><img src={ASSET('img/sobre-icono.webp')} alt="" aria-hidden="true" className="mx-auto mb-8 w-20" /><Eyebrow>RSVP</Eyebrow><h2 className="mt-4 font-serif text-4xl italic text-[#2b2f16]">Confirma tu asistencia</h2><p className="mx-auto mt-5 max-w-sm text-base leading-7 text-[#4b4c35]">Cada persona puede confirmar si asistirá a la misa, a la recepción o a ambas celebraciones.</p>{reservation.guestName && <p className="mt-6 text-sm italic text-[#4b4c35]">Invitación para <span className="font-semibold text-[#2b2f16]">{reservation.guestName}</span> · {reservation.seats === 1 ? '1 lugar' : `${reservation.seats} lugares`}</p>}<button type="button" onClick={() => { setNotice(''); setSubmitted(false); setOpen(true); }} className="mt-8 min-h-12 rounded-full bg-[#6a0f1b] px-8 py-3 font-serif text-base font-medium tracking-[.12em] text-[#f5eadb] italic shadow-md">Confirmar asistencia</button>{open && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/65 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="mariana-rsvp-title"><div className="mm-rsvp-panel max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-[1.75rem] p-6 text-left shadow-2xl sm:p-8">{submitted ? <div className="py-8 text-center"><Check className="mx-auto h-12 w-12 rounded-full bg-[#6a0f1b] p-3 text-[#f5eadb]" /><h3 className="mt-6 font-serif text-3xl italic text-[#2b2f16]">¡Gracias por confirmar!</h3><p className="mx-auto mt-4 max-w-sm leading-7 text-[#4b4c35]">Nos alegra celebrar este día junto a ustedes.</p><button type="button" onClick={() => setOpen(false)} className="mt-8 rounded-full border border-[#6a0f1b]/50 px-6 py-3 text-sm font-semibold uppercase tracking-[.14em] text-[#6a0f1b]">Cerrar</button></div> : <form onSubmit={submit}><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar formulario" className="float-right grid h-10 w-10 place-items-center rounded-full text-[#4b4c35] hover:bg-black/5"><X size={20} /></button><Eyebrow>RSVP</Eyebrow><h3 id="mariana-rsvp-title" className="mt-3 font-serif text-3xl italic text-[#2b2f16]">¿Quiénes nos acompañarán?</h3><p className="mt-3 text-sm leading-6 text-[#4b4c35]">Registra la respuesta individual de cada invitado. Puedes dejar libres los lugares que no se utilizarán.</p><div className="mt-7 space-y-5">{attendees.map((attendee, index) => <fieldset key={index} className="rounded-2xl border border-[#2b2f16]/20 bg-white/40 p-4"><legend className="px-1 text-xs font-semibold uppercase tracking-[.18em] text-[#6a0f1b]">Invitado {index + 1}</legend><label className="block"><span className="text-xs font-semibold uppercase tracking-[.15em] text-[#4b4c35]">Nombre</span><input type="text" value={attendee.name} onChange={(event) => updateAttendee(index, 'name', event.target.value)} maxLength={120} placeholder="Escribe su nombre" className="mt-2 w-full border-b border-[#2b2f16]/30 bg-transparent px-0 py-2 font-serif text-lg text-[#2b2f16] outline-none focus:border-[#6a0f1b]" /></label><div className="mt-4 grid gap-2 sm:grid-cols-2">{CELEBRATION_OPTIONS.map(([value, label]) => <label key={value} className={`cursor-pointer rounded-xl border px-3 py-3 text-sm leading-tight transition ${attendee.celebration === value ? 'border-[#6a0f1b] bg-[#6a0f1b]/10 text-[#4a0812]' : 'border-[#2b2f16]/20 text-[#4b4c35]'}`}><input type="radio" name={`attendee-${index}`} value={value} checked={attendee.celebration === value} onChange={(event) => updateAttendee(index, 'celebration', event.target.value)} className="sr-only" />{label}</label>)}</div></fieldset>)}</div><label className="mt-6 block"><span className="text-xs font-semibold uppercase tracking-[.15em] text-[#4b4c35]">Comentario <em className="normal-case">(opcional)</em></span><textarea rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Alergias, restricciones alimentarias o un mensaje" className="mt-2 w-full rounded-xl border border-[#2b2f16]/20 bg-white/50 p-3 text-sm text-[#2b2f16] outline-none focus:border-[#6a0f1b]" /></label>{notice && <p role="alert" className="mt-5 text-center text-sm leading-6 text-[#6a0f1b]">{notice}</p>}<button type="submit" disabled={saving} className="mt-7 min-h-12 w-full rounded-full bg-[#6a0f1b] px-6 py-3 font-serif text-base font-medium tracking-[.12em] text-[#f5eadb] italic disabled:cursor-wait disabled:opacity-60">{saving ? 'Enviando…' : 'Enviar confirmación'}</button></form>}</div></div>}</Section>;
}

export default function InvitacionMarianaMiguel() {
    const searchParams = useSearchParams();
    const reservation = useMemo(() => getReservation(searchParams), [searchParams]);
    const countdown = useCountdown(EVENT.startsAt);
    const audioRef = useRef(null);
    const [opened, setOpened] = useState(searchParams.get('abierto') === '1');
    const [playing, setPlaying] = useState(false);
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return undefined;
        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        return () => { audio.removeEventListener('play', onPlay); audio.removeEventListener('pause', onPause); };
    }, []);
    const toggleMusic = () => { const audio = audioRef.current; if (!audio) return; if (audio.paused) audio.play().catch(() => {}); else audio.pause(); };
    const openInvitation = () => { setOpened(true); window.scrollTo({ top: 0, behavior: 'instant' }); audioRef.current?.play().catch(() => {}); };

    return <main className="min-h-screen bg-[#0c2416] font-serif text-[#2b2f16]"><style jsx global>{`html { scroll-behavior: smooth; } .mm-paper { background-color: #f5eadb; background-image: linear-gradient(rgba(245,234,219,.9),rgba(245,234,219,.94)), url('${ASSET('img/papel.webp')}'); background-size: 100% auto; } @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; } }`}</style><audio ref={audioRef} src={ASSET('audio/cancion.mp3')} loop preload="metadata" /><Envelope reservation={reservation} open={opened} onOpen={openInvitation} /><div className="mm-paper mx-auto max-w-[500px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,.45)]"><header className="relative"><img src={ASSET('img/portada.webp')} alt="Mariana y Miguel" className="aspect-[9/16] w-full object-cover" /></header><div className="relative overflow-hidden"><img src={ASSET('img/flores-arriba.webp')} alt="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 w-full opacity-80" /><Section className="pt-28"><Branch /><p className="text-xl leading-[1.8] tracking-[.16em] uppercase italic">Hay historias<br />que desde el inicio<br />parecen destinadas<br />a ser siempre.</p><p className="mt-12 text-xl leading-[1.8] tracking-[.16em] uppercase italic">Queremos compartir<br />contigo uno de los capítulos<br />más especiales<br />de la nuestra.</p></Section>{reservation.guestName && <Section className="pt-2"><Eyebrow>Esta invitación es para</Eyebrow><p className="mt-3 font-serif text-4xl italic text-[#2b2f16]">{reservation.guestName}</p><div className="mx-auto mt-5 max-w-xs border-y border-[#2b2f16]/25 py-4 text-sm uppercase tracking-[.17em] text-[#4b4c35]">Hemos reservado <strong className="block pt-1 text-2xl text-[#2b2f16]">{reservation.seats === 1 ? '1 lugar' : `${reservation.seats} lugares`}</strong> en tu honor</div></Section>}<Section><p className="text-lg uppercase tracking-[.18em] italic">Te invitamos a nuestra boda</p><p className="mt-4 font-semibold uppercase tracking-[.23em]">28 de noviembre de 2026</p><Branch flipped className="mt-10" /><h1 className="text-3xl font-semibold uppercase tracking-[.22em] italic">¡Nos casamos!</h1><img src={ASSET('img/novios-arcos.webp')} alt="Mariana y Miguel" className="mx-auto mt-8 w-[82%]" /><img src={ASSET('img/nombres.webp')} alt="Miguel Rosales Cordón y Mariana Schwartz Chávez" className="relative mx-auto -mt-[29%] w-[82%]" /></Section><Section><Branch /><p className="text-lg font-semibold uppercase leading-[1.8] tracking-[.16em] italic">Nuestros padres nos acompañan<br />en este día tan especial</p><img src={ASSET('img/papas.webp')} alt="" aria-hidden="true" className="mx-auto mt-8 w-14" /><Eyebrow>Padres del novio</Eyebrow><p className="mt-3 text-lg font-semibold leading-8 italic">Eduardo Rosales Arenales<br />María Celia Cordón Chang</p><img src={ASSET('img/papas.webp')} alt="" aria-hidden="true" className="mx-auto mt-10 w-12" /><Eyebrow>Padres de la novia</Eyebrow><p className="mt-3 text-lg font-semibold leading-8 italic">Lisseth María Chávez Escandón<br />Otto Mauricio Schwartz Izquierdo</p></Section><Section><Branch flipped /><h2 className="text-xl font-semibold uppercase leading-[1.7] tracking-[.19em] italic">Cuenta regresiva<br />para nuestro gran día</h2><div className="mt-9 grid grid-cols-4 gap-2 tabular-nums">{[['Días', countdown.days], ['Horas', countdown.hours], ['Min', countdown.minutes], ['Seg.', countdown.seconds]].map(([label, value]) => <div key={label}><p className="text-4xl font-semibold">{value}</p><p className="mt-2 text-[.6rem] font-semibold uppercase tracking-[.16em] text-[#4b4c35]">{label}</p></div>)}</div><img src={ASSET('img/calendario.webp')} alt="Calendario" className="mx-auto mt-12 w-20" /><CalendarLinks /></Section><Section><p className="text-xl uppercase leading-[1.8] tracking-[.16em] italic">Esperamos compartir<br />contigo este día tan especial</p><Branch /><h2 className="text-3xl font-semibold uppercase tracking-[.2em] italic">Ceremonia y recepción</h2><img src={ASSET('img/iglesia.webp')} alt="Ilustración de Granja Santa Isabel" className="mx-auto mt-7 w-full" /><p className="mt-5 text-xl uppercase leading-8 tracking-[.14em] italic">Granja Santa Isabel<br />Santa Catarina Pinula</p><p className="mt-5 text-sm leading-6 text-[#4b4c35]">{EVENT.address}</p><div className="mx-auto mt-8 grid max-w-xs gap-3 sm:grid-cols-2"><a href={EVENT.googleMaps} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#6a0f1b] px-4 py-3 text-sm tracking-[.12em] text-[#f5eadb] italic"><MapPin size={16} />Google Maps</a><a href={EVENT.waze} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#6a0f1b]/45 px-4 py-3 text-sm tracking-[.12em] text-[#6a0f1b] italic">Waze</a></div></Section><Section><h2 className="text-3xl font-semibold uppercase tracking-[.2em] italic">Itinerario</h2><img src={ASSET('img/itinerario.webp')} alt="Itinerario: ceremonia 15:00, cóctel 16:00, recepción 17:00 y fin 00:00" className="mx-auto mt-8 w-[86%]" /></Section><Section><h2 className="text-3xl font-semibold uppercase tracking-[.2em] italic">Dress code</h2><p className="mt-4 text-lg uppercase tracking-[.2em] italic">Formal · Elegante</p><img src={ASSET('img/dresscode.webp')} alt="Código de vestimenta" className="mx-auto mt-8 w-[62%]" /><p className="mt-7 text-lg uppercase leading-8 tracking-[.18em] italic">Paleta de colores sugerida</p><Branch flipped className="mt-9" /></Section><Section><img src={ASSET('img/brindis.webp')} alt="" aria-hidden="true" className="mx-auto mb-8 w-16" /><p className="text-xl font-semibold uppercase leading-[1.8] tracking-[.16em] italic">Amamos a los niños,<br />pero nuestra boda<br />será solo para adultos.</p></Section><Section><img src={ASSET('img/regalo.webp')} alt="" aria-hidden="true" className="mx-auto mb-8 w-16" /><p className="text-lg uppercase leading-[1.8] tracking-[.15em] italic">Tu presencia es nuestro mejor regalo, pero si deseas hacernos un obsequio puedes encontrar nuestras mesas de regalo.</p><div className="mt-10 grid grid-cols-3 items-end gap-5"><a href="https://simangiftregistry.web.app/table/20008889" target="_blank" rel="noreferrer"><img src={ASSET('img/siman.webp')} alt="Mesa de regalos Siman" className="mx-auto h-12 w-auto" /></a><a href="https://www.max.com.gt/bodas-max/bodas/W83ANBO0" target="_blank" rel="noreferrer"><img src={ASSET('img/max.webp')} alt="Mesa de regalos Max" className="mx-auto h-12 w-auto" /></a><a href="https://www.cemaco.com/list/BodaRosalesSchwartz28112026" target="_blank" rel="noreferrer"><img src={ASSET('img/cemaco.webp')} alt="Mesa de regalos Cemaco" className="mx-auto h-12 w-auto" /></a></div><img src={ASSET('img/sobre-icono.webp')} alt="" aria-hidden="true" className="mx-auto mt-14 mb-7 w-20" /><p className="text-lg font-semibold uppercase leading-[1.75] tracking-[.15em] italic">Si deseas hacernos un regalo en efectivo, puedes hacerlo a las siguientes cuentas.</p><div className="mx-auto mt-7 max-w-sm"><GiftAccount account={{ bank: 'Interbanco', type: 'Ahorros', number: '7200108014', currency: 'USD', holder: 'Rosales Cordón Miguel' }} /><GiftAccount account={{ bank: 'Interbanco', type: 'Ahorros', number: '7100569419', currency: 'Quetzales', holder: 'Rosales Cordón Miguel' }} /></div></Section><Rsvp reservation={reservation} /><Section><Eyebrow>Momentos</Eyebrow><h2 className="mt-4 text-3xl font-semibold uppercase tracking-[.2em] italic">Photos</h2><Gallery /></Section><footer className="relative z-10 px-6 pb-28 pt-12 text-center text-xs uppercase tracking-[.25em] text-[#4b4c35] italic"><p>Mariana &amp; Miguel</p><p className="mt-3">28 · 11 · 2026</p></footer><img src={ASSET('img/flores-abajo.webp')} alt="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-80" /></div></div>{opened && <MusicButton playing={playing} onToggle={toggleMusic} />}</main>;
}
