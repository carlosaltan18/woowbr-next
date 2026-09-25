'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Check, Church, Download, Gift, Heart, MapPin, PartyPopper, Volume2, VolumeX, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const ASSETS = {
    formal: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266201/Formal_b86oqh.webp',
    church: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266201/iglesia_fftqse.webp',
    names: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266201/flory_Elvis_pj95ti.webp',
    gifts: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266202/regalos_s3izzq.webp',
    bouquet: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266202/ramo_tp9gge.webp',
    dress: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266201/dress_wpfawg.webp',
    timeline: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266202/timeline_rapk2w.webp',
    logo: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266202/Logo_inicio_w6wtne.webp',
    calendar: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266203/Calendario_qwozgn.webp',
    seal: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266204/sello_tvelir.webp',
    cover: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266205/fondo_oficial_Mesa_de_trabajo_1-01_rsrd7x.webp',
    button: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790266207/boto_ün_bfqwjg.webp',
};

const PAPER_BACKGROUND = '/fondo_boda_fiora.webp';
const WEDDING_DATE = new Date('2026-11-28T14:30:00-06:00');
const MASS_MAP = 'https://www.google.com/maps/search/?api=1&query=Iglesia+El+Calvario+Antigua+Guatemala';
const RECEPTION_MAP = 'https://www.google.com/maps/search/?api=1&query=Jard%C3%ADn+Vilaflor+Km+32.5+San+Lucas+Sacatep%C3%A9quez';
const RSVP_SPREADSHEET_ID = '1GHgwJ7eUy4Z3E79W3NRujOnjuTv83_yZYcVcaHXJQn8';
const RSVP_SHEET_RANGE = 'Hoja 1!A:F';
const RSVP_HEADERS = ['Invitado principal', 'Respuesta', 'Nombres confirmados', 'Lugares confirmados', 'Lugares reservados', 'Fecha de registro'];
const CALENDAR_EVENT = {
    title: 'Boda de Flory y Elvis', startUtc: '20261128T203000Z', endUtc: '20261129T070000Z',
    location: 'Iglesia El Calvario, Antigua Guatemala · Jardín Vilaflor, Km 32.5, San Lucas Sacatepéquez',
    description: 'Ceremonia: 2:30 p. m. en Iglesia El Calvario, Antigua Guatemala.\nRecepción: 6:00 p. m. en Jardín Vilaflor, Km 32.5, San Lucas Sacatepéquez.\nÚltimo baile: 1:00 a. m.',
};
const GOOGLE_CALENDAR_URL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CALENDAR_EVENT.title)}&dates=${CALENDAR_EVENT.startUtc}/${CALENDAR_EVENT.endUtc}&details=${encodeURIComponent(CALENDAR_EVENT.description)}&location=${encodeURIComponent(CALENDAR_EVENT.location)}`;

function Asset({ src, alt, className = '' }) { return <img src={src} alt={alt} className={className} />; }

function getCount(searchParams, names, fallback = 0) {
    for (const name of names) {
        const parsed = Number.parseInt(searchParams.get(name) ?? '', 10);
        if (Number.isFinite(parsed) && parsed >= 0) return Math.min(parsed, 20);
    }
    return fallback;
}

function countDown() {
    const remaining = Math.max(0, WEDDING_DATE.getTime() - Date.now());
    return { days: Math.floor(remaining / 86400000), hours: Math.floor((remaining % 86400000) / 3600000), minutes: Math.floor((remaining % 3600000) / 60000), seconds: Math.floor((remaining % 60000) / 1000) };
}

function Countdown() {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => { const update = () => setTime(countDown()); update(); const interval = window.setInterval(update, 1000); return () => window.clearInterval(interval); }, []);
    const units = [['Días', time.days], ['Horas', time.hours], ['Minutos', time.minutes], ['Segundos', time.seconds]];
    return <div className="grid grid-cols-4 divide-x divide-[#777442]/35 text-center">{units.map(([label, value]) => <div key={label} className="px-1"><p className="text-2xl font-medium italic text-[#59602d]">{String(value).padStart(2, '0')}</p><p className="mt-2 text-[.47rem] font-medium uppercase tracking-[.16em] text-[#8b865d]">{label}</p></div>)}</div>;
}

function downloadCalendar() {
    const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Woowbe//Boda Flory y Elvis//ES', 'BEGIN:VEVENT', 'UID:flory-elvis-20261128@woowbe', 'DTSTAMP:20260924T000000Z', 'DTSTART:20261128T203000Z', 'DTEND:20261129T070000Z', 'SUMMARY:Boda de Flory y Elvis', `LOCATION:${CALENDAR_EVENT.location}`, `DESCRIPTION:${CALENDAR_EVENT.description.replace(/\n/g, '\\n')}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'boda-flory-y-elvis.ics'; document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function RsvpModal({ guestName, reservedSeats, close }) {
    const [answer, setAnswer] = useState('');
    const [names, setNames] = useState(() => Array.from({ length: reservedSeats }, (_, index) => index === 0 ? guestName : ''));
    const [submitting, setSubmitting] = useState(false); const [confirmed, setConfirmed] = useState(false); const [message, setMessage] = useState('');
    const options = [['misa', 'Solo a la ceremonia'], ['fiesta', 'Solo a la recepción'], ['ambas', 'A la ceremonia y recepción'], ['ninguna', 'No podré asistir']];
    const label = options.find(([value]) => value === answer)?.[1] ?? ''; const attending = answer && answer !== 'ninguna'; const confirmedNames = names.map((name) => name.trim()).filter(Boolean);
    const updateName = (index, value) => setNames((current) => current.map((name, nameIndex) => index === nameIndex ? value : name));
    const submit = async () => {
        if (!answer || submitting) return;
        if (attending && !confirmedNames.length) { setMessage('Escribe al menos el nombre de una persona que asistirá.'); return; }
        setMessage(''); setSubmitting(true);
        try {
            const response = await fetch('/api/registrarInvitado/registrar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ spreadsheetId: RSVP_SPREADSHEET_ID, range: RSVP_SHEET_RANGE, headers: RSVP_HEADERS, values: [guestName, label, confirmedNames.join(', ') || 'Sin asistentes', String(confirmedNames.length), String(reservedSeats), new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala', dateStyle: 'short', timeStyle: 'short' })] }) });
            if (!response.ok) throw new Error('No se pudo guardar la respuesta');
            setConfirmed(true);
        } catch (error) { console.error(error); setMessage('No pudimos guardar tu respuesta. Inténtalo nuevamente en unos momentos.'); } finally { setSubmitting(false); }
    };
    return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#222313]/65 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="flory-rsvp-title"><div className="relative max-h-[93svh] w-full max-w-[390px] overflow-y-auto rounded-[1.75rem] border border-[#777442]/35 bg-[#fffcf4] px-6 pb-8 pt-10 text-[#4e542d] shadow-2xl"><button type="button" onClick={close} className="absolute right-4 top-4 rounded-full p-2" aria-label="Cerrar"><X size={18} /></button>{confirmed ? <div className="py-6 text-center"><Check className="mx-auto h-12 w-12 rounded-full bg-[#687034] p-3 text-white" /><p className="mt-5 text-[.55rem] font-medium uppercase tracking-[.24em]">Respuesta registrada</p><h2 className="mt-3 text-2xl font-light italic">{label}</h2><p className="mx-auto mt-4 max-w-[250px] text-sm leading-relaxed">Gracias, {guestName}. Nos alegra celebrar este momento contigo.</p><button type="button" onClick={close} className="mt-8 rounded-full bg-[#687034] px-6 py-3 text-[.58rem] font-medium uppercase tracking-[.15em] text-white">Cerrar</button></div> : <div><p className="text-center text-[.55rem] font-medium uppercase tracking-[.27em] text-[#747344]">RSVP</p><h2 id="flory-rsvp-title" className="mt-3 text-center text-3xl font-light italic text-[#4e542d]">Confirma tu asistencia</h2><p className="mx-auto mt-4 max-w-[270px] text-center text-sm leading-relaxed">Hemos reservado <strong>{reservedSeats} {reservedSeats === 1 ? 'lugar' : 'lugares'}</strong> para ti.</p><fieldset className="mt-7"><legend className="mb-3 text-[.57rem] font-medium uppercase tracking-[.15em]">¿Cómo nos acompañarás?</legend><div className="divide-y divide-[#777442]/25 border-y border-[#777442]/25">{options.map(([value, option]) => <label key={value} className="flex cursor-pointer items-center gap-3 py-3 text-sm has-[:checked]:font-medium"><input type="radio" value={value} checked={answer === value} onChange={(event) => { setAnswer(event.target.value); setMessage(''); }} className="accent-[#687034]" />{option}</label>)}</div></fieldset>{attending && <div className="mt-7"><p className="text-[.57rem] font-medium uppercase tracking-[.15em]">Nombres de quienes asistirán</p><p className="mt-2 text-xs leading-relaxed text-[#747344]">Completa únicamente los lugares que utilizarán; los demás pueden quedar vacíos.</p><div className="mt-4 space-y-3">{names.map((name, index) => <input key={index} value={name} onChange={(event) => updateName(index, event.target.value)} placeholder={`Nombre de la persona ${index + 1}`} className="w-full border-b border-[#777442]/35 bg-transparent px-1 py-3 text-sm outline-none focus:border-[#59602d]" />)}</div></div>}{message && <p className="mt-4 text-center text-xs text-red-700">{message}</p>}<button type="button" disabled={!answer || submitting} onClick={submit} className="mt-8 w-full rounded-full bg-[#687034] px-5 py-3.5 text-[.58rem] font-medium uppercase tracking-[.16em] text-white transition hover:bg-[#4e542d] disabled:cursor-not-allowed disabled:opacity-45">{submitting ? 'Guardando…' : 'Confirmar'}</button><p className="mt-3 text-center text-xs leading-relaxed text-[#747344]">Tu respuesta se guardará en la lista de invitados.</p></div>}</div></div>;
}

function PaperStyle() { return <style jsx global>{`.fiora-paper { background-image: url('${PAPER_BACKGROUND}') !important; } .fiora-paper > section:nth-of-type(2) > div.absolute { display: none; } .fiora-paper > section:nth-of-type(2) { min-height: 940px; padding-top: 43rem; padding-bottom: 6rem; }`}</style>; }

function FioraCanvas({ reservation, rsvpOpen, setRsvpOpen }) {
    return <main className="min-h-screen bg-[#d9d4b0] font-[family-name:var(--font-josefin)] text-[#4e542d]"><div className="relative mx-auto w-full max-w-[430px] overflow-hidden shadow-[0_0_0_1px_rgba(74,79,37,.2),0_18px_70px_rgba(39,42,24,.28)]" style={{ aspectRatio: '4500 / 56000' }}><Asset src={PAPER_BACKGROUND} alt="Diseño de la boda de Flory y Elvis" className="absolute inset-0 h-full w-full" /><div className="absolute inset-x-0 top-[2.2%] px-7 text-center"><Asset src={ASSETS.logo} alt="Monograma de Flory y Elvis" className="mx-auto w-16" /><Asset src={ASSETS.names} alt="Flory y Elvis" className="mx-auto mt-5 w-60 max-w-full" /><p className="mt-6 text-[.47rem] font-medium uppercase tracking-[.22em] text-[#777442]">28 de noviembre de 2026</p></div><div className="absolute inset-x-0 top-[7.2%] px-8"><Countdown /></div><div className="absolute inset-x-0 top-[27.2%] px-7 text-center"><p className="text-[.44rem] font-medium uppercase tracking-[.25em] text-[#898368]">Con la bendición de nuestras madres</p><p className="mt-7 text-[.95rem] font-light italic leading-[1.8] tracking-[.15em] text-[#5c6331]">Flory Chitay Sor<br /><span className="inline-block py-1">&amp;</span><br />Aura Marina Ixcajoc Borrayo</p></div><div className="absolute inset-x-0 top-[47.5%] px-7 text-center"><Asset src={ASSETS.calendar} alt="Calendario de noviembre 2026" className="mx-auto w-36" /><a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-[.48rem] font-medium uppercase tracking-[.2em] text-[#59602d]">Guardar la fecha</a></div><div className="absolute inset-x-0 top-[55.2%] px-7 text-center"><Asset src={ASSETS.timeline} alt="Timeline de la boda" className="mx-auto h-40 max-w-full object-contain" /></div><div className="absolute inset-x-0 top-[63.2%] px-8 text-center"><Church className="mx-auto h-5 w-5 text-[#5d6331]" /><p className="mt-3 text-[.54rem] font-medium uppercase tracking-[.22em]">2:30 p. m.</p><p className="mt-2 text-[.77rem] font-light uppercase tracking-[.15em]">Iglesia El Calvario</p><p className="mt-2 text-[.56rem] font-light uppercase tracking-[.17em] text-[#898368]">Antigua Guatemala</p><a href={MASS_MAP} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 border-b border-[#59602d]/35 pb-1 text-[.47rem] font-medium uppercase tracking-[.14em]"><MapPin size={12} />Ver ubicación</a><div className="mx-auto my-8 h-px w-40 bg-[#6e7337]/30" /><PartyPopper className="mx-auto h-5 w-5 text-[#5d6331]" /><p className="mt-3 text-[.54rem] font-medium uppercase tracking-[.22em]">6:00 p. m.</p><p className="mt-2 text-[.77rem] font-light uppercase tracking-[.15em]">Jardín Vilaflor</p><p className="mt-2 text-[.56rem] font-light uppercase tracking-[.17em] text-[#898368]">Km 32.5, San Lucas Sacatepéquez</p><a href={RECEPTION_MAP} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 border-b border-[#59602d]/35 pb-1 text-[.47rem] font-medium uppercase tracking-[.14em]"><MapPin size={12} />Ver ubicación</a></div><div className="absolute inset-x-0 top-[86.3%] px-7 text-center"><Asset src={ASSETS.dress} alt="Vestimenta formal" className="mx-auto h-14 w-14 object-contain" /><p className="mt-3 text-[1.45rem] font-light italic text-[#51582a]">Formal</p><p className="mx-auto mt-3 max-w-[250px] text-[.48rem] font-medium uppercase leading-[2] tracking-[.15em]">El blanco y beige serán exclusivos de la novia.</p><Asset src={ASSETS.gifts} alt="Regalos" className="mx-auto mt-10 h-12 w-12 object-contain" /><p className="mx-auto mt-3 max-w-[265px] text-[.45rem] font-medium uppercase leading-[1.9] tracking-[.13em]">Celebrar este día contigo es nuestro mejor regalo.</p><div className="mt-4"><Asset src={ASSETS.button} alt="Mesa de regalos" className="mx-auto w-36" /></div></div></div><section className="mx-auto min-h-[720px] w-full max-w-[430px] bg-[#687034] px-7 py-24 text-center text-white shadow-[0_18px_70px_rgba(39,42,24,.28)]"><Asset src={ASSETS.bouquet} alt="Ramo de flores" className="mx-auto h-20 w-20 object-contain" /><p className="mt-10 text-[.6rem] font-medium uppercase tracking-[.32em]">Hemos reservado</p><p className="mt-7 text-5xl font-light italic">{reservation.seats}</p><p className="mt-5 text-[.7rem] font-medium uppercase tracking-[.22em]">{reservation.seats === 1 ? 'Lugar para ti' : 'Lugares para ti'}</p><p className="mt-5 text-[.58rem] font-light uppercase tracking-[.2em] text-[#f8f0cf]">Fecha límite para confirmar<br />6 de noviembre</p><button type="button" onClick={() => setRsvpOpen(true)} className="mt-12"><Asset src={ASSETS.button} alt="Confirmar asistencia" className="mx-auto w-48" /></button><div className="mx-auto mt-8 flex max-w-[240px] flex-col gap-3"><a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer" className="text-[.5rem] font-medium uppercase tracking-[.15em] text-[#f8f0cf]">Google Calendar</a><button type="button" onClick={downloadCalendar} className="text-[.5rem] font-medium uppercase tracking-[.15em] text-[#f8f0cf]">Calendario iPhone</button></div><p className="mx-auto mt-8 max-w-[250px] text-[.66rem] font-light italic leading-relaxed text-[#f8f0cf]">Para {reservation.guestName}</p></section>{rsvpOpen && <RsvpModal guestName={reservation.guestName} reservedSeats={reservation.seats} close={() => setRsvpOpen(false)} />}</main>;
}

function FioraCanvasV2({ reservation, rsvpOpen, setRsvpOpen }) {
    return <main className="min-h-screen bg-[#d9d4b0] font-[family-name:var(--font-josefin)] text-[#4e542d]"><div className="relative mx-auto w-full max-w-[430px] overflow-hidden shadow-[0_0_0_1px_rgba(74,79,37,.2),0_18px_70px_rgba(39,42,24,.28)]" style={{ aspectRatio: '4500 / 56000' }}><Asset src={PAPER_BACKGROUND} alt="Diseño de la boda de Flory y Elvis" className="absolute inset-0 h-full w-full" /><div className="absolute inset-x-0 top-[1.9%] px-7 text-center"><Asset src={ASSETS.logo} alt="Monograma de Flory y Elvis" className="mx-auto w-16" /><Asset src={ASSETS.names} alt="Flory y Elvis" className="mx-auto mt-6 w-60 max-w-full" /><p className="mt-6 text-[.47rem] font-medium uppercase tracking-[.22em] text-[#777442]">28 de noviembre de 2026</p><div className="mt-8"><Countdown /></div></div><div className="absolute inset-x-0 top-[26.2%] px-7 text-center"><Asset src={ASSETS.names} alt="Flory y Elvis" className="mx-auto w-64 max-w-full" /></div><div className="absolute inset-x-0 top-[29.3%] px-7 text-center"><p className="text-[.42rem] font-medium uppercase tracking-[.24em] text-[#898368]">Con la bendición de nuestras madres</p><p className="mt-6 text-[.86rem] font-light italic leading-[1.65] tracking-[.14em] text-[#5c6331]">Flory Chitay Sor<br /><span className="inline-block py-1">&amp;</span><br />Aura Marina Ixcajoc Borrayo</p></div><div className="absolute inset-x-0 top-[47.4%] px-7 text-center"><Asset src={ASSETS.calendar} alt="Calendario de noviembre 2026" className="mx-auto w-36" /><a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-[.48rem] font-medium uppercase tracking-[.2em] text-[#59602d]">Guardar la fecha</a></div><div className="absolute inset-x-0 top-[55.4%] px-7 text-center"><Asset src={ASSETS.timeline} alt="Timeline de la boda" className="mx-auto h-40 max-w-full object-contain" /></div><div className="absolute inset-x-0 top-[63.2%] px-8 text-center"><Church className="mx-auto h-5 w-5 text-[#5d6331]" /><p className="mt-3 text-[.54rem] font-medium uppercase tracking-[.22em]">2:30 p. m.</p><p className="mt-2 text-[.77rem] font-light uppercase tracking-[.15em]">Iglesia El Calvario</p><p className="mt-2 text-[.56rem] font-light uppercase tracking-[.17em] text-[#898368]">Antigua Guatemala</p><a href={MASS_MAP} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 border-b border-[#59602d]/35 pb-1 text-[.47rem] font-medium uppercase tracking-[.14em]"><MapPin size={12} />Ver ubicación</a><div className="mx-auto my-8 h-px w-40 bg-[#6e7337]/30" /><PartyPopper className="mx-auto h-5 w-5 text-[#5d6331]" /><p className="mt-3 text-[.54rem] font-medium uppercase tracking-[.22em]">6:00 p. m.</p><p className="mt-2 text-[.77rem] font-light uppercase tracking-[.15em]">Jardín Vilaflor</p><p className="mt-2 text-[.56rem] font-light uppercase tracking-[.17em] text-[#898368]">Km 32.5, San Lucas Sacatepéquez</p><a href={RECEPTION_MAP} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 border-b border-[#59602d]/35 pb-1 text-[.47rem] font-medium uppercase tracking-[.14em]"><MapPin size={12} />Ver ubicación</a></div><div className="absolute inset-x-0 top-[86.4%] px-7 text-center"><Asset src={ASSETS.dress} alt="Vestimenta formal" className="mx-auto h-14 w-14 object-contain" /><p className="mt-3 text-[1.45rem] font-light italic text-[#51582a]">Formal</p><p className="mx-auto mt-3 max-w-[250px] text-[.48rem] font-medium uppercase leading-[2] tracking-[.15em]">El blanco y beige serán exclusivos de la novia.</p><Asset src={ASSETS.gifts} alt="Regalos" className="mx-auto mt-10 h-12 w-12 object-contain" /><p className="mx-auto mt-3 max-w-[265px] text-[.45rem] font-medium uppercase leading-[1.9] tracking-[.13em]">Celebrar este día contigo es nuestro mejor regalo.</p><Asset src={ASSETS.button} alt="Mesa de regalos" className="mx-auto mt-4 w-36" /></div></div><section className="mx-auto min-h-[720px] w-full max-w-[430px] bg-[#687034] px-7 py-24 text-center text-white shadow-[0_18px_70px_rgba(39,42,24,.28)]"><Asset src={ASSETS.bouquet} alt="Ramo de flores" className="mx-auto h-20 w-20 object-contain" /><p className="mt-10 text-[.6rem] font-medium uppercase tracking-[.32em]">Hemos reservado</p><p className="mt-7 text-5xl font-light italic">{reservation.seats}</p><p className="mt-5 text-[.7rem] font-medium uppercase tracking-[.22em]">{reservation.seats === 1 ? 'Lugar para ti' : 'Lugares para ti'}</p><p className="mt-5 text-[.58rem] font-light uppercase tracking-[.2em] text-[#f8f0cf]">Fecha límite para confirmar<br />6 de noviembre</p><button type="button" onClick={() => setRsvpOpen(true)} className="mt-12"><Asset src={ASSETS.button} alt="Confirmar asistencia" className="mx-auto w-48" /></button><div className="mx-auto mt-8 flex max-w-[240px] flex-col gap-3"><a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer" className="text-[.5rem] font-medium uppercase tracking-[.15em] text-[#f8f0cf]">Google Calendar</a><button type="button" onClick={downloadCalendar} className="text-[.5rem] font-medium uppercase tracking-[.15em] text-[#f8f0cf]">Calendario iPhone</button></div><p className="mx-auto mt-8 max-w-[250px] text-[.66rem] font-light italic leading-relaxed text-[#f8f0cf]">Para {reservation.guestName}</p></section>{rsvpOpen && <RsvpModal guestName={reservation.guestName} reservedSeats={reservation.seats} close={() => setRsvpOpen(false)} />}</main>;
}

function FioraCanvasV3({ reservation, rsvpOpen, setRsvpOpen }) {
    return <div className="fiora-v3"><FioraCanvasV2 reservation={reservation} rsvpOpen={rsvpOpen} setRsvpOpen={setRsvpOpen} /><a href="https://www.cemaco.com/list/BodaBamacaIxcajocOsorioChitay28112026" target="_blank" rel="noreferrer" className="fiora-gift-link" aria-label="Abrir mesa de regalos en Cemaco">MESA DE REGALOS<br />HAZ CLIC AQUÍ</a><section className="fiora-rsvp-canvas"><Asset src={ASSETS.bouquet} alt="Ramo de flores" className="mx-auto h-10 w-10 object-contain" /><p className="mt-4 text-[.58rem] font-medium uppercase tracking-[.3em]">Hemos reservado</p><div className="mx-auto mt-3 grid h-14 w-14 place-items-center rounded-xl border-2 border-white text-3xl font-light italic">{reservation.seats}</div><p className="mt-3 text-[.63rem] font-medium uppercase tracking-[.24em]">{reservation.seats === 1 ? 'Lugar para ti' : 'Lugares para ti'}</p><p className="mt-3 text-[.5rem] font-light uppercase leading-[1.7] tracking-[.18em]">Fecha límite para confirmar<br /><strong>6 de noviembre</strong></p><button type="button" onClick={() => setRsvpOpen(true)} className="mt-5 h-14 w-48 bg-contain bg-center bg-no-repeat text-[.52rem] font-medium uppercase tracking-[.18em] text-white" style={{ backgroundImage: `url(${ASSETS.button})` }}>Confirmar</button></section><footer className="fiora-footer"><p>Design by woowbegt.com</p><div><a href="https://www.facebook.com/WoowBeGT/" target="_blank" rel="noreferrer" aria-label="Facebook de Woowbe" className="fiora-social fiora-facebook" /><a href="https://www.instagram.com/woowbe?stkn=MTU3d2ZoNHJzYzNuZg%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Instagram de Woowbe" className="fiora-social fiora-instagram" /><a href="https://www.tiktok.com/@woowbegt?_r=1&_t=ZS-99gwzQMoXW0" target="_blank" rel="noreferrer" aria-label="TikTok de Woowbe" className="fiora-social fiora-tiktok" /></div></footer><style jsx global>{`
        main > div.relative > div:nth-of-type(1) > img:nth-of-type(2),
        main > div.relative > div:nth-of-type(1) > p,
        main > div.relative > div:nth-of-type(1) > div { display: none; }
        main > div.relative > div:nth-of-type(1) > img:first-of-type { width: 5.5rem !important; }
        main > div.relative > div:nth-of-type(2) { top: 23.9% !important; }
        main > div.relative > div:nth-of-type(3) { top: 27% !important; }
        main > div.relative > div:nth-of-type(4) { top: 41.2% !important; }
        main > div.relative > div:nth-of-type(4) > img { width: 10rem !important; }
        main > div.relative > div:nth-of-type(5) {
            top: 47.5% !important;
            height: 12.2%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        main > div.relative > div:nth-of-type(5) > img {
            width: 100% !important;
            height: 100% !important;
            max-width: 23rem;
        }
        main > div.relative > div:nth-of-type(6) { top: 60.2% !important; }
        main > div.relative > div:nth-of-type(6) > svg:first-of-type,
        main > div.relative > div:nth-of-type(6) > svg:nth-of-type(2) {
            width: 3.45rem !important;
            height: 3.45rem !important;
            margin-right: auto;
            margin-left: auto;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
        }
        main > div.relative > div:nth-of-type(6) > svg:first-of-type {
            background-image: url('https://res.cloudinary.com/dclzsvu62/image/upload/v1790266201/iglesia_fftqse.webp');
        }
        main > div.relative > div:nth-of-type(6) > svg:nth-of-type(2) {
            background-image: url('https://res.cloudinary.com/dclzsvu62/image/upload/v1790266202/ramo_tp9gge.webp');
        }
        main > div.relative > div:nth-of-type(6) > svg:first-of-type *,
        main > div.relative > div:nth-of-type(6) > svg:nth-of-type(2) * { display: none; }
        main > div.relative > div:nth-of-type(6) a > svg { display: none; }
        main > div.relative > div:nth-of-type(6) a::before {
            content: '';
            display: inline-block;
            width: .95rem;
            height: .95rem;
            background: currentColor;
            -webkit-mask: url('https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/brand-waze.svg') center / contain no-repeat;
            mask: url('https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/brand-waze.svg') center / contain no-repeat;
        }
        main > div.relative > div:nth-of-type(6) > p:nth-of-type(1),
        main > div.relative > div:nth-of-type(6) > p:nth-of-type(4) {
            font-size: .62rem !important;
            letter-spacing: .25em !important;
        }
        main > div.relative > div:nth-of-type(6) > p:nth-of-type(2),
        main > div.relative > div:nth-of-type(6) > p:nth-of-type(5) {
            font-size: .98rem !important;
            letter-spacing: .17em !important;
        }
        main > div.relative > div:nth-of-type(6) > p:nth-of-type(3),
        main > div.relative > div:nth-of-type(6) > p:nth-of-type(6) {
            font-size: .66rem !important;
            letter-spacing: .19em !important;
        }
        main > div.relative > div:nth-of-type(6) > a {
            font-size: .55rem !important;
            letter-spacing: .16em !important;
        }
        main > div.relative > div:nth-of-type(7) { top: 80.1% !important; }
        main > div.relative > div:nth-of-type(7) > img:first-of-type {
            width: 5rem !important;
            height: 5rem !important;
            margin-top: .85rem !important;
            transform: translateY(.45rem);
        }
        main > div.relative > div:nth-of-type(7) > p:nth-of-type(2)::before {
            content: 'PARA ESTE DÍA ESPECIAL';
            display: block;
            margin-bottom: .6rem;
            color: #898368;
            font-weight: 300;
            font-size: .52rem;
            letter-spacing: .2em;
        }
        main > div.relative > div:nth-of-type(7) > p:first-of-type {
            font-size: 0 !important;
            margin-top: .25rem !important;
        }
        main > div.relative > div:nth-of-type(7) > p:first-of-type::after {
            content: '';
            display: block;
            width: 7.5rem;
            height: 6.2rem;
            margin: 0 auto;
            background: url('https://res.cloudinary.com/dclzsvu62/image/upload/v1790266201/Formal_b86oqh.webp') center / contain no-repeat;
        }
        main > div.relative > div:nth-of-type(7) > p:nth-of-type(2) {
            margin-top: .2rem !important;
            font-size: .55rem !important;
            font-weight: 500 !important;
            line-height: 2.1 !important;
            letter-spacing: .17em !important;
            color: #343719 !important;
        }
        main > div.relative > div:nth-of-type(7) > img:nth-of-type(2) {
            width: 4.1rem !important;
            height: 4.1rem !important;
            margin-top: 1.55rem !important;
        }
        main > div.relative > div:nth-of-type(7) > p:nth-of-type(3) {
            margin-top: .55rem !important;
            font-size: .48rem !important;
            font-weight: 500 !important;
            line-height: 1.85 !important;
            letter-spacing: .13em !important;
            color: #343719 !important;
        }
        main > div.relative > div:nth-of-type(7) > p:nth-of-type(3)::after {
            content: ' SI DESEAS TENER UN DETALLE CON NOSOTROS, PUEDES ENCONTRAR NUESTRA MESA DE REGALOS AQUÍ.';
            display: block;
            margin-top: .6rem;
            color: #898368;
            font-weight: 300;
            line-height: 1.8;
            letter-spacing: .14em;
        }
        main > div.relative > div:nth-of-type(7) > img:nth-of-type(3) { display: none; }
        main > div.relative > div:nth-of-type(7)::after {
            content: 'MESA DE REGALOS\\A HAZ CLIC AQUÍ';
            display: grid;
            width: 11.5rem;
            height: 4.15rem;
            margin: 1.4rem auto 0;
            place-items: center;
            background: url('https://res.cloudinary.com/dclzsvu62/image/upload/v1790266207/boto_ün_bfqwjg.webp') center / contain no-repeat;
            color: #fffdf5;
            padding: 0 2.3rem;
            color: #fffdf5;
            font-size: .42rem;
            font-weight: 500;
            line-height: 1.35;
            letter-spacing: .12em;
            text-align: center;
            white-space: pre-line;
        }
        .fiora-v3 main > div.relative > div:nth-of-type(7)::after { display: none; }
        main > div.relative > div:nth-of-type(4) > a {
            position: relative;
            display: block;
            width: 10.75rem;
            height: 3.75rem;
            margin: 1.2rem auto 0;
            background: url('https://res.cloudinary.com/dclzsvu62/image/upload/v1790266207/boto_ün_bfqwjg.webp') center / contain no-repeat;
            color: transparent;
        }
        main > div.relative > div:nth-of-type(4) > a::after {
            content: 'SAVE THE DATE';
            position: absolute;
            inset: 0;
            display: grid;
            place-items: center;
            color: #fffdf5;
            font-size: .48rem;
            font-weight: 500;
            letter-spacing: .2em;
        }
        main > div.relative > div:nth-of-type(1)::after {
            content: 'Nos uniremos en matrimonio para que nuestras vidas, nuestros corazones y nuestro futuro sean uno solo y nuestro amor sea eterno.';
            position: absolute;
            top: 11rem;
            left: 50%;
            width: min(340px, calc(100vw - 3rem));
            transform: translateX(-50%);
            color: #77725d;
            font-size: 1.1rem;
            font-style: italic;
            font-weight: 300;
            line-height: 1.85;
            letter-spacing: .13em;
        }
        .fiora-v3 {
            position: relative;
            width: 100%;
            max-width: 430px;
            margin: 0 auto;
        }
        .fiora-v3 > main > section { display: none; }
        .fiora-gift-link {
            position: absolute;
            top: 89.55%;
            left: 50%;
            z-index: 3;
            display: grid;
            box-sizing: border-box;
            width: 11.5rem;
            height: 4.15rem;
            transform: translateX(-50%);
            padding: 0;
            background: url('https://res.cloudinary.com/dclzsvu62/image/upload/v1790266207/boto_ün_bfqwjg.webp') center / contain no-repeat;
            color: #fffdf5;
            font-size: 0;
            font-weight: 500;
            letter-spacing: .1em;
            line-height: 1;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
        }
        .fiora-gift-link::after {
            content: 'MESA DE REGALOS\A HAZ CLIC AQUÍ';
            display: block;
            place-self: center;
            color: #fffdf5;
            font-size: .4rem;
            font-weight: 500;
            line-height: 1.45;
            letter-spacing: .1em;
            text-align: center;
            white-space: pre-line;
            transform: translateY(-.35rem);
        }
        .fiora-rsvp-canvas {
            position: absolute;
            top: 93.05%;
            left: 50%;
            z-index: 2;
            width: min(100%, 430px);
            transform: translateX(-50%);
            color: #fffdf5;
            text-align: center;
        }
        .fiora-rsvp-canvas > img { display: none; }
        .fiora-rsvp-canvas > div {
            display: flex !important;
            align-items: center;
            justify-content: center;
            padding: 0 !important;
            line-height: 1;
            text-align: center;
        }
        .fiora-footer {
            position: absolute;
            top: 99.1%;
            left: 50%;
            z-index: 3;
            width: min(100%, 430px);
            height: 3rem;
            transform: translateX(-50%);
            color: #263044;
            text-align: center;
        }
        .fiora-footer p {
            margin: .22rem 0 .1rem;
            font-size: .44rem;
            font-weight: 500;
            letter-spacing: .28em;
        }
        .fiora-footer > div { display: flex; justify-content: center; gap: 1rem; }
        .fiora-social {
            display: inline-block;
            width: 1.25rem;
            height: 1.25rem;
            background: #111;
            transition: transform .18s ease, opacity .18s ease;
        }
        .fiora-social:hover { transform: translateY(-2px); opacity: .72; }
        .fiora-facebook { -webkit-mask: url('https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/brand-facebook.svg') center / contain no-repeat; mask: url('https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/brand-facebook.svg') center / contain no-repeat; }
        .fiora-instagram { -webkit-mask: url('https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/brand-instagram.svg') center / contain no-repeat; mask: url('https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/brand-instagram.svg') center / contain no-repeat; }
        .fiora-tiktok { -webkit-mask: url('https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/brand-tiktok.svg') center / contain no-repeat; mask: url('https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/brand-tiktok.svg') center / contain no-repeat; }
        button[aria-label='Silenciar música'],
        button[aria-label='Activar música'] {
            width: 2.8rem;
            height: 2.8rem;
            padding: 0;
            justify-content: center;
            gap: 0;
            font-size: 0;
        }
        button[aria-label='Silenciar música'] svg,
        button[aria-label='Activar música'] svg {
            width: 1.1rem;
            height: 1.1rem;
        }
    `}</style></div>;
}

function SectionHeading({ eyebrow, children }) { return <><PaperStyle /><header className="text-center"><p className="text-[.52rem] font-medium uppercase tracking-[.32em] text-[#86815a]">{eyebrow}</p><h2 className="mt-3 text-[2rem] font-light italic leading-tight text-[#51582a]">{children}</h2><div className="mx-auto mt-5 h-px w-14 bg-[#6e7337]/55" /></header></>; }

function InvitacionFloryElvis() {
    const searchParams = useSearchParams(); const [opened, setOpened] = useState(false); const [rsvpOpen, setRsvpOpen] = useState(false); const [soundOn, setSoundOn] = useState(true); const audioRef = useRef(null);
    const reservation = useMemo(() => { const directSeats = getCount(searchParams, ['invitados', 'lugares', 'cantidad', 'personas'], 0); const adults = getCount(searchParams, ['adultos', 'adultosInvitados'], 1); const kids = getCount(searchParams, ['ninos', 'niños'], 0); const guestName = searchParams.get('nombre')?.trim() || searchParams.get('invitado')?.trim() || 'familia invitada'; return { guestName, seats: Math.max(1, directSeats || adults + kids) }; }, [searchParams]);
    const playMusic = () => { const audio = audioRef.current; if (!audio) return; audio.play().then(() => setSoundOn(true)).catch(() => setSoundOn(false)); };
    const toggleMusic = () => { const audio = audioRef.current; if (!audio) return; if (audio.paused) { playMusic(); } else { audio.pause(); setSoundOn(false); } };
    useEffect(() => { const audio = new Audio('/cancion_boda_flor.mp3'); audio.loop = true; audio.preload = 'auto'; audio.volume = .55; audioRef.current = audio; playMusic(); return () => { audio.pause(); audioRef.current = null; }; }, []);
    const openInvitation = () => { playMusic(); setOpened(true); window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0); };
    if (opened) return <><FioraCanvasV3 reservation={reservation} rsvpOpen={rsvpOpen} setRsvpOpen={setRsvpOpen} /><button type="button" onClick={toggleMusic} className="fixed bottom-4 right-4 z-[70] inline-flex items-center gap-2 rounded-full bg-[#4f5528]/90 px-4 py-3 text-[.52rem] font-medium uppercase tracking-[.14em] text-white shadow-lg backdrop-blur" aria-label={soundOn ? 'Silenciar música' : 'Activar música'}>{soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}{soundOn ? 'Silenciar' : 'Música'}</button></>;
    if (!opened) return <main className="min-h-screen bg-[#272817] font-[family-name:var(--font-josefin)]"><button type="button" onClick={openInvitation} className="relative mx-auto flex min-h-[100svh] w-full max-w-[430px] items-center justify-center overflow-hidden text-white shadow-[0_0_0_1px_rgba(255,248,232,.15),0_18px_70px_rgba(0,0,0,.35)]" aria-label="Abrir invitación de Flory y Elvis"><Asset src={ASSETS.cover} alt="Invitación de Flory y Elvis" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-[#1e2113]/15" /><p className="absolute bottom-12 left-1/2 w-52 -translate-x-1/2 text-[.55rem] font-medium uppercase tracking-[.24em] text-[#fff8e8]">Toca para abrir</p></button></main>;
    return <main className="min-h-screen bg-[#d9d4b0] font-[family-name:var(--font-josefin)] text-[#4e542d]"><style jsx global>{`.fiora-paper { background-color: #fdfaf1; background-image: linear-gradient(rgba(255,252,244,.87), rgba(255,252,244,.91)), url('${PAPER_BACKGROUND}'); background-repeat: no-repeat; background-position: center top; background-size: 100% auto; }`}</style><div className="fiora-paper mx-auto w-full max-w-[430px] overflow-hidden shadow-[0_0_0_1px_rgba(74,79,37,.2),0_18px_70px_rgba(39,42,24,.28)]"><section className="relative flex min-h-[690px] flex-col items-center justify-center px-7 py-24 text-center"><Asset src={ASSETS.logo} alt="Monograma de Flory y Elvis" className="w-28" /><p className="mx-auto mt-12 max-w-[285px] text-[1.04rem] font-light italic leading-[1.85] tracking-[.13em] text-[#77725d]">Nos uniremos en matrimonio para que nuestras vidas, nuestros corazones y nuestro futuro sean uno solo y nuestro amor sea eterno.</p><Asset src={ASSETS.names} alt="Flory y Elvis" className="mt-16 w-72 max-w-full" /></section><section className="relative min-h-[760px] overflow-hidden px-7 py-24 text-center"><div className="absolute inset-x-0 bottom-0 h-[58%] bg-[url('/fondo_boda_fiora.png')] bg-[length:100%_auto] bg-[position:center_18%] opacity-95" /><div className="relative"><p className="text-[.49rem] font-medium uppercase tracking-[.28em] text-[#8d8769]">Con la bendición de nuestras madres</p><p className="mt-14 text-[1.12rem] font-light italic leading-[1.85] tracking-[.17em] text-[#5c6331]">Flory Chitay Sor<br /><span className="inline-block py-1">&amp;</span><br />Aura Marina Ixcajoc Borrayo</p></div></section><section className="relative min-h-[790px] px-7 py-24 text-center"><SectionHeading eyebrow="28 de noviembre de 2026">Nuestro gran día</SectionHeading><div className="mt-14"><Countdown /></div><Asset src={ASSETS.timeline} alt="Horario de la boda" className="mx-auto mt-16 h-44 w-auto max-w-full object-contain" /><div className="mt-10 space-y-10"><div><Church className="mx-auto h-6 w-6 text-[#626936]" /><p className="mt-4 text-[.58rem] font-medium uppercase tracking-[.23em]">2:30 p. m.</p><p className="mt-3 text-[.86rem] font-light uppercase tracking-[.16em]">Iglesia El Calvario</p><p className="mt-2 text-[.66rem] font-light uppercase tracking-[.16em] text-[#8d8769]">Antigua Guatemala</p><a href={MASS_MAP} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 border-b border-[#59602d]/35 pb-1 text-[.54rem] font-medium uppercase tracking-[.14em]"><MapPin size={13} />Ver ubicación</a></div><div className="border-t border-[#6e7337]/25 pt-10"><PartyPopper className="mx-auto h-6 w-6 text-[#626936]" /><p className="mt-4 text-[.58rem] font-medium uppercase tracking-[.23em]">6:00 p. m.</p><p className="mt-3 text-[.86rem] font-light uppercase tracking-[.16em]">Jardín Vilaflor</p><p className="mt-2 text-[.66rem] font-light uppercase tracking-[.16em] text-[#8d8769]">Km 32.5, San Lucas Sacatepéquez</p><a href={RECEPTION_MAP} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 border-b border-[#59602d]/35 pb-1 text-[.54rem] font-medium uppercase tracking-[.14em]"><MapPin size={13} />Ver ubicación</a></div><p className="text-[.6rem] font-medium uppercase tracking-[.22em] text-[#666c35]">1:00 a. m. · Último baile</p></div></section><section className="relative min-h-[640px] overflow-hidden bg-[#687034] px-7 py-24 text-center text-white"><Asset src={ASSETS.calendar} alt="Calendario de noviembre 2026" className="mx-auto w-44 max-w-full" /><p className="mt-10 text-[.52rem] font-medium uppercase tracking-[.26em] text-[#f8f0cf]">Save the date</p><h2 className="mt-3 text-3xl font-light italic">Guarda la fecha</h2><div className="mx-auto mt-10 flex max-w-[270px] flex-col gap-3"><a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#fffcf4] px-5 py-3.5 text-[.58rem] font-medium uppercase tracking-[.15em] text-[#59602d]"><CalendarDays size={16} />Google Calendar</a><button type="button" onClick={downloadCalendar} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#f7e8b4]/70 px-5 py-3.5 text-[.58rem] font-medium uppercase tracking-[.15em]"><Download size={16} />Calendario iPhone</button></div></section><section className="relative min-h-[880px] px-7 py-24 text-center"><Asset src={ASSETS.dress} alt="Código de vestimenta" className="mx-auto h-44 w-44 object-contain" /><SectionHeading eyebrow="Código de vestimenta">Formal</SectionHeading><p className="mx-auto mt-7 max-w-[270px] text-[.71rem] font-medium uppercase leading-[2] tracking-[.19em]">Para este día especial, el blanco y beige serán exclusivos de la novia.</p><div className="mx-auto mt-16 h-px w-20 bg-[#6e7337]/35" /><Asset src={ASSETS.gifts} alt="Regalos" className="mx-auto mt-12 h-16 w-16 object-contain" /><p className="mx-auto mt-7 max-w-[280px] text-[.69rem] font-medium uppercase leading-[2] tracking-[.15em]">Celebrar este día contigo es nuestro mejor regalo.<br /><span className="font-light text-[#8d8769]">Si deseas tener un gesto con nosotros, podrás encontrar nuestra mesa de regalos aquí.</span></p><div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#6e7337]/55 px-5 py-3 text-[.56rem] font-medium uppercase tracking-[.17em] text-[#59602d]"><Gift size={15} />Mesa de regalos</div></section><section className="relative min-h-[760px] overflow-hidden bg-[#687034] px-7 py-24 text-center text-white"><Asset src={ASSETS.bouquet} alt="Ramo de flores" className="mx-auto h-20 w-20 object-contain" /><p className="mt-10 text-[.6rem] font-medium uppercase tracking-[.32em]">Hemos reservado</p><p className="mt-7 text-5xl font-light italic">{reservation.seats}</p><p className="mt-5 text-[.7rem] font-medium uppercase tracking-[.22em]">{reservation.seats === 1 ? 'Lugar para ti' : 'Lugares para ti'}</p><p className="mt-5 text-[.58rem] font-light uppercase tracking-[.2em] text-[#f8f0cf]">Fecha límite para confirmar<br />6 de noviembre</p><button type="button" onClick={() => setRsvpOpen(true)} className="mt-12 inline-flex items-center gap-2 rounded-full border border-[#f8e8b3]/80 bg-[#747849] px-7 py-4 text-[.58rem] font-medium uppercase tracking-[.18em] shadow-lg"><Heart size={15} />Confirmar</button><p className="mx-auto mt-8 max-w-[250px] text-[.66rem] font-light italic leading-relaxed text-[#f8f0cf]">Para {reservation.guestName}</p></section><footer className="bg-[#fffcf4] px-6 py-6 text-center text-[.48rem] font-medium uppercase tracking-[.22em] text-[#777442]">Flory &amp; Elvis · 28 de noviembre de 2026</footer></div>{rsvpOpen && <RsvpModal guestName={reservation.guestName} reservedSeats={reservation.seats} close={() => setRsvpOpen(false)} />}</main>;
}

export default function Page() {
    return <Suspense><InvitacionFloryElvis /></Suspense>;
}
