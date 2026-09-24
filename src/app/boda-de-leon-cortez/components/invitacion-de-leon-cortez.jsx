'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Check, Church, Download, MapPin, ScrollText, Sparkles, UsersRound, Volume2, VolumeX, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const PHOTOS = {
    cover: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789881812/WhatsApp_Image_2026-09-17_at_9.22.35_PM_zhbtoo.jpg',
    storyOne: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789881800/WhatsApp_Image_2026-09-17_at_9.56.35_PM_eobhhl.jpg',
    storyTwo: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789881811/WhatsApp_Image_2026-09-17_at_9.22.57_PM_cxzpau.jpg',
    storyThree: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1789881804/WhatsApp_Image_2026-09-17_at_9.25.34_PM_fpgk6h.jpg',
    storyFour: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790139102/WhatsApp_Image_2026-09-20_at_9.20.10_PM_1_dodtzz.jpg',
    storyFive: 'https://res.cloudinary.com/dclzsvu62/image/upload/v1790139105/WhatsApp_Image_2026-09-20_at_9.20.10_PM_e34wpi.jpg'
};

const MASS_MAP = 'https://www.google.com/maps/place/San+Miguel+Febres+Cordero/@14.5512514,-90.5502701,17z/data=!3m1!4b1!4m6!3m5!1s0x8589a6c5c67f66f7:0xf9b22b652ce365b3!8m2!3d14.5512514!4d-90.5502701!16s%2Fg%2F1wfvmzxb?entry=ttu&g_ep=EgoyMDI2MDkxNi4wIKXMDSoASAFQAw%3D%3D';
const RECEPTION_MAP = 'https://www.google.com/maps/place/Sal%C3%B3n+San+Jos%C3%A9+La+Quinta/@14.6415284,-90.5028569,17z/data=!4m6!3m5!1s0x8589a3004a2a3cc1:0x3a806c05f96f093!8m2!3d14.6422512!4d-90.5043804!16s%2Fg%2F11ypb1l2kz?entry=ttu&g_ep=EgoyMDI2MDkxNi4wIKXMDSoASAFQAw%3D%3D';
const WEDDING_DATE = new Date('2026-10-17T15:00:00-06:00');
const FLORAL_BACKGROUND = 'https://res.cloudinary.com/dclzsvu62/image/upload/v1773894367/4_pxx5xb.png';
const DRESS_CODE_IMAGE = 'https://res.cloudinary.com/dclzsvu62/image/upload/v1773888935/dress_u5fzam.png';
const RINGS_IMAGE = 'https://res.cloudinary.com/dclzsvu62/image/upload/v1754617619/bodas-woowbe/uvbyhplyhq2xgruj8rox.png';
const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ariana+Cortez+y+Mario+de+Le%C3%B3n&dates=20261017T210000Z%2F20261018T030000Z&details=Misa%3A+3%3A00+p.+m.+en+Iglesia+San+Miguel+Febres+Cordero%2C+Zona+21.%0AReuni%C3%B3n%3A+6%3A00+p.+m.+en+Sal%C3%B3n+San+Jos%C3%A9+La+Quinta%2C+5ta+Calle+14-21%2C+zona+1.&location=Iglesia+San+Miguel+Febres+Cordero+y+Sal%C3%B3n+San+Jos%C3%A9+La+Quinta%2C+Guatemala';
const RSVP_SPREADSHEET_ID = '1wT3MSA48CD1ZFngMJbCe9r8LVbZ3Vu8g936xLlcLjqA';
const RSVP_SHEET_RANGE = 'Hoja 1!A:F';
const RSVP_HEADERS = ['Invitado principal', 'Respuesta', 'Nombres confirmados', 'Lugares confirmados', 'Lugares reservados', 'Fecha de registro'];

function getCount(searchParams, names, fallback = 0) {
    for (const name of names) {
        const parsed = Number.parseInt(searchParams.get(name) ?? '', 10);
        if (Number.isFinite(parsed) && parsed >= 0) return Math.min(parsed, 20);
    }
    return fallback;
}

function countDown() {
    const remaining = Math.max(0, WEDDING_DATE.getTime() - Date.now());
    return {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000),
    };
}

function Countdown() {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        const update = () => setTime(countDown());
        update();
        const interval = window.setInterval(update, 1000);
        return () => window.clearInterval(interval);
    }, []);
    const units = [['Días', time.days], ['Horas', time.hours], ['Minutos', time.minutes], ['Segundos', time.seconds]];
    return <div className="flex items-start justify-between text-center">{units.map(([label, value], index) => <React.Fragment key={label}><div className="min-w-0 flex-1 py-3"><p className="font-serif text-2xl font-semibold leading-none text-[#6E723A]">{String(value).padStart(2, '0')}</p><p className="mt-2 text-[.46rem] font-bold uppercase tracking-[.1em] text-[#6E7349]">{label}</p></div>{index < units.length - 1 && <div className="mt-2 h-10 w-px bg-[#D9BF73]/80" />}</React.Fragment>)}</div>;
}

function SectionTitle({ eyebrow, children, dark = false }) {
    return <header className="text-center"><p className={`text-[.53rem] font-bold uppercase tracking-[.28em] ${dark ? 'text-[#D9BF73]' : 'text-[#6E7349]'}`}>{eyebrow}</p><h2 className={`mt-3 font-serif text-[1.7rem] italic leading-tight ${dark ? 'text-[#fffdf5]' : 'text-[#6E723A]'}`}>{children}</h2><div className={`mx-auto mt-5 h-px w-14 ${dark ? 'bg-[#D9BF73]' : 'bg-[#D9B23D]'}`} /></header>;
}

function EventCard({ icon: Icon, title, time, children, map }) {
    return <article className="py-10 text-center"><Icon className="mx-auto h-6 w-6 text-[#D9B23D]" strokeWidth={1.5} /><p className="mt-5 text-[.55rem] font-bold uppercase tracking-[.25em] text-[#6E7349]">{title}</p><p className="mt-2 font-serif text-2xl italic text-[#6E723A]">{time}</p><p className="mx-auto mt-5 max-w-[17rem] text-[.8rem] leading-relaxed text-[#565936]">{children}</p><a href={map} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 border-b border-[#6E723A]/35 pb-1.5 text-[.56rem] font-bold uppercase tracking-[.13em] text-[#6E723A] transition hover:border-[#6E723A]"><MapPin size={14} />Ver ubicación</a></article>;
}

function downloadAppleCalendar() {
    const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Woowbe//Boda Ariana y Mario//ES', 'BEGIN:VEVENT', 'UID:ariana-mario-20261017@woowbe', 'DTSTAMP:20260920T000000Z', 'DTSTART:20261017T210000Z', 'DTEND:20261018T030000Z', 'SUMMARY:Boda de Ariana Cortez y Mario de León', 'LOCATION:Iglesia San Miguel Febres Cordero y Salón San José La Quinta, Guatemala', 'DESCRIPTION:Misa: 3:00 p. m. en Iglesia San Miguel Febres Cordero, Zona 21\\nReunión: 6:00 p. m. en Salón San José La Quinta, 5ta Calle 14-21, zona 1.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const file = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'boda-ariana-y-mario.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function LegacyRsvpModal({ close, guestName, reservedSeats }) {
    const [answer, setAnswer] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const options = [['misa', 'Solo a la misa'], ['fiesta', 'Solo a la fiesta'], ['ambas', 'A la misa y a la fiesta'], ['ninguna', 'No podré asistir']];
    const label = options.find(([value]) => value === answer)?.[1];
    return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2e3020]/55 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="rsvp-title"><div className="relative w-full max-w-[390px] rounded-[2rem] bg-[#fffdf5] px-6 pb-7 pt-10 text-[#565936] shadow-2xl"><button type="button" onClick={close} className="absolute right-4 top-4 rounded-full p-2 text-[#6E723A] transition hover:bg-[#D0C9A5]/35" aria-label="Cerrar"><X size={19} /></button>{confirmed ? <div className="py-5 text-center"><Check className="mx-auto h-12 w-12 rounded-full bg-[#6E723A] p-3 text-[#fffdf5]" /><p className="mt-5 text-[.58rem] font-bold uppercase tracking-[.25em] text-[#6E7349]">Respuesta registrada</p><h3 className="mt-3 font-serif text-3xl italic text-[#6E723A]">{label}</h3><p className="mx-auto mt-4 max-w-[250px] text-sm leading-relaxed">Gracias, {guestName}. Nos alegra contar contigo en este momento tan especial.</p><button type="button" onClick={close} className="mt-7 rounded-full bg-[#6E723A] px-6 py-3 text-[.62rem] font-bold uppercase tracking-[.15em] text-[#fffdf5]">Cerrar</button></div> : <div><p className="text-center text-[.58rem] font-bold uppercase tracking-[.28em] text-[#6E7349]">RSVP</p><h2 id="rsvp-title" className="mt-3 text-center font-serif text-3xl italic text-[#6E723A]">Confirma tu asistencia</h2><p className="mx-auto mt-4 max-w-[270px] text-center text-sm leading-relaxed">Hemos reservado <strong>{reservedSeats} {reservedSeats === 1 ? 'lugar' : 'lugares'}</strong> para esta invitación.</p><fieldset className="mt-7 space-y-2.5"><legend className="mb-3 text-[.62rem] font-bold uppercase tracking-[.16em] text-[#6E7349]">¿Cómo nos acompañarás?</legend>{options.map(([value, option]) => <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D0C9A5] bg-white px-4 py-3 text-sm has-[:checked]:border-[#6E723A] has-[:checked]:bg-[#D0C9A5]/35"><input type="radio" name="attendance" value={value} checked={answer === value} onChange={(event) => setAnswer(event.target.value)} className="accent-[#6E723A]" />{option}</label>)}</fieldset><button type="button" disabled={!answer} onClick={() => setConfirmed(true)} className="mt-7 w-full rounded-full bg-[#6E723A] px-5 py-3.5 text-[.62rem] font-bold uppercase tracking-[.16em] text-[#fffdf5] transition hover:bg-[#565936] disabled:cursor-not-allowed disabled:opacity-45">Confirmar</button><p className="mt-3 text-center text-xs leading-relaxed text-[#6E7349]">Por ahora esta confirmación no envía datos; los lugares reservados se leen desde tu enlace.</p></div>}</div></div>;
}

function RsvpModal({ close, guestName, reservedSeats }) {
    const [answer, setAnswer] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [attendeeNames, setAttendeeNames] = useState(() => Array.from({ length: reservedSeats }, (_, index) => (index === 0 ? guestName : '')));
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const options = [['misa', 'Solo a la misa'], ['fiesta', 'Solo a la fiesta'], ['ambas', 'A la misa y a la fiesta'], ['ninguna', 'No podré asistir']];
    const isAttending = answer && answer !== 'ninguna';
    const label = options.find(([value]) => value === answer)?.[1];
    const listedAttendees = attendeeNames.map((name) => name.trim()).filter(Boolean);

    const confirm = async () => {
        if (!answer) return;
        if (isAttending && listedAttendees.length === 0) {
            setMessage('Escribe al menos un nombre de las personas que asistirán.');
            return;
        }
        setMessage('');
        setSubmitting(true);
        try {
            const response = await fetch('/api/registrarInvitado/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spreadsheetId: RSVP_SPREADSHEET_ID,
                    range: RSVP_SHEET_RANGE,
                    headers: RSVP_HEADERS,
                    values: [
                        guestName,
                        label,
                        listedAttendees.join(', ') || 'Sin asistentes',
                        String(listedAttendees.length),
                        String(reservedSeats),
                        new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala', dateStyle: 'short', timeStyle: 'short' }),
                    ],
                }),
            });
            if (!response.ok) throw new Error('No se pudo guardar la respuesta');
            setConfirmed(true);
        } catch (error) {
            console.error(error);
            setMessage('No pudimos guardar tu respuesta. Inténtalo nuevamente en unos momentos.');
        } finally {
            setSubmitting(false);
        }
    };

    const updateName = (index, value) => setAttendeeNames((current) => current.map((name, nameIndex) => nameIndex === index ? value : name));

    return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2e3020]/55 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="rsvp-title"><div className="relative max-h-[93svh] w-full max-w-[390px] overflow-y-auto rounded-[2rem] bg-[#fffdf5] px-6 pb-8 pt-10 text-[#565936] shadow-2xl"><button type="button" onClick={close} className="absolute right-4 top-4 rounded-full p-2 text-[#6E723A] transition hover:bg-[#D0C9A5]/35" aria-label="Cerrar"><X size={19} /></button>{confirmed ? <div className="py-5 text-center"><Check className="mx-auto h-12 w-12 rounded-full bg-[#6E723A] p-3 text-[#fffdf5]" /><p className="mt-5 text-[.58rem] font-bold uppercase tracking-[.25em] text-[#6E7349]">Respuesta registrada</p><h3 className="mt-3 font-serif text-3xl italic text-[#6E723A]">{label}</h3><p className="mx-auto mt-4 max-w-[250px] text-sm leading-relaxed">Gracias, {guestName}. {listedAttendees.length > 0 ? `${listedAttendees.length} ${listedAttendees.length === 1 ? 'persona asistirá' : 'personas asistirán'}.` : 'Agradecemos que nos hayas avisado.'}</p><button type="button" onClick={close} className="mt-7 rounded-full bg-[#6E723A] px-6 py-3 text-[.62rem] font-bold uppercase tracking-[.15em] text-[#fffdf5]">Cerrar</button></div> : <div><p className="text-center text-[.58rem] font-bold uppercase tracking-[.28em] text-[#6E7349]">RSVP</p><h2 id="rsvp-title" className="mt-3 text-center font-serif text-3xl italic text-[#6E723A]">Confirma tu asistencia</h2><p className="mx-auto mt-4 max-w-[270px] text-center text-sm leading-relaxed">Hemos reservado <strong>{reservedSeats} {reservedSeats === 1 ? 'lugar' : 'lugares'}</strong> para esta invitación.</p><fieldset className="mt-7"><legend className="mb-3 text-[.62rem] font-bold uppercase tracking-[.16em] text-[#6E7349]">¿Cómo nos acompañarás?</legend><div className="divide-y divide-[#D0C9A5]/80 border-y border-[#D0C9A5]/80">{options.map(([value, option]) => <label key={value} className="flex cursor-pointer items-center gap-3 py-3 text-sm has-[:checked]:text-[#6E723A]"><input type="radio" name="attendance" value={value} checked={answer === value} onChange={(event) => { setAnswer(event.target.value); setMessage(''); }} className="accent-[#6E723A]" />{option}</label>)}</div></fieldset>{isAttending && <div className="mt-7"><p className="text-[.62rem] font-bold uppercase tracking-[.16em] text-[#6E7349]">Nombres de quienes asistirán</p><p className="mt-2 text-xs leading-relaxed text-[#6E7349]">Completa solo los lugares que sí utilizarán; puedes dejar los demás vacíos.</p><div className="mt-4 space-y-3">{attendeeNames.map((name, index) => <input key={index} type="text" value={name} onChange={(event) => updateName(index, event.target.value)} placeholder={`Nombre de la persona ${index + 1}`} className="w-full border-b border-[#D0C9A5] bg-transparent px-1 py-3 text-sm text-[#565936] outline-none placeholder:text-[#8f926f] focus:border-[#6E723A]" />)}</div></div>}{message && <p className="mt-4 text-center text-xs text-red-700">{message}</p>}<button type="button" disabled={!answer || submitting} onClick={confirm} className="mt-8 w-full rounded-full bg-[#6E723A] px-5 py-3.5 text-[.62rem] font-bold uppercase tracking-[.16em] text-[#fffdf5] transition hover:bg-[#565936] disabled:cursor-not-allowed disabled:opacity-45">{submitting ? 'Guardando…' : 'Confirmar'}</button><p className="mt-3 text-center text-xs leading-relaxed text-[#6E7349]">Tu respuesta se guardará en la lista de invitados.</p></div>}</div></div>;
}

export function InvitacionDeLeonCortez() {
    const searchParams = useSearchParams();
    const [rsvpOpen, setRsvpOpen] = useState(false);
    const [musicMuted, setMusicMuted] = useState(false);
    const musicRef = useRef(null);
    const reservation = useMemo(() => {
        const adults = getCount(searchParams, ['adultos', 'adultosInvitados'], 1);
        const kids = getCount(searchParams, ['ninos', 'niños'], 0);
        const guestName = searchParams.get('nombre')?.trim() || searchParams.get('invitado')?.trim() || 'familia invitada';
        return { guestName, seats: Math.max(1, adults + kids) };
    }, [searchParams]);
    const playMusicFromGesture = () => {
        const music = musicRef.current;
        if (!music || musicMuted) return;
        music.muted = false;
        music.volume = 0.42;
        music.play().catch(() => { });
    };

    useEffect(() => {
        if (!musicMuted) playMusicFromGesture();
    }, [musicMuted]);

    const toggleMusic = () => {
        const nextMuted = !musicMuted;
        setMusicMuted(nextMuted);
        const music = musicRef.current;
        if (!music) return;
        if (nextMuted) {
            music.muted = true;
            music.pause();
            return;
        }
        music.muted = false;
        music.volume = 0.42;
        music.play().catch(() => { });
    };

    return <main className="min-h-screen bg-[#D0C9A5] text-[#565936]" onPointerDown={playMusicFromGesture} onTouchStart={playMusicFromGesture}><audio ref={musicRef} src="/bodaArina.mp3" autoPlay loop preload="auto" playsInline /><button type="button" onClick={toggleMusic} aria-label={musicMuted ? 'Activar música' : 'Silenciar música'} aria-pressed={!musicMuted} className="fixed bottom-5 right-5 z-[70] grid h-10 w-10 place-items-center rounded-full border border-[#D9BF73]/80 bg-[#fffdf5]/90 text-[#6E723A] shadow-lg backdrop-blur transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E723A]">{musicMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button><div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#fffdf5] shadow-[0_0_0_1px_rgba(110,114,58,.12),0_18px_70px_rgba(39,42,24,.25)]"><section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[#6E723A] px-7 pb-12 pt-10 text-center text-[#fffdf5]"><img src={PHOTOS.cover} alt="Ariana Cortez y Mario de León" className="absolute inset-0 h-full w-full object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-t from-[#30351d]/90 via-[#30351d]/20 to-[#30351d]/10" /><div className="relative"><p className="text-[.53rem] font-bold uppercase tracking-[.32em] text-[#f6e6a9]">Nos casamos</p><h1 className="mt-4 font-serif text-4xl italic leading-[.9] drop-shadow-sm">Ariana<br /><span className="text-[#f1da83]">&</span><br />Mario</h1><p className="mt-6 text-[.62rem] font-bold uppercase tracking-[.25em]">Cortez · De León</p><div className="mx-auto mt-7 h-px w-14 bg-[#D9BF73]" /><p className="mt-6 font-serif text-xl italic">17 de octubre, 2026</p><p className="mt-3 text-[.56rem] font-bold uppercase tracking-[.18em] text-[#f6e6a9]">Guatemala</p></div></section>

    <section className="relative min-h-[720px] overflow-hidden px-7 py-24" style={{ backgroundImage: `linear-gradient(rgba(255, 253, 245, .70), rgba(255, 253, 245, .86)), url(${FLORAL_BACKGROUND})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><SectionTitle eyebrow="Cuenta regresiva">Falta muy poco</SectionTitle><div className="mt-12"><Countdown /></div><p className="mx-auto mt-20 max-w-[305px] text-center font-serif text-xl italic leading-relaxed text-[#6E723A]">“Grábame como un sello en tu corazón, como un sello en tu brazo. Porque el amor es fuerte como la muerte… Las aguas torrenciales no podrán apagar el amor, ni los ríos anegarlo.”</p><p className="mt-5 text-center text-[.53rem] font-bold uppercase tracking-[.16em] text-[#6E7349]">Cantar de los Cantares 8:6–7</p></section>

    <section className="relative min-h-[880px] overflow-hidden bg-[#6E723A] px-7 py-24 text-[#fffdf5]" style={{ backgroundImage: `linear-gradient(rgba(86, 89, 39, .58), rgba(86, 89, 39, .72)), url(${FLORAL_BACKGROUND})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><SectionTitle eyebrow="Con la bendición de sus familias" dark>Celebramos el amor</SectionTitle><div className="mt-20 space-y-16 text-center"><div><p className="text-[.53rem] font-bold uppercase tracking-[.22em] text-[#D9BF73]">Padres de Ariana</p><p className="mt-5 font-serif text-xl italic leading-relaxed">Efraín Cortez Cotom<br />Delia Chanchavac de Cortez <span className="ml-1 font-sans font-bold text-[#D9BF73]">†</span></p></div><div><p className="text-[.53rem] font-bold uppercase tracking-[.22em] text-[#D9BF73]">Padres de Mario</p><p className="mt-5 font-serif text-xl italic leading-relaxed">Hugo Roberto de León Campillo<br />Aura Marina Alvarez de de León <span className="ml-1 font-sans font-bold text-[#D9BF73]">†</span></p></div><div className="border-t border-[#D9BF73]/50 pt-14"><p className="text-[.53rem] font-bold uppercase tracking-[.22em] text-[#D9BF73]">Padrinos</p><p className="mt-5 font-serif text-xl italic leading-relaxed">Julio Cortez y Adriana de Cortez Carrera</p><p className="mt-10 text-[.53rem] font-bold uppercase tracking-[.22em] text-[#D9BF73]">Dama de honor</p><p className="mx-auto mt-4 max-w-[18rem] text-[.96rem] font-semibold leading-relaxed text-[#fffdf5]/95">Nuestra hija Sofía de León Cortez, quien nos acompañará como Dama de Honor y custodiará nuestros anillos y las alianzas de nuestra eterna unión.</p></div></div></section>

    <section className="relative min-h-[790px] overflow-hidden px-7 py-24"><SectionTitle eyebrow="17 de octubre">Nuestro día</SectionTitle><div className="mt-16 divide-y divide-[#D9BF73]/75"><EventCard icon={Church} title="Misa" time="3:00 p. m." map={MASS_MAP}>Iglesia San Miguel Febres Cordero<br />Zona 21, Guatemala</EventCard><EventCard icon={Sparkles} title="Reunión" time="6:00 p. m." map={RECEPTION_MAP}>San José La Quinta, salón de eventos<br />5ta Calle 14-21, zona 1</EventCard></div></section>

    <section className="relative flex min-h-[620px] flex-col items-center justify-center overflow-hidden bg-[#6E723A] px-7 py-24 text-center text-[#fffdf5]"><img src={RINGS_IMAGE} alt="Anillos de boda" className="mb-12 w-48 object-contain" /><SectionTitle eyebrow="Guarda la fecha" dark>Agregar al calendario</SectionTitle><p className="mx-auto mt-10 max-w-[275px] text-[.84rem] font-semibold leading-relaxed text-[#fffdf5]/95">Reserva este día para celebrar con nosotros la misa y la reunión.</p><div className="mt-10 flex w-full max-w-[275px] flex-col gap-3"><a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#fffdf5] px-5 py-3.5 text-[.62rem] font-bold uppercase tracking-[.13em] text-[#6E723A] transition hover:bg-[#f5edcf]"><CalendarDays size={16} />Google Calendar</a><button type="button" onClick={downloadAppleCalendar} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9BF73] px-5 py-3.5 text-[.62rem] font-bold uppercase tracking-[.13em] text-[#fffdf5] transition hover:bg-[#fffdf5]/10"><Download size={16} />Calendario iPhone / iOS</button></div><p className="mt-8 text-[.58rem] font-semibold leading-relaxed text-[#D9BF73]">17 de octubre de 2026 · Misa 3:00 p. m. · Reunión 6:00 p. m.</p></section>

    <section className="relative min-h-[740px] overflow-hidden px-7 py-24 text-center" style={{ backgroundImage: `linear-gradient(rgba(255, 253, 245, .78), rgba(255, 253, 245, .92)), url(${PHOTOS.storyOne})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><SectionTitle eyebrow="Código de vestimenta">Dress code</SectionTitle><img src={DRESS_CODE_IMAGE} alt="Vestimenta formal" className="mx-auto mt-16 h-64 w-48 object-contain" /><p className="mt-12 font-serif text-2xl font-semibold italic text-[#6E723A]">Formal</p><p className="mx-auto mt-5 max-w-[240px] text-[.84rem] font-semibold leading-relaxed text-[#565936]">Acompáñanos con vestimenta formal para celebrar este día especial.</p></section>

    <section className="relative min-h-[700px] overflow-hidden px-7 py-24" style={{ backgroundImage: `linear-gradient(rgba(255, 253, 245, .56), rgba(255, 253, 245, .76)), url(${FLORAL_BACKGROUND})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><SectionTitle eyebrow="Tu presencia">Nos haría muy felices</SectionTitle><div className="mt-20 text-center"><UsersRound className="mx-auto h-7 w-7 text-[#D9B23D]" /><p className="mt-5 font-serif text-2xl italic text-[#6E723A]">{reservation.seats} {reservation.seats === 1 ? 'lugar reservado' : 'lugares reservados'}</p><p className="mx-auto mt-6 max-w-[17rem] text-[.84rem] leading-relaxed">Para {reservation.guestName}. Elige si asistirás a la misa, a la fiesta, a ambas o si no podrás acompañarnos.</p><button type="button" onClick={() => setRsvpOpen(true)} className="mt-10 rounded-full bg-[#6E723A] px-6 py-3.5 text-[.58rem] font-bold uppercase tracking-[.14em] text-[#fffdf5] transition hover:bg-[#565936]">Confirmar asistencia</button></div></section>

    <section className="relative overflow-hidden bg-[#6E723A] px-7 py-24 text-[#fffdf5]" style={{ backgroundImage: `linear-gradient(rgba(86, 89, 39, .58), rgba(86, 89, 39, .70)), url(${FLORAL_BACKGROUND})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><SectionTitle eyebrow="Memorias & retratos" dark>Nuestra historia</SectionTitle><div className="mt-14 grid grid-cols-2 gap-3"><img src={PHOTOS.storyOne} alt="Ariana y Mario" className="col-span-2 h-72 w-full rounded-[1.5rem] object-cover object-[center_35%] shadow-md" /><img src={PHOTOS.storyTwo} alt="Ariana y Mario" className="h-60 w-full rounded-[1.3rem] object-cover shadow-md" /><img src={PHOTOS.storyThree} alt="Ariana y Mario" className="h-60 w-full rounded-[1.3rem] object-cover shadow-md" /><img src={PHOTOS.storyFour} alt="Ariana y Mario" className="h-60 w-full rounded-[1.3rem] object-cover shadow-md" /><img src={PHOTOS.storyFive} alt="Ariana y Mario" className="h-60 w-full rounded-[1.3rem] object-cover shadow-md" /></div><div className="mt-24 border-t border-[#D9BF73]/50 pt-20"><article className="text-center"><ScrollText className="mx-auto h-6 w-6 text-[#D9BF73]" /><p className="mt-5 font-serif text-xl italic leading-relaxed">“Doy gracias a mi Dios cada vez que los recuerdo… Estoy convencido de esto: el que comenzó en ustedes la buena obra, la llevará a feliz término hasta el Día de Cristo Jesús.”</p><p className="mt-5 text-center text-[.53rem] font-bold uppercase tracking-[.16em] text-[#D9BF73]">Filipenses 1:3–6</p></article><p className="mt-20 text-center text-[.52rem] font-bold uppercase tracking-[.2em] text-[#D9BF73]">Ariana Cortez & Mario de León</p></div></section></div>{rsvpOpen && <RsvpModal close={() => setRsvpOpen(false)} guestName={reservation.guestName} reservedSeats={reservation.seats} />}</main>;
}
