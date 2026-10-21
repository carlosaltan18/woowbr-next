'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Landmark, Menu, X } from 'lucide-react';

const IMAGES = {
    walk: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790873383/WhatsApp_Image_2026-09-24_at_10.40.07_PM_1_qgzdy0.jpg',
    laugh: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790873382/WhatsApp_Image_2026-09-24_at_10.40.07_PM_dd8odu.jpg',
    garden: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790873382/WhatsApp_Image_2026-09-24_at_10.40.07_PM_2_zyyedo.jpg',
    portrait: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790873382/WhatsApp_Image_2026-09-24_at_10.40.06_PM_1_j9kzss.jpg',
};

const NAV_ITEMS = [
    ['Inicio', '#inicio'],
    ['El día', '#el-dia'],
    ['Nuestra historia', '#historia'],
    ['RSVP', '#rsvp'],
];

const WAZE_LINKS = {
    mass: {
        web: 'https://www.waze.com/es/live-map/directions/capilla-inmaculada-concepcion-condado-concepcion-condado-concepcion?to=place.w.176619666.1766524335.24557516&from=place.w.176685201.1766917551.2132644&utm_medium=lm_share_directions&utm_campaign=default&utm_source=waze_website',
        app: 'waze://?q=Capilla%20Inmaculada%20Concepci%C3%B3n%2C%20Condado%20Concepci%C3%B3n&navigate=yes',
    },
    reception: {
        web: 'https://www.waze.com/es/live-map/directions/hacienda-nueva-country-club-bv.-interno-hacienda-nueva-hacienda-nueva-country-club,-san-jose-pinula?to=place.w.176685201.1766917551.2132644',
        app: 'waze://?q=Hacienda%20Nueva%20Country%20Club%2C%20Jard%C3%ADn%20el%20Amate&navigate=yes',
    },
};

const RSVP_SHEET_CONFIG = {
    spreadsheetId: '',
    range: 'Respuestas!A:F',
    headers: ['Invitación', 'Asistencia', 'Nombres confirmados', 'Total confirmados', 'Lugares reservados', 'Fecha de respuesta'],
};

const GALLERY = [
    { source: IMAGES.walk, alt: 'Juanpa y Luchi caminando juntos', className: 'row-span-2 h-full min-h-[25rem] sm:min-h-[34rem]' },
    { source: IMAGES.laugh, alt: 'Juanpa y Luchi sonriendo juntos', className: 'h-52 sm:h-72' },
    { source: IMAGES.garden, alt: 'Juanpa y Luchi caminando en el jardín', className: 'h-52 sm:h-72' },
    { source: IMAGES.portrait, alt: 'Retrato de Juanpa y Luchi', className: 'col-span-2 h-64 sm:h-96', objectClassName: 'object-[center_12%]' },
];

function WebsiteNav() {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return <header className="absolute inset-x-0 top-0 z-40 border-b border-white/20 bg-gradient-to-b from-black/30 to-transparent text-white">
        <div className="mx-auto flex h-[64px] max-w-7xl items-center px-4 sm:px-6 lg:grid lg:h-[78px] lg:grid-cols-[1fr_auto_1fr] lg:px-8">
            <nav className="hidden h-full items-center justify-self-start gap-6 lg:flex" aria-label="Navegación principal">
                {NAV_ITEMS.slice(0, -1).map(([label, href]) => <a key={href} href={href} className="flex h-full items-center border-b-2 border-transparent text-[.58rem] font-medium uppercase tracking-[.16em] text-white/85 transition hover:border-white/70 hover:text-white">{label}</a>)}
            </nav>
            <a href="#inicio" className="font-serif text-lg font-light tracking-[.07em] text-white lg:justify-self-center lg:text-2xl" onClick={close}>Luchi <span className="italic text-[#d9e3e5]">&amp;</span> Juanpa</a>
            <div className="ml-auto justify-self-end">
                <a href="#rsvp" className="hidden border border-white/70 bg-white/10 px-4 py-2.5 text-[.56rem] font-medium uppercase tracking-[.16em] text-white transition hover:bg-white hover:text-[#304d50] lg:block">Confirmar asistencia</a>
                <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-white/50 bg-black/10 text-white transition hover:bg-white/15 lg:hidden" aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen((current) => !current)}>{open ? <X size={17} /> : <Menu size={18} />}</button>
            </div>
        </div>
        {open && <nav className="absolute right-3 top-[calc(100%+4px)] w-48 border border-white/25 bg-[#203f42]/75 px-5 py-5 shadow-xl backdrop-blur-md lg:hidden" aria-label="Navegación móvil"><div className="grid gap-4">{NAV_ITEMS.map(([label, href]) => <a key={href} href={href} onClick={close} className="text-[.58rem] font-semibold uppercase tracking-[.18em] text-white/90">{label}</a>)}</div></nav>}
    </header>;
}

function SiteFooter() {
    return <footer className="border-t border-[#A7B9A6]/55 bg-[#fbfaf5] px-5 py-10 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"><p className="font-serif text-2xl font-light text-[#304d50]">Luchi <span className="italic text-[#7A8FA1]">&amp;</span> Juanpa</p><p className="text-[.56rem] font-medium uppercase tracking-[.22em] text-[#597075]">27 de febrero de 2027</p><p className="text-[.56rem] uppercase tracking-[.18em] text-[#7A8FA1]">Design by woowbegt.com</p></div></footer>;
}

function PageLayout({ children }) {
    return <main className="min-h-screen overflow-x-hidden bg-[#f7f5ef] text-[#304d50]"><WebsiteNav />{children}<SiteFooter /></main>;
}

function SectionIntro({ eyebrow, title, copy }) {
    return <div className="mx-auto max-w-3xl text-center"><p className="text-[.62rem] font-semibold uppercase tracking-[.3em] text-[#4A6F73]">{eyebrow}</p><h2 className="mt-5 font-serif text-4xl font-light leading-[.98] text-[#304d50] sm:text-6xl">{title}</h2>{copy && <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-[#597075]">{copy}</p>}</div>;
}

function WazeLink({ destination }) {
    const openInWaze = (event) => {
        if (typeof navigator === 'undefined' || !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
        event.preventDefault();
        window.location.href = destination.app;
    };

    return <a href={destination.web} onClick={openInWaze} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 border-b border-[#4A6F73] pb-1 text-[.62rem] font-semibold uppercase tracking-[.17em] text-[#305b60] transition hover:text-[#203f42]">Abrir en Waze <ArrowUpRight size={14} /></a>;
}

function DayDetails() {
    return <section id="el-dia" className="scroll-mt-4 border-y border-[#A7B9A6]/55 bg-[#fbfaf5] px-5 py-20 sm:px-8 sm:py-28">
        <SectionIntro eyebrow="27 de febrero de 2027" title={<>El día de<br /><span className="italic text-[#4A6F73]">nuestra boda.</span></>} copy="Será una alegría vivir cada momento de este día junto a ustedes." />
        <div className="mx-auto mt-16 max-w-5xl divide-y divide-[#A7B9A6]/65 border-y border-[#A7B9A6]/65">
            <article className="grid gap-7 py-10 md:grid-cols-[.52fr_1.48fr] md:py-14">
                <p className="font-serif text-3xl font-light text-[#304d50] sm:text-4xl">15:00<br /><span className="text-2xl italic text-[#4A6F73] sm:text-3xl">horas</span></p>
                <div className="md:border-l md:border-[#A7B9A6]/60 md:pl-12"><h3 className="font-serif text-4xl font-light text-[#304d50] sm:text-5xl">Santa Misa</h3><p className="mt-6 text-xl font-light text-[#406367]">Capilla Inmaculada Concepción</p><p className="mt-3 max-w-xl text-sm leading-6 text-[#597075]">KM 15.5, Carretera a El Salvador, Interior Condado Concepción, Santa Catarina Pinula, Guatemala.</p><WazeLink destination={WAZE_LINKS.mass} /></div>
            </article>
            <article className="grid gap-7 py-10 md:grid-cols-[.52fr_1.48fr] md:py-14">
                <p className="font-serif text-3xl font-light text-[#304d50] sm:text-4xl">17:30<br /><span className="text-2xl italic text-[#4A6F73] sm:text-3xl">a 23:00 horas</span></p>
                <div className="md:border-l md:border-[#A7B9A6]/60 md:pl-12"><h3 className="font-serif text-4xl font-light text-[#304d50] sm:text-5xl">Recepción</h3><p className="mt-6 text-xl font-light text-[#406367]">Hacienda Nueva Country Club</p><p className="mt-3 text-sm leading-6 text-[#597075]">Jardín el Amate</p><WazeLink destination={WAZE_LINKS.reception} /></div>
            </article>
        </div>
    </section>;
}

function DressCode() {
    return <section id="vestimenta" className="scroll-mt-4 bg-[#edf0ea] px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-5xl border-y border-[#A7B9A6]/60 py-12 sm:py-16"><div className="grid items-center gap-10 md:grid-cols-[.85fr_1.15fr]"><div><p className="text-[.62rem] font-semibold uppercase tracking-[.3em] text-[#4A6F73]">Código de vestimenta</p><h2 className="mt-5 font-serif text-5xl font-light leading-none text-[#304d50] sm:text-7xl">Formal</h2><div className="mt-9 flex items-center gap-3 text-[#7A8FA1]"><span className="h-px w-9 bg-current" /><span className="text-sm">✦</span><span className="h-px w-9 bg-current" /></div></div><div className="md:border-l md:border-[#A7B9A6]/60 md:pl-12"><p className="font-serif text-3xl font-light leading-tight text-[#304d50]">Celebremos con elegancia, bajo el cielo del jardín.</p><p className="mt-7 max-w-lg text-sm leading-7 text-[#597075]">El evento contará con espacios al aire libre. Te sugerimos considerar calzado cómodo para disfrutar el jardín durante la celebración.</p></div></div></div></section>;
}

function StoryGallery() {
    const [activePhoto, setActivePhoto] = useState(null);
    const movePhoto = (direction) => setActivePhoto((current) => (current + direction + GALLERY.length) % GALLERY.length);

    return <section id="historia" className="scroll-mt-4 px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-6xl"><SectionIntro eyebrow="Nuestra historia" title={<>Momentos que<br /><span className="italic text-[#4A6F73]">nos trajeron hasta aquí.</span></>} copy="Entre risas, conversaciones y días compartidos, fuimos encontrando un lugar al que siempre queremos volver: el uno al otro." /><div className="mt-16 grid grid-cols-2 gap-3 sm:mt-20 sm:gap-5">{GALLERY.map((image, index) => <button key={image.source} type="button" onClick={() => setActivePhoto(index)} className={`group relative block overflow-hidden bg-[#edf0ea] text-left ${image.className}`}><img src={image.source} alt={image.alt} className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.025] ${image.objectClassName ?? ''}`} loading={index === 0 ? 'eager' : 'lazy'} /><span className="absolute inset-0 bg-[#203f42]/0 transition group-hover:bg-[#203f42]/15" /></button>)}</div></div>{activePhoto !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#122326]/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Galería de Juanpa y Luchi" onClick={(event) => { if (event.target === event.currentTarget) setActivePhoto(null); }}><button type="button" onClick={() => setActivePhoto(null)} aria-label="Cerrar galería" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/40 text-white transition hover:bg-white/15"><X size={20} /></button><button type="button" onClick={() => movePhoto(-1)} aria-label="Foto anterior" className="absolute left-3 grid h-10 w-10 place-items-center rounded-full border border-white/40 text-white transition hover:bg-white/15 sm:left-7"><ArrowLeft size={19} /></button><img src={GALLERY[activePhoto].source} alt={GALLERY[activePhoto].alt} className="max-h-[84svh] max-w-[82vw] object-contain shadow-2xl" /><button type="button" onClick={() => movePhoto(1)} aria-label="Foto siguiente" className="absolute right-3 grid h-10 w-10 place-items-center rounded-full border border-white/40 text-white transition hover:bg-white/15 sm:right-7"><ArrowRight size={19} /></button></div>}</section>;
}

function GiftSection() {
    return <section id="regalo" className="scroll-mt-4 bg-[#304d50] px-5 py-20 text-white sm:px-8 sm:py-28"><div className="mx-auto max-w-3xl text-center"><Landmark className="mx-auto h-7 w-7 text-[#d9e3e5]" strokeWidth={1.35} /><p className="mt-8 text-[.62rem] font-semibold uppercase tracking-[.3em] text-[#d9e3e5]">Regalo</p><h2 className="mt-5 font-serif text-4xl font-light leading-tight sm:text-6xl">Su presencia es nuestro mejor regalo.</h2><p className="mx-auto mt-7 max-w-xl text-base leading-7 text-white/80">Si desean acompañarnos con un detalle, agradeceremos su contribución a nuestra cuenta monetaria.</p><span className="mx-auto mt-10 block h-px w-12 bg-[#d9e3e5]/70" /><div className="mx-auto mt-10 max-w-lg border border-white/30 bg-white/[.07] px-6 py-7 text-left backdrop-blur-sm sm:px-9"><p className="text-center text-[.6rem] font-semibold uppercase tracking-[.28em] text-[#d9e3e5]">Datos de cuenta</p><dl className="mt-7 grid gap-5 border-t border-white/20 pt-6 sm:grid-cols-2"><div><dt className="text-[.56rem] font-semibold uppercase tracking-[.2em] text-white/60">Banco</dt><dd className="mt-2 text-base font-light tracking-[.06em] text-white">XXXXX</dd></div><div><dt className="text-[.56rem] font-semibold uppercase tracking-[.2em] text-white/60">Tipo de cuenta</dt><dd className="mt-2 text-base font-light tracking-[.06em] text-white">XXXXX</dd></div><div className="sm:col-span-2"><dt className="text-[.56rem] font-semibold uppercase tracking-[.2em] text-white/60">Número de cuenta</dt><dd className="mt-2 font-serif text-2xl font-light tracking-[.12em] text-white">XXXXX</dd></div><div className="sm:col-span-2"><dt className="text-[.56rem] font-semibold uppercase tracking-[.2em] text-white/60">A nombre de</dt><dd className="mt-2 text-base font-light tracking-[.06em] text-white">XXXXX</dd></div></dl></div></div></section>;
}

function RsvpSection() {
    const searchParams = useSearchParams();
    const requestedSeats = Number.parseInt(searchParams.get('adultos') ?? searchParams.get('invitados') ?? '1', 10);
    const reservedSeats = Number.isFinite(requestedSeats) ? Math.min(Math.max(requestedSeats, 1), 12) : 1;
    const guestName = searchParams.get('nombre')?.trim() ?? '';
    const [attendeeNames, setAttendeeNames] = useState(() => Array.from({ length: reservedSeats }, () => ''));
    const [answer, setAnswer] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const confirmedNames = attendeeNames.map((name) => name.trim()).filter(Boolean);
    const updateName = (index, value) => setAttendeeNames((current) => current.map((name, currentIndex) => currentIndex === index ? value : name));

    const submit = async (event) => {
        event.preventDefault();
        if (!answer || !confirmedNames.length) {
            setMessage('Selecciona la celebración e indica al menos una persona que asistirá.');
            return;
        }
        if (!RSVP_SHEET_CONFIG.spreadsheetId) {
            setMessage('La confirmación está lista. Solo falta conectar la hoja de respuestas de esta boda.');
            return;
        }
        setMessage('');
        setSubmitting(true);
        try {
            const response = await fetch('/api/registrarInvitado/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...RSVP_SHEET_CONFIG,
                    values: [
                        guestName || 'Invitado sin nombre',
                        answer,
                        confirmedNames.join(', '),
                        String(confirmedNames.length),
                        String(reservedSeats),
                        new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala', dateStyle: 'short', timeStyle: 'short' }),
                    ],
                }),
            });
            if (!response.ok) throw new Error('No se pudo guardar la respuesta');
            setConfirmed(true);
        } catch (error) {
            console.error(error);
            setMessage('No pudimos registrar tu respuesta. Inténtalo de nuevo en unos momentos.');
        } finally {
            setSubmitting(false);
        }
    };

    return <section id="rsvp" className="scroll-mt-4 px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-5xl border-y border-[#A7B9A6]/65 py-12 sm:py-16">{confirmed ? <div className="mx-auto max-w-2xl text-center"><p className="text-[.62rem] font-semibold uppercase tracking-[.3em] text-[#4A6F73]">RSVP</p><h2 className="mt-6 font-serif text-5xl font-light text-[#304d50] sm:text-6xl">Gracias por<br /><span className="italic text-[#4A6F73]">confirmar.</span></h2><p className="mx-auto mt-7 max-w-md text-base leading-7 text-[#597075]">Nos alegra contar con {confirmedNames.length === 1 ? 'tu presencia' : `la presencia de ${confirmedNames.length} personas`} en este día tan especial.</p></div> : <><div className="grid gap-10 md:grid-cols-[.75fr_1.25fr]"><div><p className="text-[.62rem] font-semibold uppercase tracking-[.3em] text-[#4A6F73]">RSVP</p><h2 className="mt-5 font-serif text-5xl font-light leading-[.92] text-[#304d50] sm:text-7xl">¿Nos<br /><span className="italic text-[#4A6F73]">acompañas?</span></h2><p className="mt-7 max-w-xs text-sm leading-6 text-[#597075]">Agradecemos mucho que nos confirmes tu asistencia.</p></div><div className="border-t border-[#A7B9A6]/60 pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0"><p className="text-[.62rem] font-semibold uppercase tracking-[.24em] text-[#4A6F73]">Esta invitación reserva</p><div className="mt-4 flex items-end gap-4"><span className="font-serif text-7xl font-light leading-none text-[#304d50]">{reservedSeats}</span><span className="pb-2 text-[.62rem] font-semibold uppercase tracking-[.22em] text-[#597075]">{reservedSeats === 1 ? 'lugar' : 'lugares'}</span></div>{guestName && <p className="mt-6 text-sm leading-6 text-[#597075]">Invitación para <span className="font-medium text-[#304d50]">{guestName}</span></p>}<p className="mt-5 text-sm leading-6 text-[#597075]">Escribe únicamente los nombres de quienes podrán acompañarnos.</p></div></div><form onSubmit={submit} className="mx-auto mt-14 max-w-4xl"><fieldset><legend className="text-[.62rem] font-semibold uppercase tracking-[.2em] text-[#4A6F73]">Confirmaré para</legend><div className="mt-4 grid border border-[#7A8FA1]/50 sm:grid-cols-3">{['Santa Misa', 'Recepción', 'Ambas'].map((option, index) => <label key={option} className={`cursor-pointer px-3 py-4 text-center text-sm text-[#406367] transition has-[:checked]:bg-[#4A6F73] has-[:checked]:text-white ${index ? 'border-t border-[#7A8FA1]/50 sm:border-l sm:border-t-0' : ''}`}><input className="sr-only" type="radio" name="attendance" value={option} checked={answer === option} onChange={(event) => { setAnswer(event.target.value); setMessage(''); }} />{option}</label>)}</div></fieldset><div className="mt-12 border-t border-[#A7B9A6]/60 pt-8"><p className="text-[.62rem] font-semibold uppercase tracking-[.2em] text-[#4A6F73]">Nombres de quienes asistirán</p><p className="mt-3 text-sm leading-6 text-[#597075]">Debes escribir tu nombre. Puedes dejar vacíos los lugares que no utilizarán.</p><div className="mt-5 grid gap-x-8 sm:grid-cols-2">{attendeeNames.map((name, index) => <label key={index} className="block border-b border-[#A7B9A6]/60"><span className="sr-only">Nombre de la persona {index + 1}</span><input type="text" value={name} onChange={(event) => updateName(index, event.target.value)} placeholder="Escribe tu nombre" className="w-full bg-transparent px-0 py-4 text-base text-[#304d50] outline-none placeholder:text-[#789095] focus:border-[#304d50]" /></label>)}</div></div><button type="submit" disabled={submitting} className="mt-10 inline-flex items-center gap-2 border-b border-[#304d50] pb-2 text-[.65rem] font-semibold uppercase tracking-[.2em] text-[#304d50] transition hover:text-[#4A6F73] disabled:cursor-wait disabled:opacity-50">{submitting ? 'Guardando…' : 'Enviar confirmación'} <ArrowUpRight size={15} /></button>{message && <p aria-live="polite" className="mt-5 max-w-lg text-sm leading-6 text-[#406367]">{message}</p>}</form></>}</div></section>;
}

export default function InvitacionJuanpaLuchi() {
    return <PageLayout>
        <section id="inicio" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#304d50] px-5 pt-20 text-center sm:px-8"><img src={IMAGES.laugh} alt="Luchi y Juanpa" className="absolute inset-0 h-full w-full object-cover object-center" fetchPriority="high" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,36,39,.36),rgba(19,36,39,.16)_42%,rgba(19,36,39,.58))]" /><div className="relative -mt-4 max-w-3xl text-white"><p className="text-[.58rem] font-medium uppercase tracking-[.3em] text-white/90">Nos casamos</p><h1 className="mt-6 font-serif text-5xl font-light leading-[.9] sm:text-7xl lg:text-8xl">Luchi <span className="font-light italic text-[#e4ece7]">&amp;</span> Juanpa</h1><span className="mx-auto mt-7 block h-px w-14 bg-white/70" /><p className="mt-6 text-[.65rem] font-medium uppercase tracking-[.23em] text-white/95">27 de febrero de 2027</p><a href="#el-dia" className="mt-10 inline-flex items-center gap-2 border-b border-white/75 pb-2 text-[.6rem] font-semibold uppercase tracking-[.18em] text-white transition hover:border-white">Te invitamos a celebrar <ArrowUpRight size={14} /></a></div><a href="#bienvenida" aria-label="Continuar hacia los detalles de la boda" className="absolute bottom-6 left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-white/50 text-white transition hover:bg-white/15"><ChevronDown size={19} /></a></section>
        <section id="bienvenida" className="scroll-mt-4 px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto grid max-w-6xl gap-8 border-y border-[#A7B9A6]/60 py-8 sm:py-10 md:grid-cols-[minmax(200px,.62fr)_1.38fr] md:gap-14"><figure className="border border-[#A7B9A6]/55 bg-[#edf0ea] p-2"><img src={IMAGES.walk} alt="Luchi y Juanpa compartiendo un momento" className="h-auto w-full" loading="lazy" /></figure><div className="flex flex-col justify-center py-2 md:py-8"><p className="text-[.62rem] font-semibold uppercase tracking-[.3em] text-[#4A6F73]">Bienvenidos</p><span className="mt-7 h-px w-11 bg-[#7A8FA1]" /><p className="mt-7 max-w-xl font-serif text-3xl font-light leading-[1.15] text-[#304d50] sm:text-5xl">Con mucha ilusión queremos compartir contigo el comienzo de esta nueva etapa de nuestra historia.</p><a href="#historia" className="mt-8 inline-flex w-fit items-center gap-2 border-b border-[#4A6F73] pb-1 text-[.62rem] font-semibold uppercase tracking-[.17em] text-[#305b60]">Conoce nuestra historia <ArrowUpRight size={14} /></a></div></div></section>
        <DayDetails />
        <DressCode />
        <StoryGallery />
        <GiftSection />
        <RsvpSection />
    </PageLayout>;
}
