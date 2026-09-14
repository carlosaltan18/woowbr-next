'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarPlus, Check, ChevronDown, ChevronUp, Church, MapPin, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { BrandWaze, BrandTiktok, BrandInstagram } from 'tabler-icons-react';

const ASSETS = {
    maps: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266701/maps_ltlcmu.webp',
    church: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266701/iglesialogo_urlkzy.webp',
    name: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266701/MARCE_dk6xe2.webp',
    daisy: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266702/margarita_mhgros.webp',
    miniDaisy: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266702/margaritamini_gclz5f.webp',
    largeDaisy: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266702/margaritacompleta_rreyc3.webp',
    butterflies: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266702/MARIPOSASPORTADA_i8hjkx.webp',
    branch: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266702/ramita_p4xssh.webp',
    gift: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266703/regalo_tbir1i.webp',
    dressCode: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266722/dresscode_dl2z32.webp',
    discoStars: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266723/esfera_con_estrellas_kdwces.webp',
    angel: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266723/Angel_inicio_bpp7ce.webp',
    dancer: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266723/bailarina_zrnjor.webp',
    discoBall: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266724/boladisco_deygk1.webp',
    record: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266726/Disco_anhjtj.webp',
    calendar: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789266725/calendario_lpye9e.webp'
};

const PAPER = '/invitacio%CC%81n%20Liz-03.jpeg';
const MASS_MAP = 'https://www.google.com/maps/place/Museo+San+Juan+del+Obispo/@14.5236716,-90.7273266,740m/data=!3m2!1e3!4b1!4m6!3m5!1s0x85890e4e81cfd825:0xa98bde7eab0f548e!8m2!3d14.5236716!4d-90.7273266!16s%2Fg%2F11fx9n3jhf?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D';
const MASS_WAZE = 'https://waze.com/ul/h9fx6x7ymn';
const RECEPTION_MAP = 'https://www.google.com/maps/place/Hotel+Soleil+La+Antigua/@14.551486,-90.739967,740m/data=!3m2!1e3!4b1!4m9!3m8!1s0x85890e12036b50d5:0x628096f623aa6ba!5m2!4m1!1i2!8m2!3d14.551486!4d-90.739967!16s%2Fg%2F1tf_1djq?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D';
const RECEPTION_WAZE = 'https://waze.com/ul/h9fx6z1j1n';

const RSVP_SPREADSHEET_ID = '10RjOcKzxa950Gftr1aO_EW3jUCIQJqWnWhlh_4rlCKA';
// Cambiamos el rango hasta la H para incluir la nueva columna de niños
const RSVP_SHEET_RANGE = 'Hoja 1!A:H'; 
const RSVP_HEADERS = [
    'Nombre confirmado',
    'Asistencia',
    'Tipo de invitado',
    'Fecha de registro',
    'Invitado principal',
    'Adultos asignados',
    'Niños asignados',
    'Ubicación asignada',
];

const CALENDAR_EVENT = {
    title: 'XV Años de Marce',
    startUtc: '20261031T213000Z',
    endUtc: '20261101T023000Z',
    startLocal: '20261031T153000',
    endLocal: '20261031T203000',
    location: 'Capilla del Museo San Juan del Obispo, Antigua Guatemala',
    description: 'Ceremonia: 3:30 p. m.\nRecepción: Hotel Soleil, Salón Los Volcanes, Antigua Guatemala.',
};
const GOOGLE_CALENDAR_URL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CALENDAR_EVENT.title)}&dates=${CALENDAR_EVENT.startUtc}/${CALENDAR_EVENT.endUtc}&details=${encodeURIComponent(CALENDAR_EVENT.description)}&location=${encodeURIComponent(CALENDAR_EVENT.location)}`;

function getFirstParam(params, keys, fallback) {
    for (const key of keys) {
        const value = params.get(key)?.trim();
        if (value) return value;
    }
    return fallback;
}

function getSeatAssignments(params, adultCount, kidsCount, defaultLocation) {
    const customValues = [
        ...params.getAll('asignacion'),
        ...params.getAll('asignaciones').flatMap((value) => value.split(';')),
    ];
    let remainingAdults = adultCount;
    let remainingKids = kidsCount;
    const assignments = [];

    customValues.forEach((value) => {
        const [rawType, rawCount, rawLocation = '', rawNames = ''] = value.split('|').map((part) => part.trim());
        const type = rawType?.toLocaleLowerCase('es') ?? '';
        const category = type.includes('niñ') || type.includes('nin') ? 'kids' : 'adults';
        const requestedCount = Number.parseInt(rawCount, 10);
        const available = category === 'kids' ? remainingKids : remainingAdults;
        const count = Math.min(Number.isFinite(requestedCount) ? requestedCount : 0, available);
        const location = rawLocation.trim();
        const names = rawNames.split(';').map((name) => name.trim()).filter(Boolean).slice(0, count);

        if (!count || !location) return;
        assignments.push({ category, count, location, names });
        if (category === 'kids') remainingKids -= count;
        else remainingAdults -= count;
    });

    const kidsLocation = getFirstParam(params, ['ubicacionNinos', 'ubicacionNiños', 'ubicacion_ninos', 'ubicacion_niños'], defaultLocation);
    if (remainingAdults > 0) assignments.push({ category: 'adults', count: remainingAdults, location: defaultLocation, names: [] });
    if (remainingKids > 0) assignments.push({ category: 'kids', count: remainingKids, location: kidsLocation, names: [] });
    return assignments;
}

function assignmentLabel({ category, count }) {
    const person = category === 'kids' ? 'niño' : 'adulto';
    return `${count} ${count === 1 ? person : `${person}s`}`;
}

function SeatAssignments({ assignments }) {
    return <ul className="mt-4 space-y-2 text-left">{assignments.map((assignment, index) => <li key={`${assignment.category}-${assignment.location}-${index}`} className="flex items-center gap-3 rounded-xl border border-[#a98a09]/20 bg-white/75 px-3 py-2.5"><MapPin size={16} className="shrink-0 text-[#a48700]" /><span className="min-w-0 flex-1 text-sm font-semibold text-[#625409]">{assignmentLabel(assignment)}</span><span className="max-w-[48%] text-right text-sm leading-snug text-[#796600]">{assignment.location}</span></li>)}</ul>;
}

function remainingTime() {
    const milliseconds = Math.max(0, new Date('2026-10-31T15:30:00-06:00').getTime() - Date.now());
    return {
        days: Math.floor(milliseconds / 86400000),
        hours: Math.floor((milliseconds % 86400000) / 3600000),
        minutes: Math.floor((milliseconds % 3600000) / 60000),
        seconds: Math.floor((milliseconds % 60000) / 1000),
    };
}

function twoDigits(value) {
    return String(value).padStart(2, '0');
}

function Asset({ src, alt = '', className = '' }) {
    return <img src={src} alt={alt} draggable="false" className={className} />;
}

function FloatingAsset({ src, alt = '', className = '', imageClassName = '', movement = 'xv-float' }) {
    return <div className={`pointer-events-none absolute ${movement} ${className}`}><Asset src={src} alt={alt} className={`h-full w-full object-contain ${imageClassName}`} /></div>;
}

function PaperSection({ children, className = '', pink = false, id }) {
    return (
        <section
            id={id}
            className={`relative isolate overflow-hidden px-6 text-center ${className}`}
            style={{ backgroundColor: pink ? 'rgba(255, 241, 236, .22)' : 'rgba(255, 249, 184, .1)' }}
        >
            {children}
        </section>
    );
}

function MapLinks({ map, waze, label }) {
    return <div className="relative z-20 mt-5 flex items-center justify-center gap-6"><a href={waze} target="_blank" rel="noreferrer" aria-label={`Abrir ${label} en Waze`} className="rounded-full p-1 transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#978000]"><BrandWaze size={32} className="text-black" /></a><a href={map} target="_blank" rel="noreferrer" aria-label={`Abrir ${label} en Google Maps`} className="rounded-full p-1 transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#978000]"><Asset src={ASSETS.maps} alt="Google Maps" className="h-8 w-8" /></a></div>;
}

function Countdown() {
    const [time, setTime] = useState(remainingTime);
    useEffect(() => {
        const interval = window.setInterval(() => setTime(remainingTime()), 1000);
        return () => window.clearInterval(interval);
    }, []);
    const segments = [
        { value: time.days, label: 'Días' },
        { value: time.hours, label: 'Horas' },
        { value: time.minutes, label: 'Minutos' },
        { value: time.seconds, label: 'Segundos' },
    ];

    return <div className="mx-auto flex max-w-[350px] items-start justify-center gap-1 text-[#9b8500]" aria-label={`Cuenta regresiva: ${time.days} días, ${time.hours} horas, ${time.minutes} minutos y ${time.seconds} segundos`}>{segments.map((segment, index) => <React.Fragment key={segment.label}><div className="flex min-w-[3.5rem] flex-col items-center"><span className="text-[clamp(2rem,9vw,3.1rem)] font-medium leading-none tracking-[.08em]">{twoDigits(segment.value)}</span><span className="mt-2 text-[.52rem] font-semibold uppercase tracking-[.15em]">{segment.label}</span></div>{index < segments.length - 1 && <span className="mt-0.5 text-[clamp(1.5rem,7vw,2.4rem)] font-medium leading-none">:</span>}</React.Fragment>)}</div>;
}

function escapeIcsValue(value) {
    return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function SaveTheDate() {
    const [showOptions, setShowOptions] = useState(false);

    const downloadIcs = () => {
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Woowbe//XV Marce//ES',
            'CALSCALE:GREGORIAN',
            'BEGIN:VEVENT',
            'UID:xv-marce-20261031@woowbegt.com',
            'DTSTAMP:20260913T000000Z',
            `DTSTART;TZID=America/Guatemala:${CALENDAR_EVENT.startLocal}`,
            `DTEND;TZID=America/Guatemala:${CALENDAR_EVENT.endLocal}`,
            `SUMMARY:${escapeIcsValue(CALENDAR_EVENT.title)}`,
            `LOCATION:${escapeIcsValue(CALENDAR_EVENT.location)}`,
            `DESCRIPTION:${escapeIcsValue(CALENDAR_EVENT.description)}`,
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\r\n');
        const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'xv-anos-marce.ics';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 0);
        setShowOptions(false);
    };

    return <div className="relative mx-auto mt-7 w-fit"><button type="button" onClick={() => setShowOptions((current) => !current)} aria-expanded={showOptions} aria-controls="save-the-date-options" className="inline-flex items-center gap-2 rounded-full border border-[#a88705]/60 bg-[#fff7c4]/80 px-5 py-3 text-[.64rem] font-semibold uppercase tracking-[.18em] text-[#8d7500] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fff1a3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d7500]"><CalendarPlus size={16} />Save the date<ChevronDown size={15} className={`transition ${showOptions ? 'rotate-180' : ''}`} /></button>{showOptions && <div id="save-the-date-options" className="absolute left-1/2 z-30 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-[#b3951a]/35 bg-[#fffbea] p-1.5 text-left shadow-xl"><a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer" onClick={() => setShowOptions(false)} className="block rounded-lg px-4 py-3 text-[.66rem] font-semibold uppercase tracking-[.12em] text-[#806b00] transition hover:bg-[#fff0a5]">Google Calendar</a><button type="button" onClick={downloadIcs} className="block w-full rounded-lg px-4 py-3 text-left text-[.66rem] font-semibold uppercase tracking-[.12em] text-[#806b00] transition hover:bg-[#fff0a5]">Calendario de iPhone</button></div>}</div>;
}

function LegacyAttendanceModal({ close, guestName, adultCount, kidsCount, assignedLocation }) {
    const [submitted, setSubmitted] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [saved, setSaved] = useState(false);
    
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ 
        defaultValues: { 
            asistencia: 'si', 
            adultos: Array.from({ length: adultCount }, (_, index) => (index === 0 ? guestName : '')),
            ninos: Array.from({ length: kidsCount }, () => '')
        } 
    });
    
    const attending = watch('asistencia') !== 'no';
    
    // Este texto solo se usa visualmente para el usuario en la invitación
    const getReservaText = () => {
        let texto = [];
        if (adultCount > 0) texto.push(`${adultCount} ${adultCount === 1 ? 'adulto' : 'adultos'}`);
        if (kidsCount > 0) texto.push(`${kidsCount} ${kidsCount === 1 ? 'niño' : 'niños'}`);
        return texto.join(' y ');
    };

    const onSubmit = async (data) => {
        const willAttend = data.asistencia === 'si';
        let recordsToSave = [];
        
        if (willAttend) {
            data.adultos.forEach(name => {
                const trimmedName = name.trim();
                if (trimmedName) recordsToSave.push({ name: trimmedName, type: 'Adulto' });
            });
            data.ninos.forEach(name => {
                const trimmedName = name.trim();
                if (trimmedName) recordsToSave.push({ name: trimmedName, type: 'Niño' });
            });
        } else {
            recordsToSave.push({ name: guestName, type: 'Principal' });
        }
        
        try {
            for (const person of recordsToSave) {
                const response = await fetch('/api/registrarInvitado/registrar', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ 
                        spreadsheetId: RSVP_SPREADSHEET_ID, 
                        range: RSVP_SHEET_RANGE, 
                        headers: RSVP_HEADERS, 
                        values: [
                            person.name, 
                            willAttend ? 'Asistiré a ceremonia y recepción' : 'No podré asistir', 
                            person.type, 
                            new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala', dateStyle: 'short', timeStyle: 'short' }), 
                            guestName, 
                            adultCount, // Columna F: Solo el número de adultos
                            kidsCount,  // Columna G: Solo el número de niños
                            assignedLocation // Columna H: Ubicación
                        ] 
                    }) 
                });
                if (!response.ok) throw new Error('No se pudo guardar la confirmación');
            }
            setSaved(true);
            toast.success('Tu respuesta fue registrada. ¡Gracias!');
        } catch (error) {
            console.error(error);
            toast.error('No pudimos guardar tu respuesta en este momento.');
        } finally {
            setAccepted(willAttend);
            setSubmitted(true);
        }
    };

    return <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#262313]/55 p-3 backdrop-blur-[2px] sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="attendance-title"><div className="relative max-h-[92svh] w-full max-w-[430px] overflow-y-auto rounded-[2rem] border border-[#b29420]/30 bg-[#fffbea] px-5 pb-7 pt-10 text-[#796600] shadow-2xl sm:px-7"><button type="button" onClick={close} aria-label="Cerrar formulario" className="absolute right-4 top-4 rounded-full p-2 text-[#796600] transition hover:bg-[#f7e8a4]"><X size={20} /></button>{submitted ? <div className="py-5 text-center"><Check className="mx-auto mb-4 h-11 w-11 rounded-full bg-[#9b8500] p-2 text-white" />{accepted ? <><p className="text-[.66rem] font-semibold uppercase tracking-[.28em]">Tu ubicación asignada</p><p className="mt-4 text-2xl font-semibold leading-snug text-[#66590a]">{assignedLocation}</p><p className="mx-auto mt-5 max-w-[270px] text-sm leading-relaxed text-[#736423]">Te esperamos para celebrar juntos este día tan especial.</p></> : <><p className="text-xl font-semibold text-[#66590a]">Gracias por avisarnos.</p><p className="mx-auto mt-4 max-w-[270px] text-sm leading-relaxed text-[#736423]">Guardamos tu respuesta. Te extrañaremos en esta celebración.</p></>}{!saved && <p className="mx-auto mt-5 max-w-[290px] text-xs leading-relaxed text-[#736423]">Tu ubicación permanece visible aunque no haya sido posible enviar el registro.</p>}<button type="button" onClick={close} className="mt-7 rounded-xl bg-[#9b8500] px-6 py-3 text-[.68rem] font-semibold uppercase tracking-[.15em] text-white">Cerrar</button></div> : <form onSubmit={handleSubmit(onSubmit)}><p className="text-center text-[.66rem] font-semibold uppercase tracking-[.3em]">RSVP</p><h2 id="attendance-title" className="mt-3 text-center text-2xl font-semibold text-[#66590a]">Confirma tu asistencia</h2><p className="mx-auto mt-3 max-w-[290px] text-center text-sm leading-relaxed text-[#736423]">Esta invitación está reservada para <strong>{getReservaText()}</strong>.</p><fieldset className="mt-6"><legend className="text-sm font-semibold text-[#66590a]">¿Podrán acompañarnos?</legend><div className="mt-3 grid grid-cols-2 gap-2"><label className="cursor-pointer rounded-xl border border-[#9b8500]/35 bg-white px-3 py-3 text-center text-sm has-[:checked]:border-[#9b8500] has-[:checked]:bg-[#fff0a9]"><input type="radio" value="si" className="sr-only" {...register('asistencia', { required: true })} />Sí, asistiré</label><label className="cursor-pointer rounded-xl border border-[#9b8500]/35 bg-white px-3 py-3 text-center text-sm has-[:checked]:border-[#9b8500] has-[:checked]:bg-[#fff0a9]"><input type="radio" value="no" className="sr-only" {...register('asistencia', { required: true })} />No podré asistir</label></div></fieldset>
    
    {attending && <div className="mt-6 space-y-5">
        {adultCount > 0 && (
            <div className="space-y-3">
                <p className="text-sm font-semibold text-[#66590a]">Nombres de los adultos</p>
                {Array.from({ length: adultCount }, (_, index) => <div key={`adult-${index}`}><label htmlFor={`adult-${index}`} className="sr-only">{`Nombre del adulto ${index + 1}`}</label><input id={`adult-${index}`} type="text" autoComplete="name" placeholder={`Nombre del adulto ${index + 1}`} className="w-full rounded-xl border border-[#9b8500]/30 bg-white px-4 py-3 text-sm text-[#51470a] outline-none placeholder:text-[#a79959] focus:border-[#9b8500] focus:ring-2 focus:ring-[#e8ce69]" {...register(`adultos.${index}`, { required: 'Escribe el nombre de cada adulto.' })} />{errors.adultos?.[index] && <p className="mt-1 text-xs text-red-700">{errors.adultos[index].message}</p>}</div>)}
            </div>
        )}
        
        {kidsCount > 0 && (
            <div className="space-y-3">
                <p className="text-sm font-semibold text-[#66590a]">Nombres de los niños</p>
                {Array.from({ length: kidsCount }, (_, index) => <div key={`kid-${index}`}><label htmlFor={`kid-${index}`} className="sr-only">{`Nombre del niño ${index + 1}`}</label><input id={`kid-${index}`} type="text" autoComplete="name" placeholder={`Nombre del niño ${index + 1}`} className="w-full rounded-xl border border-[#9b8500]/30 bg-white px-4 py-3 text-sm text-[#51470a] outline-none placeholder:text-[#a79959] focus:border-[#9b8500] focus:ring-2 focus:ring-[#e8ce69]" {...register(`ninos.${index}`, { required: 'Escribe el nombre de cada niño.' })} />{errors.ninos?.[index] && <p className="mt-1 text-xs text-red-700">{errors.ninos[index].message}</p>}</div>)}
            </div>
        )}
    </div>}
    
    <button type="submit" disabled={isSubmitting} className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#aa7800] via-[#d8a714] to-[#aa7800] px-5 py-4 text-[.68rem] font-semibold uppercase tracking-[.16em] text-[#fff9d0] shadow-[0_8px_18px_rgba(127,86,0,.22)] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? 'Guardando...' : 'Enviar confirmación'}</button></form>}</div></div>;
}

function AttendeeNameFields({ category, assignments, register }) {
    const fieldName = category === 'kids' ? 'ninos' : 'adultos';
    const personLabel = category === 'kids' ? 'niño' : 'adulto';
    let startIndex = 0;

    return <div className="space-y-5">{assignments.filter((assignment) => assignment.category === category).map((assignment, groupIndex) => {
        const groupStart = startIndex;
        startIndex += assignment.count;
        return <section key={`${category}-${assignment.location}-${groupIndex}`} className="rounded-xl border border-[#a98a09]/20 bg-white/55 p-3"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[#66590a]">{assignmentLabel(assignment)}</p><span className="max-w-[62%] rounded-full border border-[#a98a09]/25 bg-[#fff4ba] px-2.5 py-1 text-right text-[.61rem] font-semibold uppercase leading-snug tracking-[.1em] text-[#806b00]">Área: {assignment.location}</span></div><div className="mt-3 space-y-2.5">{Array.from({ length: assignment.count }, (_, index) => {
            const fieldIndex = groupStart + index;
            const assignedName = assignment.names?.[index];
            return <div key={fieldIndex}>{assignedName && <p className="mb-1.5 text-xs font-semibold text-[#66590a]">{assignedName}</p>}<label htmlFor={`${fieldName}-${fieldIndex}`} className="sr-only">{`Nombre del ${personLabel} ${fieldIndex + 1}`}</label><input id={`${fieldName}-${fieldIndex}`} type="text" autoComplete="name" placeholder={`Nombre del ${personLabel} ${fieldIndex + 1}`} className="w-full rounded-xl border border-[#9b8500]/30 bg-white px-4 py-3 text-sm text-[#51470a] outline-none placeholder:text-[#a79959] focus:border-[#9b8500] focus:ring-2 focus:ring-[#e8ce69]" {...register(`${fieldName}.${fieldIndex}`)} /></div>;
        })}</div></section>;
    })}</div>;
}

function AttendanceModal({ close, guestName, adultCount, kidsCount, assignedLocation, seatAssignments }) {
    const [submitted, setSubmitted] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [saved, setSaved] = useState(false);
    const namesFor = (category, fallbackName = '') => seatAssignments.filter((assignment) => assignment.category === category).flatMap((assignment) => Array.from({ length: assignment.count }, (_, index) => assignment.names?.[index] || '')).map((name, index) => name || (index === 0 ? fallbackName : ''));
    const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm({
        defaultValues: {
            asistencia: 'si',
            adultos: namesFor('adults', guestName),
            ninos: namesFor('kids'),
        },
    });
    const attending = watch('asistencia') !== 'no';
    const reservationText = [
        adultCount > 0 && `${adultCount} ${adultCount === 1 ? 'adulto' : 'adultos'}`,
        kidsCount > 0 && `${kidsCount} ${kidsCount === 1 ? 'niño' : 'niños'}`,
    ].filter(Boolean).join(' y ');

    const locationFor = (category, index) => {
        let completed = 0;
        for (const assignment of seatAssignments) {
            if (assignment.category !== category) continue;
            if (index < completed + assignment.count) return assignment.location;
            completed += assignment.count;
        }
        return assignedLocation;
    };

    const onSubmit = async (data) => {
        const willAttend = data.asistencia === 'si';
        const recordsToSave = willAttend ? [
            ...data.adultos.map((name, index) => ({ name: name.trim(), type: 'Adulto', location: locationFor('adults', index) })),
            ...data.ninos.map((name, index) => ({ name: name.trim(), type: 'Niño', location: locationFor('kids', index) })),
        ].filter((person) => person.name) : [{ name: guestName, type: 'Principal', location: seatAssignments.map((assignment) => assignment.location).join(' · ') || assignedLocation }];

        if (willAttend && recordsToSave.length === 0) {
            toast.error('Escribe al menos un nombre para confirmar la asistencia.');
            return;
        }

        try {
            for (const person of recordsToSave) {
                const response = await fetch('/api/registrarInvitado/registrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        spreadsheetId: RSVP_SPREADSHEET_ID,
                        range: RSVP_SHEET_RANGE,
                        headers: RSVP_HEADERS,
                        values: [person.name, willAttend ? 'Asistiré a ceremonia y recepción' : 'No podré asistir', person.type, new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala', dateStyle: 'short', timeStyle: 'short' }), guestName, adultCount, kidsCount, person.location],
                    }),
                });
                if (!response.ok) throw new Error('No se pudo guardar la confirmación');
            }
            setSaved(true);
            toast.success('Tu respuesta fue registrada. ¡Gracias!');
        } catch (error) {
            console.error(error);
            toast.error('No pudimos guardar tu respuesta en este momento.');
        } finally {
            setAccepted(willAttend);
            setSubmitted(true);
        }
    };

    return <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#262313]/55 p-3 backdrop-blur-[2px] sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="attendance-title"><div className="relative max-h-[92svh] w-full max-w-[430px] overflow-y-auto rounded-[2rem] border border-[#b29420]/30 bg-[#fffbea] px-5 pb-7 pt-10 text-[#796600] shadow-2xl sm:px-7"><button type="button" onClick={close} aria-label="Cerrar formulario" className="absolute right-4 top-4 rounded-full p-2 text-[#796600] transition hover:bg-[#f7e8a4]"><X size={20} /></button>{submitted ? <div className="py-5 text-center"><Check className="mx-auto mb-4 h-11 w-11 rounded-full bg-[#9b8500] p-2 text-white" />{accepted ? <><p className="text-[.66rem] font-semibold uppercase tracking-[.28em]">Tus ubicaciones asignadas</p><SeatAssignments assignments={seatAssignments} /><p className="mx-auto mt-5 max-w-[270px] text-sm leading-relaxed text-[#736423]">Te esperamos para celebrar juntos este día tan especial.</p></> : <><p className="text-xl font-semibold text-[#66590a]">Gracias por avisarnos.</p><p className="mx-auto mt-4 max-w-[270px] text-sm leading-relaxed text-[#736423]">Guardamos tu respuesta. Te extrañaremos en esta celebración.</p></>}{!saved && <p className="mx-auto mt-5 max-w-[290px] text-xs leading-relaxed text-[#736423]">Tu ubicación permanece visible aunque no haya sido posible enviar el registro.</p>}<button type="button" onClick={close} className="mt-7 rounded-xl bg-[#9b8500] px-6 py-3 text-[.68rem] font-semibold uppercase tracking-[.15em] text-white">Cerrar</button></div> : <form onSubmit={handleSubmit(onSubmit)}><p className="text-center text-[.66rem] font-semibold uppercase tracking-[.3em]">RSVP</p><h2 id="attendance-title" className="mt-3 text-center text-2xl font-semibold text-[#66590a]">Confirma tu asistencia</h2><p className="mx-auto mt-3 max-w-[290px] text-center text-sm leading-relaxed text-[#736423]">Esta invitación está reservada para <strong>{reservationText}</strong>.</p><div className="mt-5"><p className="text-center text-[.63rem] font-semibold uppercase tracking-[.2em] text-[#806b00]">Distribución de lugares</p><SeatAssignments assignments={seatAssignments} /></div><fieldset className="mt-6"><legend className="text-sm font-semibold text-[#66590a]">¿Podrán acompañarnos?</legend><div className="mt-3 grid grid-cols-2 gap-2"><label className="cursor-pointer rounded-xl border border-[#9b8500]/35 bg-white px-3 py-3 text-center text-sm has-[:checked]:border-[#9b8500] has-[:checked]:bg-[#fff0a9]"><input type="radio" value="si" className="sr-only" {...register('asistencia', { required: true })} />Sí, asistiré</label><label className="cursor-pointer rounded-xl border border-[#9b8500]/35 bg-white px-3 py-3 text-center text-sm has-[:checked]:border-[#9b8500] has-[:checked]:bg-[#fff0a9]"><input type="radio" value="no" className="sr-only" {...register('asistencia', { required: true })} />No podré asistir</label></div></fieldset>{attending && <div className="mt-6 space-y-5">{adultCount > 0 && <div><p className="mb-1 text-sm font-semibold text-[#66590a]">Nombres de los adultos</p><p className="mb-3 text-xs leading-relaxed text-[#806b00]">Completa únicamente los nombres de quienes asistirán.</p><AttendeeNameFields category="adults" assignments={seatAssignments} register={register} /></div>}{kidsCount > 0 && <div><p className="mb-1 text-sm font-semibold text-[#66590a]">Nombres de los niños</p><p className="mb-3 text-xs leading-relaxed text-[#806b00]">Completa únicamente los nombres de quienes asistirán.</p><AttendeeNameFields category="kids" assignments={seatAssignments} register={register} /></div>}</div>}<button type="submit" disabled={isSubmitting} className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#aa7800] via-[#d8a714] to-[#aa7800] px-5 py-4 text-[.68rem] font-semibold uppercase tracking-[.16em] text-[#fff9d0] shadow-[0_8px_18px_rgba(127,86,0,.22)] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? 'Guardando...' : 'Enviar confirmación'}</button></form>}</div></div>;
}

export function InvitacionXVLiz() {
    const searchParams = useSearchParams();
    const contentRef = useRef(null);
    const musicRef = useRef(null);
    const coverTouchStartRef = useRef(0);
    const [opened, setOpened] = useState(false);
    const [rsvpOpen, setRsvpOpen] = useState(false);
    const [musicMuted, setMusicMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    const invitation = useMemo(() => {
        const rawAdults = getFirstParam(searchParams, ['adultos', 'cantidadAdultos', 'cantidad-adultos', 'cantidad_de_adultos'], '1');
        const rawKids = getFirstParam(searchParams, ['ninos', 'niños', 'cantidadNinos'], '0');
        const parsedAdults = Number.parseInt(rawAdults, 10);
        const parsedKids = Number.parseInt(rawKids, 10);
        const adultCount = Number.isFinite(parsedAdults) ? Math.min(Math.max(parsedAdults, 0), 20) : 1;
        const kidsCount = Number.isFinite(parsedKids) ? Math.min(Math.max(parsedKids, 0), 20) : 0;
        const assignedLocation = getFirstParam(searchParams, ['ubicacion', 'ubicación', 'locacion', 'locación', 'lugar'], 'Área Lounge');
        return {
            guestName: getFirstParam(searchParams, ['invitado', 'nombre', 'para', 'familia'], 'Familia invitada'),
            adultCount,
            kidsCount,
            assignedLocation,
            seatAssignments: getSeatAssignments(searchParams, adultCount, kidsCount, assignedLocation),
        };
    }, [searchParams]);

    useEffect(() => {
        if (!opened) return undefined;
        const update = () => { const total = document.documentElement.scrollHeight - window.innerHeight; setProgress(total > 0 ? Math.min(100, window.scrollY / total * 100) : 0); };
        update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update);
    }, [opened]);

    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;
        music.muted = musicMuted;
        if (opened && !musicMuted) music.play().catch(() => { });
    }, [opened, musicMuted]);

    const playMusicFromGesture = () => {
        const music = musicRef.current;
        if (!music || musicMuted) return;
        music.muted = false;
        music.play().catch(() => { });
    };

    const open = () => {
        setOpened(true);
        playMusicFromGesture();
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const handleCoverTouchStart = (event) => {
        coverTouchStartRef.current = event.touches[0]?.clientY ?? 0;
        playMusicFromGesture();
    };

    const handleCoverTouchEnd = (event) => {
        const endPosition = event.changedTouches[0]?.clientY ?? 0;
        if (coverTouchStartRef.current - endPosition > 42) open();
    };

    const toggleMusic = () => {
        const nextMuted = !musicMuted;
        setMusicMuted(nextMuted);
        if (!nextMuted) musicRef.current?.play().catch(() => { });
    };

    return (
        <main className="min-h-screen bg-[#252525] font-[family-name:var(--font-josefin)] text-[#9a8300]">
            <style jsx global>{` 
                .xv-content-paper { position: relative; background-color: #d7d6ab; background-image: url('${PAPER}'); background-position: center top; background-size: 100% 100%; background-repeat: no-repeat; } 
                @keyframes xvBob { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -7px, 0); } } 
                .xv-bob { animation: xvBob 4.8s ease-in-out infinite; } 
                .xv-straight-ball { transform-origin: 50%; transform: rotate(20deg); } 
                @media (prefers-reduced-motion: reduce) { .xv-bob { animation: none; } } 
            `}</style>

            <Toaster position="top-center" />
            <audio ref={musicRef} src="/musica_xv_liz.mp3" loop preload="auto" playsInline />

            {opened && (
                <button type="button" onClick={toggleMusic} aria-label={musicMuted ? 'Activar música' : 'Silenciar música'} aria-pressed={musicMuted} className="fixed bottom-5 right-5 z-[60] grid h-9 w-9 place-items-center rounded-full border border-[#a7860b]/45 bg-[#fff8cd]/85 text-[#8d7500] shadow-md backdrop-blur transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d7500]">
                    {musicMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
            )}

            {opened && (
                <div className="fixed left-1/2 top-0 z-50 h-1.5 w-full max-w-[480px] -translate-x-1/2 bg-black/15">
                    <div className="h-full bg-[#9b8500]" style={{ width: `${progress}%` }} />
                </div>
            )}

            <div className="xv-paper mx-auto max-w-[480px] overflow-hidden shadow-[0_0_0_10px_#1d1d1d,0_0_40px_rgba(0,0,0,.55)]">
                {!opened && (
                    <button type="button" onClick={open} onTouchStart={handleCoverTouchStart} onTouchEnd={handleCoverTouchEnd} aria-label="Abrir invitación de los quince años de Marce" className="relative block min-h-svh w-full overflow-hidden focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#9b8500]" style={{ backgroundColor: '#f8efa6', backgroundImage: `linear-gradient(rgba(255, 246, 165, .22), rgba(255, 246, 165, .22)), url('${PAPER}')`, backgroundPosition: 'center top', backgroundSize: '100% auto', backgroundRepeat: 'no-repeat' }}>
                        <FloatingAsset src={ASSETS.daisy} className="-left-2 top-12 h-32 w-32" movement="xv-sway" imageClassName="-rotate-[12deg]" />
                        <FloatingAsset src={ASSETS.branch} className="left-[35%] top-16 h-16 w-28" movement="xv-sway-reverse" imageClassName="rotate-[9deg]" />
                        <FloatingAsset src={ASSETS.butterflies} className="right-[-86%] -top-[15%] h-[84%] w-[104%]" movement="xv-drift" imageClassName="origin-top-right scale-[1.45]" />
                        <FloatingAsset src={ASSETS.miniDaisy} className="right-[19%] top-11 h-10 w-10" movement="xv-float" />
                        <FloatingAsset src={ASSETS.branch} className="-left-2 top-[30%] h-24 w-32" movement="xv-sway" imageClassName="rotate-[72deg]" />
                        <FloatingAsset src={ASSETS.daisy} className="-left-11 bottom-6 h-40 w-44" movement="xv-float" imageClassName="rotate-[8deg]" />

                        <div className="relative z-10 flex min-h-svh flex-col items-center justify-center pb-[12%]">
                            <div className="xv-bob relative top-14 mb-10 h-36 w-36">
                                <Asset src={ASSETS.discoBall} alt="Esfera disco" className="xv-straight-ball h-full w-full object-contain" />
                            </div>
                            <Asset src={ASSETS.name} alt="Marce" className="w-[74%] max-w-[310px]" />
                            <p className="relative -top-40 mt-8 text-[clamp(.9rem,4.2vw,1.16rem)] font-medium italic tracking-[.7em]">MIS XV AÑOS</p>
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center text-[#8f7700]">
                            <ChevronUp className="h-7 w-7 animate-bounce" strokeWidth={1.7} />
                            <span className="mt-1 text-[.56rem] font-semibold uppercase tracking-[.22em]">Toca o desliza para abrir</span>
                        </div>
                    </button>
                )}

                {opened && (
                    <div ref={contentRef} className="xv-content-paper">
                        <PaperSection className="min-h-[700px] pt-20">
                            <FloatingAsset src={ASSETS.branch} className="-left-3 top-8 h-20 w-32" movement="xv-sway" imageClassName="rotate-[18deg]" />
                            <FloatingAsset src={ASSETS.angel} className="left-[24%] top-20 h-40 w-40" movement="xv-float" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="left-[56%] top-12 h-9 w-9" movement="xv-float-delayed" />
                            <Sparkles className="pointer-events-none absolute right-28 top-[4.5rem] h-9 w-9 text-white" fill="white" strokeWidth={0} />
                            <Sparkles className="pointer-events-none absolute right-16 top-24 h-10 w-10 text-white" fill="white" strokeWidth={0} />
                            <FloatingAsset src={ASSETS.record} className="-right-20 -top-4 h-40 w-40 opacity-90" movement="xv-drift" />
                            <FloatingAsset src={ASSETS.branch} className="-right-10 top-32 h-24 w-36" movement="xv-sway-reverse" imageClassName="rotate-[18deg]" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="-left-4 top-52 h-10 w-10" movement="xv-float" />
                            <FloatingAsset src={ASSETS.largeDaisy} className="-right-16 top-[35%] h-64 w-64" movement="xv-float" />
                            <FloatingAsset src={ASSETS.daisy} className="left-14 bottom-32 h-32 w-32" movement="xv-float-delayed" />
                            <FloatingAsset src={ASSETS.branch} className="left-[49%] bottom-36 h-20 w-32" movement="xv-sway" imageClassName="rotate-[28deg]" />
                            <FloatingAsset src={ASSETS.discoBall} className="-left-16 bottom-0 h-44 w-44 opacity-45" movement="xv-bob" imageClassName="xv-straight-ball" />
                            <Sparkles className="pointer-events-none absolute bottom-14 right-16 h-10 w-10 text-white" fill="white" strokeWidth={0} />

                            <div className="relative z-10 ml-0 mr-auto mt-52 max-w-[290px]">
                                <p className="text-[.67rem] font-bold uppercase tracking-[.1em]">Porque Dios así lo quiso</p>
                                <p className="mt-9 text-[.89rem] font-medium italic leading-[1.4]">Hoy celebro el milagro de la vida<br />con un corazón lleno de gratitud.<br /><br />Gracias Dios, por nunca soltar mi mano,<br />por cuidar de mí,<br />iluminar mi camino<br />y bendecirme cada día bajo el amparo<br />de la Santísima Virgen María.</p>
                            </div>
                        </PaperSection>

                        <PaperSection className="min-h-[1200px] pt-0">
                            <FloatingAsset src={ASSETS.daisy} className="left-[49%] top-16 h-28 w-28" movement="xv-float" />
                            <FloatingAsset src={ASSETS.branch} className="-left-8 top-[32%] h-24 w-36" movement="xv-sway" imageClassName="rotate-[55deg]" />
                            <FloatingAsset src={ASSETS.discoBall} className="-right-40 top-[30%] h-52 w-52 opacity-50" movement="xv-bob" imageClassName="xv-straight-ball" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="left-12 top-[27%] h-9 w-9" movement="xv-float-delayed" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="right-7 top-[31%] h-9 w-9" movement="xv-float" />
                            <Sparkles className="pointer-events-none absolute left-9 top-[22%] h-10 w-10 text-white" fill="white" strokeWidth={0} />
                            <Sparkles className="pointer-events-none absolute right-10 top-[51%] h-10 w-10 text-white" fill="white" strokeWidth={0} />

                            <div className="relative z-10 pt-32">
                                <Countdown />
                                <Asset src={ASSETS.calendar} alt="Agenda en tu calendario" className="mx-auto mt-24 w-40" />
                                <p className="mt-12 text-[.72rem] font-semibold uppercase tracking-[.38em]">31 de octubre de 2026</p>
                                <SaveTheDate />
                            </div>

                            <div className="relative z-10 mt-48 min-h-[430px]">
                                <FloatingAsset src={ASSETS.dancer} className="-left-36 -top-44 h-[42rem] w-[22rem]" imageClassName="object-left" movement="xv-float" />
                                <FloatingAsset src={ASSETS.miniDaisy} className="left-32 -top-6 h-10 w-10" movement="xv-float-delayed" />
                                <FloatingAsset src={ASSETS.daisy} className="right-12 top-0 h-32 w-32" movement="xv-float-delayed" />

                                <div className="absolute right-0 top-40 z-10 flex w-[72%] flex-col items-center">
                                    <p className="whitespace-nowrap text-center text-[.66rem] font-semibold uppercase tracking-[.23em]">Con la bendición de mis padres</p>
                                    <p className="mt-5 whitespace-nowrap text-center text-[1.05rem] font-semibold italic leading-[2.35]">Juan Carlos Morales Díaz<br />Liz Echeverría de Morales</p>
                                </div>

                                <FloatingAsset src={ASSETS.branch} className="right-0 bottom-24 h-24 w-36" movement="xv-sway-reverse" imageClassName="rotate-[14deg]" />
                                <FloatingAsset src={ASSETS.miniDaisy} className="left-32 bottom-24 h-9 w-9" movement="xv-float" />
                            </div>
                        </PaperSection>

                        <PaperSection className="min-h-[910px] pt-12">
                            <FloatingAsset src={ASSETS.daisy} className="-left-8 top-[47%] h-36 w-40" movement="xv-float" />
                            <FloatingAsset src={ASSETS.branch} className="-right-8 bottom-24 h-24 w-36" movement="xv-sway-reverse" imageClassName="rotate-[20deg]" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="right-8 top-48 h-9 w-9" movement="xv-float" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="left-12 bottom-14 h-10 w-10" movement="xv-float-delayed" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="left-8 top-24 h-9 w-9" movement="xv-float-delayed" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="right-12 top-[31%] h-9 w-9" movement="xv-float" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="right-8 bottom-40 h-10 w-10" movement="xv-float-delayed" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="left-16 bottom-52 h-9 w-9" movement="xv-float" />
                            <Sparkles className="pointer-events-none absolute left-7 top-[18%] h-9 w-9 text-white" fill="white" strokeWidth={0} />
                            <Sparkles className="pointer-events-none absolute right-8 top-[12%] h-10 w-10 text-white" fill="white" strokeWidth={0} />
                            <Sparkles className="pointer-events-none absolute left-10 bottom-[31%] h-10 w-10 text-white" fill="white" strokeWidth={0} />
                            <Sparkles className="pointer-events-none absolute right-10 bottom-20 h-9 w-9 text-white" fill="white" strokeWidth={0} />
                            <div className="relative z-10">
                                <Asset src={ASSETS.discoStars} alt="Esfera disco decorativa" className="mx-auto w-40" />
                                <p className="mx-auto mt-10 max-w-[315px] text-[.95rem] font-semibold uppercase leading-[1.45] tracking-[.22em]">Una mención especial<br />para mi hermanito Emilio,<br />que también con su acompañamiento<br />y cariño hace este día<br />aún más especial.</p>
                                <div className="mt-28">
                                    <Asset src={ASSETS.church} alt="Capilla" className="mx-auto h-20 w-20 object-contain" />
                                    <p className="mx-auto mt-16 max-w-[280px] text-[.75rem] font-semibold uppercase leading-[1.55] tracking-[.22em]">Capilla del Museo<br />San Juan del Obispo,<br />Antigua Guatemala<br /><span className="tracking-[.12em]">3:30 p.m.</span></p>
                                    <MapLinks map={MASS_MAP} waze={MASS_WAZE} label="la capilla" />
                                </div>
                            </div>
                        </PaperSection>

                        <PaperSection className="min-h-[1030px] pt-20">
                            <FloatingAsset src={ASSETS.largeDaisy} className="-right-8 -top-5 h-52 w-52" movement="xv-float" />
                            <FloatingAsset src={ASSETS.daisy} className="-left-8 top-44 h-[8.5rem] w-[8.5rem]" movement="xv-float-delayed" />
                            <FloatingAsset src={ASSETS.branch} className="-left-5 bottom-[25%] h-24 w-32" movement="xv-sway" imageClassName="-rotate-[17deg]" />
                            <FloatingAsset src={ASSETS.discoBall} className="-right-16 bottom-[33%] h-40 w-40 opacity-50" movement="xv-bob" imageClassName="xv-straight-ball" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="left-11 top-28 h-9 w-9" movement="xv-float" />
                            <div className="relative z-10">
                                <div className="xv-bob mx-auto h-24 w-24">
                                    <Asset src={ASSETS.discoBall} alt="Esfera disco decorativa" className="xv-straight-ball h-full w-full object-contain" />
                                </div>
                                <p className="mx-auto mt-6 max-w-[280px] text-[.75rem] font-semibold uppercase leading-[1.7] tracking-[.22em]">Hotel Soleil,<br />Salón Los Volcanes<br />9na calle Poniente,<br />Antigua Guatemala<br /><span className="tracking-[.12em]">5:30 p.m.</span></p>
                                <MapLinks map={RECEPTION_MAP} waze={RECEPTION_WAZE} label="la recepción" />
                            </div>
                            <div className="relative z-10 mt-40">
                                <p className="text-[.93rem] font-medium uppercase tracking-[.55em]">Dress code</p>
                                <Asset src={ASSETS.dressCode} alt="Vestimenta formal" className="mx-auto mt-9 w-[10.5rem] max-w-[50%]" />
                                <p className="mt-10 text-[.9rem] font-medium uppercase tracking-[.52em]">Reservemos</p>
                                <div className="mt-8 flex justify-center gap-6" aria-label="Colores reservados">
                                    <span className="h-8 w-8 rounded-full border border-[#3f3a12] bg-[#fde26e]" />
                                    <span className="h-8 w-8 rounded-full border border-[#3f3a12] bg-[#fb8cac]" />
                                    <span className="h-8 w-8 rounded-full border border-[#c89d12] bg-gradient-to-r from-[#d7a715] to-[#f9d957]" />
                                </div>
                                <p className="mt-7 text-[.6rem] font-semibold uppercase tracking-[.35em]">Estos colores<br />para nuestra quinceañera</p>
                            </div>
                        </PaperSection>

                        <PaperSection id="rsvp" pink className="min-h-[1080px] pt-12">
                            <FloatingAsset src={ASSETS.branch} className="-left-10 top-[64%] h-28 w-36" movement="xv-sway" imageClassName="-rotate-[18deg]" />
                            <FloatingAsset src={ASSETS.circles} className="-right-20 top-72 h-48 w-48 opacity-40" movement="xv-drift" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="right-9 top-52 h-10 w-10" movement="xv-float" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="left-8 bottom-32 h-10 w-10" movement="xv-float-delayed" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="left-8 top-28 h-9 w-9" movement="xv-float-delayed" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="left-10 top-[37%] h-10 w-10" movement="xv-float" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="right-7 top-[49%] h-9 w-9" movement="xv-float-delayed" />
                            <FloatingAsset src={ASSETS.miniDaisy} className="right-12 bottom-20 h-10 w-10" movement="xv-float" />
                            <Sparkles className="pointer-events-none absolute left-8 top-[18%] h-9 w-9 text-white" fill="white" strokeWidth={0} />
                            <Sparkles className="pointer-events-none absolute right-10 top-[27%] h-10 w-10 text-white" fill="white" strokeWidth={0} />
                            <Sparkles className="pointer-events-none absolute left-7 top-[48%] h-10 w-10 text-white" fill="white" strokeWidth={0} />
                            <Sparkles className="pointer-events-none absolute right-8 bottom-[27%] h-9 w-9 text-white" fill="white" strokeWidth={0} />
                            <div className="relative z-10 mx-auto max-w-[300px]">
                                <Asset src={ASSETS.gift} alt="Regalo" className="mx-auto w-14" />
                                <p className="mt-8 text-[.65rem] font-semibold uppercase leading-[1.55] tracking-[.31em]">El mejor regalo<br />es compartir<br />este momento contigo.<br />Si deseas<br />bendecirme contaré<br />con una cajita<br />y sobres el día del evento.</p>
                                <div className="xv-bob mx-auto mt-20 h-24 w-24">
                                    <Asset src={ASSETS.discoBall} alt="Esfera disco" className="xv-straight-ball h-full w-full object-contain" />
                                </div>
                                <p className="mt-4 text-3xl font-medium tracking-[.5em]">RSVP</p>
                                <p className="mt-14 text-[.87rem] font-medium italic leading-[1.55]">La cuenta regresiva ha comenzado y cada detalle está siendo preparado con mucha ilusión para compartir este gran momento contigo.</p>
                                <p className="mt-10 text-[.86rem] font-medium italic leading-[1.55]">Por favor, confirma tu asistencia antes del 15 de octubre, así podremos tener todo listo para darte la bienvenida y hacer de este día una experiencia inolvidable.</p>
                                <button type="button" onClick={() => setRsvpOpen(true)} className="mt-9 min-w-56 rounded-md bg-gradient-to-r from-[#ad7900] via-[#e0ad1a] to-[#ad7900] px-7 py-4 text-[.69rem] font-semibold uppercase tracking-[.16em] text-[#fff9d0] shadow-[0_8px_18px_rgba(127,86,0,.25)] transition hover:-translate-y-0.5">Confirmar asistencia</button>
                            </div>
                        </PaperSection>
                        <footer className="flex flex-col items-center bg-[#252525] px-6 py-8 text-center text-[.6rem] uppercase tracking-[.24em] text-[#f5e994]">
                            <p>Marce · Mis XV años</p>
                            <p className="mt-2">WoowbeGt</p>
                            <div className="mt-4 flex gap-4">
                                <a
                                    href="https://www.tiktok.com/@woowbegt?_r=1&_t=ZS-99gwzQMoXW0"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="transition hover:-translate-y-0.5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b8500]"
                                    aria-label="TikTok de WoowbeGt"
                                >
                                    <BrandTiktok size={20} strokeWidth={1.5} />
                                </a>
                                <a
                                    href="https://www.instagram.com/woowbe?stkn=MTU3d2ZoNHJzYzNuZg%3D%3D&utm_source=qr"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="transition hover:-translate-y-0.5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b8500]"
                                    aria-label="Instagram de WoowbeGt"
                                >
                                    <BrandInstagram size={20} strokeWidth={1.5} />
                                </a>
                            </div>
                        </footer>
                    </div>
                )}
            </div>

            {rsvpOpen && <AttendanceModal close={() => setRsvpOpen(false)} {...invitation} />}

            <style jsx global>{` 
                .xv-paper { background-color: #fcf4aa; background-image: linear-gradient(rgba(255, 248, 181, .57), rgba(255, 248, 181, .57)), url('${PAPER}'); background-size: 100% auto; background-repeat: repeat-y; } 
                @keyframes xvFloat { 0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); } 50% { transform: translate3d(0, -10px, 0) rotate(1.5deg); } } 
                @keyframes xvFloatDelayed { 0%, 100% { transform: translate3d(0, -6px, 0) rotate(-1deg); } 50% { transform: translate3d(0, 8px, 0) rotate(2deg); } } 
                @keyframes xvSway { 0%, 100% { transform: rotate(-2deg); transform-origin: left center; } 50% { transform: rotate(5deg); transform-origin: left center; } } 
                @keyframes xvSwayReverse { 0%, 100% { transform: rotate(3deg); transform-origin: right center; } 50% { transform: rotate(-5deg); transform-origin: right center; } } 
                @keyframes xvDrift { 0%, 100% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(8px, -8px, 0) scale(1.025); } } 
                .xv-float { animation: xvFloat 5.6s ease-in-out infinite; } 
                .xv-float-delayed { animation: xvFloatDelayed 6.8s ease-in-out .8s infinite; } 
                .xv-sway { animation: xvSway 5s ease-in-out infinite; } 
                .xv-sway-reverse { animation: xvSwayReverse 6.2s ease-in-out infinite; } 
                .xv-drift { animation: xvDrift 8s ease-in-out infinite; } 
                @media (prefers-reduced-motion: reduce) { .xv-float, .xv-float-delayed, .xv-sway, .xv-sway-reverse, .xv-drift { animation: none; } } 
            `}</style>
        </main>
    );
}
