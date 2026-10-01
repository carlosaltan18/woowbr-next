'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';

const BASE_PATH = '/Juanpa&Luchi-weeding';

const IMAGES = {
    hero: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790873382/WhatsApp_Image_2026-09-24_at_10.40.07_PM_3_godxvd.jpg',
    walk: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790873383/WhatsApp_Image_2026-09-24_at_10.40.07_PM_1_qgzdy0.jpg',
    laugh: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790873382/WhatsApp_Image_2026-09-24_at_10.40.07_PM_dd8odu.jpg',
    garden: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790873382/WhatsApp_Image_2026-09-24_at_10.40.07_PM_2_zyyedo.jpg',
    portrait: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790873382/WhatsApp_Image_2026-09-24_at_10.40.06_PM_1_j9kzss.jpg',
};

const NAV_ITEMS = [
    ['Inicio', BASE_PATH, 'inicio'],
    ['El día', `${BASE_PATH}/el-dia`, 'dia'],
    ['Nuestra historia', `${BASE_PATH}/fotos`, 'historia'],
    ['RSVP', `${BASE_PATH}/rsvp`, 'rsvp'],
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
    { source: IMAGES.walk, alt: 'Juanpa y Luchi caminando juntos' },
    { source: IMAGES.laugh, alt: 'Juanpa y Luchi sonriendo juntos' },
    { source: IMAGES.garden, alt: 'Juanpa y Luchi en el jardín' },
    { source: IMAGES.portrait, alt: 'Retrato de Juanpa y Luchi' },
];

function WebsiteNav({ active, overlay = false }) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    const linkClass = overlay ? 'border-transparent text-white/85 hover:border-white/70 hover:text-white' : 'border-transparent text-[#597075] hover:border-[#A7B9A6] hover:text-[#304d50]';
    const activeClass = overlay ? 'border-white text-white' : 'border-[#4A6F73] text-[#304d50]';

    return <header className={`z-40 ${overlay ? 'absolute inset-x-0 top-0 border-b border-white/20 bg-gradient-to-b from-black/25 to-transparent text-white' : 'relative border-b border-[#a7b9a6]/55 bg-[#fbfaf5]'}`}>
        <div className="mx-auto flex h-[64px] max-w-7xl items-center px-4 sm:px-6 lg:grid lg:h-[78px] lg:grid-cols-[1fr_auto_1fr] lg:px-8">
            <nav className="hidden h-full items-center justify-self-start gap-6 lg:flex">{NAV_ITEMS.slice(0, -1).map(([label, href, key]) => <Link key={key} href={href} className={`flex h-full items-center border-b-2 px-0 text-[.58rem] font-bold uppercase tracking-[.15em] transition ${active === key ? activeClass : linkClass}`}>{label}</Link>)}</nav>
            <Link href={BASE_PATH} className={`font-serif text-lg tracking-[.07em] lg:justify-self-center lg:text-2xl ${overlay ? 'text-white' : 'text-[#304d50]'}`} onClick={close}>Juanpa <span className={`italic ${overlay ? 'text-[#d9e3e5]' : 'text-[#7A8FA1]'}`}>&amp;</span> Luchi</Link>
            <div className="ml-auto justify-self-end"><Link href={`${BASE_PATH}/rsvp`} className={`hidden px-4 py-2.5 text-[.56rem] font-bold uppercase tracking-[.16em] transition lg:block ${overlay ? 'border border-white/70 bg-white/10 text-white hover:bg-white hover:text-[#304d50]' : 'border border-[#4A6F73] text-[#304d50] hover:bg-[#4A6F73] hover:text-white'}`}>Confirmar asistencia</Link><button type="button" className={`grid h-9 w-9 place-items-center rounded-full border transition lg:hidden ${overlay ? 'border-white/50 bg-black/10 text-white hover:bg-white/15' : 'border-[#4A6F73]/50 text-[#304d50] hover:bg-[#edf0ea]'}`} aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen((current) => !current)}>{open ? <X size={17} /> : <Menu size={18} />}</button></div>
        </div>
        {open && <nav className={`absolute right-3 top-[calc(100%+4px)] w-44 border px-4 py-4 shadow-xl backdrop-blur-md lg:hidden ${overlay ? 'border-white/25 bg-[#203f42]/70 text-white' : 'border-[#A7B9A6]/55 bg-[#fbfaf5]/80'}`}><div className="grid gap-3.5">{NAV_ITEMS.map(([label, href, key]) => <Link key={key} href={href} onClick={close} className={`text-[.56rem] font-bold uppercase tracking-[.16em] ${active === key ? (overlay ? 'text-white' : 'text-[#304d50]') : (overlay ? 'text-white/80' : 'text-[#597075]')}`}>{label}</Link>)}</div></nav>}
    </header>;
}

function SiteFooter() {
    return <footer className="border-t border-[#A7B9A6]/55 bg-[#fbfaf5] px-5 py-10 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"><p className="font-serif text-2xl text-[#304d50]">Juanpa <span className="italic text-[#7A8FA1]">&amp;</span> Luchi</p><p className="text-[.56rem] font-bold uppercase tracking-[.22em] text-[#597075]">Con cariño, esperamos celebrar contigo</p><p className="text-[.56rem] uppercase tracking-[.18em] text-[#7A8FA1]">Design by woowbegt.com</p></div></footer>;
}

function PageLayout({ active, children, navOverlay = false }) {
    return <main className="min-h-screen overflow-x-hidden bg-[#f7f5ef] text-[#304d50]"><WebsiteNav active={active} overlay={navOverlay} />{children}<SiteFooter /></main>;
}

function PageHeading({ eyebrow, title, copy }) {
    return <div className="mx-auto max-w-3xl text-center"><p className="text-[.62rem] font-bold uppercase tracking-[.3em] text-[#4A6F73]">{eyebrow}</p><h1 className="mt-5 font-serif text-5xl leading-[.95] text-[#304d50] sm:text-7xl">{title}</h1>{copy && <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-[#597075]">{copy}</p>}</div>;
}

function WazeLink({ destination }) {
    const openInWaze = (event) => {
        if (typeof navigator === 'undefined' || !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
        event.preventDefault();
        window.location.href = destination.app;
    };

    return <a href={destination.web} onClick={openInWaze} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 border-b border-[#4A6F73] pb-1 text-[.62rem] font-bold uppercase tracking-[.17em] text-[#305b60] transition hover:text-[#203f42]">Abrir en Waze <ArrowUpRight size={14} /></a>;
}

export default function InvitacionJuanpaLuchi() {
    return <PageLayout active="inicio" navOverlay>
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#304d50] px-5 pt-20 text-center sm:px-8"><img src={IMAGES.laugh} alt="Juanpa y Luchi" className="absolute inset-0 h-full w-full object-cover object-center" fetchPriority="high" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,36,39,.36),rgba(19,36,39,.16)_42%,rgba(19,36,39,.58))]" /><div className="relative -mt-4 max-w-3xl text-white"><p className="text-[.58rem] font-bold uppercase tracking-[.3em] text-white/90">Nos casamos</p><h1 className="mt-6 font-serif text-5xl leading-[.9] sm:text-7xl lg:text-8xl">Juanpa <span className="font-light italic text-[#e4ece7]">&amp;</span> Luchi</h1><span className="mx-auto mt-7 block h-px w-14 bg-white/70" /><p className="mt-6 text-[.6rem] font-bold uppercase tracking-[.23em] text-white/90">Guatemala</p><Link href={`${BASE_PATH}/el-dia`} className="mt-10 inline-flex items-center gap-2 border-b border-white/75 pb-2 text-[.6rem] font-bold uppercase tracking-[.18em] text-white transition hover:border-white">Te invitamos a celebrar <ArrowUpRight size={14} /></Link></div><Link href={`${BASE_PATH}/el-dia`} aria-label="Ver los detalles de la boda" className="absolute bottom-6 left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-white/50 text-white transition hover:bg-white/15"><ChevronDown size={19} /></Link></section>
        <section className="px-5 py-16 sm:px-8 sm:py-24"><div className="mx-auto grid max-w-6xl gap-8 border-y border-[#A7B9A6]/60 py-8 sm:py-10 md:grid-cols-[minmax(200px,.62fr)_1.38fr] md:gap-14"><figure className="border border-[#A7B9A6]/55 bg-[#edf0ea] p-2"><img src={IMAGES.walk} alt="Juanpa y Luchi compartiendo un momento" className="h-auto w-full" loading="lazy" /></figure><div className="flex flex-col justify-center py-2 md:py-8"><p className="text-[.62rem] font-bold uppercase tracking-[.3em] text-[#4A6F73]">Bienvenidos</p><span className="mt-7 h-px w-11 bg-[#7A8FA1]" /><p className="mt-7 max-w-3xl font-serif text-3xl leading-[1.1] text-[#304d50] sm:text-5xl">“Whatever our souls are made of, his and mine are the same.”</p><p className="mt-6 text-[.6rem] font-bold uppercase tracking-[.25em] text-[#7A8FA1]">Emily Brontë</p><p className="mt-7 max-w-xl text-sm leading-7 text-[#597075]">Con mucha ilusión, queremos compartir contigo el comienzo de esta nueva etapa de nuestra historia.</p><Link href={`${BASE_PATH}/fotos`} className="mt-8 inline-flex w-fit items-center gap-2 border-b border-[#4A6F73] pb-1 text-[.62rem] font-bold uppercase tracking-[.17em] text-[#305b60]">Conoce nuestra historia <ArrowUpRight size={14} /></Link></div></div></section>
    </PageLayout>;
}

export function ElDiaJuanpaLuchi() {
    return <PageLayout active="dia">
        <section className="px-5 py-20 sm:px-8 sm:py-28">
            <PageHeading eyebrow="Wedding day" title={<>El día de<br /><span className="italic text-[#4A6F73]">nuestra boda.</span></>} copy="Nos emociona celebrar cada momento de este día con ustedes." />
            <div className="mx-auto mt-16 max-w-5xl border-y border-[#A7B9A6]/65">
                <article className="grid gap-8 py-10 md:grid-cols-[.55fr_1.45fr] md:py-14"><div><p className="text-[.62rem] font-bold uppercase tracking-[.26em] text-[#5d765e]">01 — Ceremonia</p><p className="mt-4 font-serif text-3xl text-[#304d50]">15:00 hrs</p></div><div className="md:border-l md:border-[#A7B9A6]/60 md:pl-12"><h2 className="font-serif text-4xl text-[#304d50] sm:text-5xl">Santa Misa</h2><p className="mt-6 text-xl text-[#406367]">Capilla Inmaculada Concepción</p><p className="mt-3 max-w-xl text-sm leading-6 text-[#597075]">KM 15.5, Carretera a El Salvador, Interior Condado Concepción, Santa Catarina Pinula, Guatemala.</p><WazeLink destination={WAZE_LINKS.mass} /></div></article>
                <article className="grid gap-8 border-t border-[#A7B9A6]/65 py-10 md:grid-cols-[.55fr_1.45fr] md:py-14"><div><p className="text-[.62rem] font-bold uppercase tracking-[.26em] text-[#617d91]">02 — Celebración</p><p className="mt-4 font-serif text-3xl text-[#304d50]">17:30 — 23:00 hrs</p></div><div className="md:border-l md:border-[#A7B9A6]/60 md:pl-12"><h2 className="font-serif text-4xl text-[#304d50] sm:text-5xl">La Recepción</h2><p className="mt-6 text-xl text-[#406367]">Hacienda Nueva Country Club</p><p className="mt-3 text-sm leading-6 text-[#597075]">Jardín el Amate</p><WazeLink destination={WAZE_LINKS.reception} /></div></article>
            </div>
        </section>
        <section className="border-y border-[#A7B9A6]/55 bg-[#edf0ea] px-5 py-20 sm:px-8"><div className="mx-auto max-w-5xl border-y border-[#A7B9A6]/60 py-10 sm:py-14"><div className="grid gap-10 md:grid-cols-[.8fr_1.2fr]"><div><p className="text-[.62rem] font-bold uppercase tracking-[.3em] text-[#4A6F73]">Código de vestimenta</p><h2 className="mt-5 font-serif text-5xl leading-none text-[#304d50] sm:text-7xl">Formal</h2><div className="mt-9 flex items-center gap-3"><span className="h-px w-9 bg-[#7A8FA1]" /><span className="text-sm text-[#7A8FA1]">✦</span><span className="h-px w-9 bg-[#7A8FA1]" /></div></div><div className="md:border-l md:border-[#A7B9A6]/60 md:pl-12"><p className="font-serif text-3xl leading-tight text-[#304d50]">Una noche para brindar, bailar y celebrar el amor.</p><div className="mt-8 grid gap-5 border-t border-[#A7B9A6]/60 pt-6 sm:grid-cols-2"><div><p className="text-[.58rem] font-bold uppercase tracking-[.22em] text-[#4A6F73]">La ocasión</p><p className="mt-3 text-sm leading-6 text-[#597075]">Elegancia para una celebración especial.</p></div><div className="sm:border-l sm:border-[#A7B9A6]/60 sm:pl-6"><p className="text-[.58rem] font-bold uppercase tracking-[.22em] text-[#4A6F73]">Paleta</p><p className="mt-3 text-sm leading-6 text-[#597075]">Sin restricción de color.</p></div></div><p className="mt-7 text-[.62rem] font-bold uppercase tracking-[.2em] text-[#4A6F73]">✦ Todos los colores son bienvenidos</p></div></div></div></section>
    </PageLayout>;
}

export function FotosJuanpaLuchi() {
    const [activePhoto, setActivePhoto] = useState(null);
    const movePhoto = (direction) => setActivePhoto((current) => (current + direction + GALLERY.length) % GALLERY.length);

    return <PageLayout active="historia"><section className="px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto grid max-w-6xl overflow-hidden border border-[#A7B9A6]/60 md:grid-cols-[.9fr_1.1fr]"><figure className="min-h-[330px] overflow-hidden sm:min-h-[500px]"><img src={IMAGES.garden} alt="Juanpa y Luchi caminando juntos" className="h-full w-full object-cover object-center" /></figure><div className="flex flex-col justify-center px-7 py-14 sm:px-14 sm:py-20"><p className="text-[.62rem] font-bold uppercase tracking-[.3em] text-[#4A6F73]">Nuestra historia</p><span className="mt-8 h-px w-12 bg-[#7A8FA1]" /><p className="mt-9 font-serif text-3xl leading-[1.18] text-[#304d50] sm:text-5xl">“Whatever our souls are made of, his and mine are the same.”</p><p className="mt-8 max-w-md text-base leading-7 text-[#597075]">Entre risas, conversaciones y días compartidos, fuimos encontrando un lugar al que siempre queremos volver: el uno al otro.</p><p className="mt-8 text-[.6rem] font-bold uppercase tracking-[.24em] text-[#7A8FA1]">Juanpa &amp; Luchi</p></div></div><div className="mt-20"><PageHeading eyebrow="Momentos" title={<>Nuestra<br /><span className="italic text-[#4A6F73]">galería.</span></>} copy="Pequeños instantes que se sienten como hogar." /><div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-3 sm:gap-5">{GALLERY.map((image, index) => <button key={image.source} type="button" onClick={() => setActivePhoto(index)} className="group relative block w-full overflow-hidden bg-[#edf0ea] text-left"><img src={image.source} alt={image.alt} className="block h-auto w-full transition duration-700 group-hover:scale-[1.02]" loading={index === 0 ? 'eager' : 'lazy'} /><span className="absolute inset-0 bg-[#203f42]/0 transition group-hover:bg-[#203f42]/15" /></button>)}</div></div></section>{activePhoto !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#122326]/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Galería de Juanpa y Luchi" onClick={(event) => { if (event.target === event.currentTarget) setActivePhoto(null); }}><button type="button" onClick={() => setActivePhoto(null)} aria-label="Cerrar galería" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/40 text-white transition hover:bg-white/15"><X size={20} /></button><button type="button" onClick={() => movePhoto(-1)} aria-label="Foto anterior" className="absolute left-3 grid h-10 w-10 place-items-center rounded-full border border-white/40 text-white transition hover:bg-white/15 sm:left-7"><ArrowLeft size={19} /></button><img src={GALLERY[activePhoto].source} alt={GALLERY[activePhoto].alt} className="max-h-[84svh] max-w-[82vw] object-contain shadow-2xl" /><button type="button" onClick={() => movePhoto(1)} aria-label="Foto siguiente" className="absolute right-3 grid h-10 w-10 place-items-center rounded-full border border-white/40 text-white transition hover:bg-white/15 sm:right-7"><ArrowRight size={19} /></button></div>}</PageLayout>;
}

export function RsvpJuanpaLuchi() {
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

    if (confirmed) return <PageLayout active="rsvp"><section className="flex min-h-[calc(100svh-190px)] items-center px-5 py-20 sm:px-8"><div className="mx-auto max-w-2xl border-y border-[#A7B9A6]/65 py-12 text-center"><p className="text-[.62rem] font-bold uppercase tracking-[.3em] text-[#4A6F73]">RSVP</p><h1 className="mt-6 font-serif text-5xl text-[#304d50] sm:text-6xl">Gracias por<br /><span className="italic text-[#4A6F73]">confirmar.</span></h1><p className="mx-auto mt-7 max-w-md text-base leading-7 text-[#597075]">Nos alegra contar con {confirmedNames.length === 1 ? 'tu presencia' : `la presencia de ${confirmedNames.length} personas`} en este día tan especial.</p><Link href={BASE_PATH} className="mt-10 inline-flex items-center gap-2 border-b border-[#4A6F73] pb-1 text-[.62rem] font-bold uppercase tracking-[.17em] text-[#305b60]">Volver al inicio <ArrowUpRight size={14} /></Link></div></section></PageLayout>;

    return <PageLayout active="rsvp"><section className="px-5 py-16 sm:px-8 sm:py-24"><div className="mx-auto max-w-5xl"><div className="grid border-y border-[#A7B9A6]/65 py-10 md:grid-cols-[.75fr_1.25fr] md:py-14"><div><p className="text-[.62rem] font-bold uppercase tracking-[.3em] text-[#4A6F73]">RSVP</p><h1 className="mt-5 font-serif text-5xl leading-[.92] text-[#304d50] sm:text-7xl">Nos<br /><span className="italic text-[#4A6F73]">acompañas?</span></h1><p className="mt-7 max-w-xs text-sm leading-6 text-[#597075]">Agradecemos mucho que nos confirmes tu asistencia.</p></div><div className="mt-10 border-t border-[#A7B9A6]/60 pt-8 md:mt-0 md:border-l md:border-t-0 md:pl-12 md:pt-0"><p className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#4A6F73]">Esta invitación reserva</p><div className="mt-4 flex items-end gap-4"><span className="font-serif text-7xl leading-none text-[#304d50]">{reservedSeats}</span><span className="pb-2 text-[.62rem] font-bold uppercase tracking-[.22em] text-[#597075]">{reservedSeats === 1 ? 'lugar' : 'lugares'}</span></div>{guestName && <p className="mt-6 text-sm leading-6 text-[#597075]">Invitación para <span className="font-medium text-[#304d50]">{guestName}</span></p>}<p className="mt-5 text-sm leading-6 text-[#597075]">Escribe únicamente los nombres de quienes podrán acompañarnos.</p></div></div><form onSubmit={submit} className="mx-auto mt-14 max-w-4xl"><fieldset><legend className="text-[.62rem] font-bold uppercase tracking-[.2em] text-[#4A6F73]">Confirmaré para</legend><div className="mt-4 grid border border-[#7A8FA1]/50 sm:grid-cols-3">{['Santa Misa', 'Recepción', 'Ambas'].map((option, index) => <label key={option} className={`cursor-pointer px-3 py-4 text-center text-sm text-[#406367] transition has-[:checked]:bg-[#4A6F73] has-[:checked]:text-white ${index ? 'border-t border-[#7A8FA1]/50 sm:border-l sm:border-t-0' : ''}`}><input className="sr-only" type="radio" name="attendance" value={option} checked={answer === option} onChange={(event) => { setAnswer(event.target.value); setMessage(''); }} />{option}</label>)}</div></fieldset><div className="mt-12 border-t border-[#A7B9A6]/60 pt-8"><p className="text-[.62rem] font-bold uppercase tracking-[.2em] text-[#4A6F73]">Nombres de quienes asistirán</p><p className="mt-3 text-sm leading-6 text-[#597075]">Debes escribir tu nombre. Puedes dejar vacíos los lugares que no utilizarán.</p><div className="mt-5 grid gap-x-8 sm:grid-cols-2">{attendeeNames.map((name, index) => <label key={index} className="block border-b border-[#A7B9A6]/60"><span className="sr-only">Nombre de la persona {index + 1}</span><input type="text" value={name} onChange={(event) => updateName(index, event.target.value)} placeholder="Escribe tu nombre" className="w-full bg-transparent px-0 py-4 text-base text-[#304d50] outline-none placeholder:text-[#789095] focus:border-[#304d50]" /></label>)}</div></div><button type="submit" disabled={submitting} className="mt-10 inline-flex items-center gap-2 border-b border-[#304d50] pb-2 text-[.65rem] font-bold uppercase tracking-[.2em] text-[#304d50] transition hover:text-[#4A6F73] disabled:cursor-wait disabled:opacity-50">{submitting ? 'Guardando…' : 'Enviar confirmación'} <ArrowUpRight size={15} /></button>{message && <p aria-live="polite" className="mt-5 max-w-lg text-sm leading-6 text-[#406367]">{message}</p>}</form></div></section></PageLayout>;
}
