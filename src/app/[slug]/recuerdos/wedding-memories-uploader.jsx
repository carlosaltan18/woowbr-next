'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    AlertCircle,
    Camera,
    Check,
    FileImage,
    FileVideo,
    ImagePlus,
    LoaderCircle,
    Play,
    ShieldCheck,
    Upload,
    X,
} from 'lucide-react';

// Mantener el acceso al API en una variable pública permite que cada entorno use
// su propio woowbe-back, sin exponer credenciales de R2 en la invitación.
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

const FALLBACK_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];

const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '—';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / (1024 ** index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const getMediaKind = (contentType = '') => (contentType.startsWith('video/') ? 'video' : 'image');

const formatAcceptedTypes = (types = []) => {
    const labels = [];
    if (types.some((type) => type.startsWith('image/'))) labels.push('JPG, PNG y WEBP');
    if (types.some((type) => type.startsWith('video/'))) labels.push('MP4 y MOV');
    return labels.join(' · ') || 'Fotos y videos';
};

const getErrorMessage = (error, fallback = 'No pudimos completar la solicitud. Intenta de nuevo.') => {
    if (typeof error?.message === 'string' && error.message.trim()) return error.message;
    return fallback;
};

const createSessionId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return `recuerdos-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getWeddingSessionId = (slug) => {
    const fallback = createSessionId();
    if (typeof window === 'undefined' || !slug) return fallback;

    const storageKey = `wedding-session:${slug}`;
    try {
        const storedSessionId = window.localStorage.getItem(storageKey);
        if (storedSessionId) return storedSessionId;

        window.localStorage.setItem(storageKey, fallback);
        return fallback;
    } catch {
        // Un navegador en modo privado puede bloquear localStorage. En ese caso
        // se mantiene una sesión temporal para no impedir la carga.
        return fallback;
    }
};

async function requestJson(path, options = {}) {
    if (!API_BASE_URL) {
        throw new Error('El servicio de recuerdos no está configurado.');
    }
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers,
        },
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        const message = Array.isArray(payload?.message) ? payload.message[0] : payload?.message;
        const error = new Error(message || 'No pudimos completar la solicitud.');
        error.status = response.status;
        throw error;
    }

    return payload;
}

async function uploadToSignedUrl({ uploadUrl, file }) {
    // R2 firma el método, el contenido y la URL. No se deben añadir tokens ni
    // encabezados extra a esta carga directa desde el navegador.
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    });
    if (!response.ok) {
        throw new Error('No pudimos guardar este archivo. Revisa tu conexión e inténtalo de nuevo.');
    }
}

const getFileUploadConcurrency = () => {
    if (typeof navigator === 'undefined') return 1;
    const connectionType = navigator.connection?.effectiveType;
    // En una red lenta se preserva la estabilidad; en Wi‑Fi/4G se pueden
    // enviar dos recuerdos independientes sin hacer cola innecesariamente.
    return ['slow-2g', '2g', '3g'].includes(connectionType) ? 1 : 2;
};

function StatusPanel({ title, message, action }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f8f6f0] px-5 py-10 text-[#244b4c]">
            <section className="w-full max-w-xl rounded-[2rem] border border-[#d7ddd1] bg-white p-7 text-center shadow-[0_18px_65px_rgba(36,75,76,0.08)] sm:p-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e7eee6] text-[#416869]">
                    <AlertCircle size={23} aria-hidden="true" />
                </div>
                <p className="mt-6 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#6a8080]">Recuerdos de boda</p>
                <h1 className="mt-3 font-serif text-4xl leading-tight text-[#244b4c]">{title}</h1>
                <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#557071]">{message}</p>
                {action ? <div className="mt-7">{action}</div> : null}
            </section>
        </main>
    );
}

function FileIcon({ type }) {
    return getMediaKind(type) === 'video'
        ? <FileVideo size={21} aria-hidden="true" />
        : <FileImage size={21} aria-hidden="true" />;
}

function FileRow({ entry, onRemove, onRetry, disabled }) {
    const isUploading = entry.state === 'uploading';
    const isSuccess = entry.state === 'success';
    const isError = entry.state === 'error';

    return (
        <li className="rounded-2xl border border-[#d9dfd6] bg-[#fcfcf9] px-3.5 py-3.5 sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8eee7] text-[#416869]">
                    {isSuccess ? <Check size={20} aria-hidden="true" /> : <FileIcon type={entry.file.type} />}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#274d4e]">{entry.file.name}</p>
                    <p className="mt-0.5 text-xs text-[#6a8080]">{getMediaKind(entry.file.type) === 'video' ? 'Video' : 'Foto'} · {formatBytes(entry.file.size)}</p>
                </div>
                {isSuccess ? <span className="shrink-0 text-xs font-semibold text-[#456b55]">Enviado</span> : null}
                {isUploading ? <span className="shrink-0 text-xs font-semibold text-[#456b55]">{entry.progress}%</span> : null}
                {!isSuccess && !isUploading ? (
                    <button
                        type="button"
                        onClick={() => (isError ? onRetry(entry) : onRemove(entry.id))}
                        disabled={disabled}
                        className="min-h-10 shrink-0 rounded-lg px-2 text-xs font-bold uppercase tracking-[0.12em] text-[#416869] transition hover:bg-[#e8eee7] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isError ? 'Reintentar' : 'Quitar'}
                    </button>
                ) : null}
            </div>
            {isUploading ? (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e0e6de]" aria-label={`Progreso de ${entry.file.name}: ${entry.progress}%`}>
                    <div className="h-full rounded-full bg-[#416869] transition-[width] duration-300" style={{ width: `${entry.progress}%` }} />
                </div>
            ) : null}
            {isError ? <p className="mt-2 text-xs leading-5 text-[#a34335]">{entry.error}</p> : null}
        </li>
    );
}

function Gallery({ items, onOpen }) {
    if (!items.length) {
        return (
            <p className="rounded-2xl border border-dashed border-[#cfd8cf] px-5 py-8 text-center text-sm leading-6 text-[#667f7f]">
                Muy pronto podrás ver aquí los recuerdos que los novios aprueben.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => {
                const isVideo = item.mediaType === 'video' || String(item.contentType || '').startsWith('video/');
                const imageSource = item.thumbnailUrl || item.url;
                return (
                    <button
                        key={item.id || item._id || item.url}
                        type="button"
                        onClick={() => onOpen(item)}
                        className="group relative aspect-square overflow-hidden rounded-2xl bg-[#dce5dc] text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-[#416869] focus:ring-offset-2"
                        aria-label={`Abrir ${isVideo ? 'video' : 'foto'}: ${item.filename || 'recuerdo de boda'}`}
                    >
                        {isVideo ? (
                            item.thumbnailUrl
                                ? <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                                : <span className="flex h-full w-full items-center justify-center bg-[#315b5c] text-white/85"><FileVideo size={34} aria-hidden="true" /></span>
                        ) : (
                            <img src={imageSource} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                        )}
                        {isVideo ? (
                            <span className="absolute inset-0 flex items-center justify-center bg-[#173f40]/25 text-white">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/20 backdrop-blur-sm"><Play size={19} fill="currentColor" aria-hidden="true" /></span>
                            </span>
                        ) : null}
                    </button>
                );
            })}
        </div>
    );
}

function MediaLightbox({ item, onClose }) {
    useEffect(() => {
        const handleKey = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const isVideo = item.mediaType === 'video' || String(item.contentType || '').startsWith('video/');
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a2b]/90 p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={item.filename || 'Recuerdo de boda'}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25" aria-label="Cerrar visor">
                <X size={22} aria-hidden="true" />
            </button>
            <div className="max-h-full max-w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
                {isVideo ? (
                    <video src={item.url} controls preload="metadata" playsInline className="max-h-[82vh] max-w-[92vw]" />
                ) : (
                    <img src={item.url} alt={item.filename || 'Recuerdo de boda'} className="max-h-[82vh] max-w-[92vw] object-contain" decoding="async" />
                )}
            </div>
        </div>
    );
}

export default function WeddingMemoriesUploader() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = typeof params?.slug === 'string' ? params.slug : '';
    const accessToken = searchParams.get('access') || '';
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const sessionIdRef = useRef('');

    const [config, setConfig] = useState(null);
    const [configState, setConfigState] = useState('loading');
    const [configMessage, setConfigMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [uploaderName, setUploaderName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [notice, setNotice] = useState('');
    const [gallery, setGallery] = useState([]);
    const [galleryState, setGalleryState] = useState('idle');
    const [activeMedia, setActiveMedia] = useState(null);

    const getConfig = useCallback(async () => {
        if (!slug || !accessToken) return;
        setConfigState('loading');
        setConfigMessage('');
        try {
            const data = await requestJson(`/public/weddings/${encodeURIComponent(slug)}/config?access=${encodeURIComponent(accessToken)}`);
            setConfig(data);
            setConfigState('ready');
        } catch (error) {
            setConfigState('error');
            if (error.status === 401 || error.status === 403 || error.status === 404) {
                setConfigMessage('Este enlace ya no es válido o el acceso al álbum venció. Pide a los novios un nuevo código QR.');
            } else {
                setConfigMessage(getErrorMessage(error, 'No pudimos abrir el álbum en este momento. Intenta de nuevo más tarde.'));
            }
        }
    }, [accessToken, slug]);

    const loadGallery = useCallback(async () => {
        if (!slug || !accessToken || !config?.publicGalleryEnabled) return;
        setGalleryState('loading');
        try {
            const data = await requestJson(`/public/weddings/${encodeURIComponent(slug)}/gallery?access=${encodeURIComponent(accessToken)}`);
            setGallery(Array.isArray(data?.items) ? data.items : []);
            setGalleryState('ready');
        } catch {
            // La galería es secundaria: nunca debe impedir que una persona suba sus recuerdos.
            setGalleryState('error');
        }
    }, [accessToken, config?.publicGalleryEnabled, slug]);

    useEffect(() => {
        if (!accessToken) {
            setConfigState('error');
            setConfigMessage('Falta el código de acceso. Abre el enlace completo desde el código QR o pide uno nuevo a los novios.');
            return undefined;
        }
        void getConfig();
        return undefined;
    }, [accessToken, getConfig]);

    useEffect(() => {
        // No reutilizar una sesión si la misma instancia del componente cambia
        // de boda durante la navegación.
        sessionIdRef.current = '';
    }, [slug]);

    useEffect(() => {
        if (config?.publicGalleryEnabled) void loadGallery();
    }, [config?.publicGalleryEnabled, loadGallery]);

    useEffect(() => {
        if (!slug || !accessToken || !config?.publicGalleryEnabled) return undefined;

        // El evento no contiene archivos ni URLs: solo avisa que la galería cambió.
        // Al recibirlo, se vuelve a consultar el endpoint autorizado para obtener URLs firmadas nuevas.
        const eventSource = new EventSource(
            `${API_BASE_URL}/public/weddings/${encodeURIComponent(slug)}/gallery/events?access=${encodeURIComponent(accessToken)}`,
        );
        const refreshGallery = () => void loadGallery();
        eventSource.addEventListener('gallery-updated', refreshGallery);

        // Respaldo para reconexiones móviles o proxies que no mantengan SSE abierto.
        const refreshInterval = window.setInterval(refreshGallery, 30000);
        return () => {
            eventSource.removeEventListener('gallery-updated', refreshGallery);
            eventSource.close();
            window.clearInterval(refreshInterval);
        };
    }, [accessToken, config?.publicGalleryEnabled, loadGallery, slug]);

    const availability = useMemo(() => {
        if (!config) return { canUpload: false, title: '', message: '' };
        if (config.uploadEnabled) return { canUpload: true, title: '', message: '' };

        const now = Date.now();
        const startsAt = config.uploadStartsAt ? new Date(config.uploadStartsAt).getTime() : null;
        const endsAt = config.uploadEndsAt ? new Date(config.uploadEndsAt).getTime() : null;
        if (startsAt && startsAt > now) return { canUpload: false, title: 'Las cargas aún no están habilitadas', message: 'El álbum estará disponible en la fecha indicada por los novios.' };
        if (endsAt && endsAt <= now) return { canUpload: false, title: 'El álbum está cerrado', message: 'El tiempo para compartir recuerdos ya finalizó. Gracias por acompañar este día.' };
        return { canUpload: false, title: 'El álbum está cerrado', message: 'Por el momento no se pueden recibir más fotos ni videos.' };
    }, [config]);

    const allowedTypes = config?.allowedContentTypes?.length ? config.allowedContentTypes : FALLBACK_ALLOWED_TYPES;
    const acceptedTypesText = formatAcceptedTypes(allowedTypes);
    const maxFiles = Number(config?.limits?.maxFilesPerSession) || 0;
    const maxImages = Number(config?.limits?.maxImagesPerSession) || 0;
    const maxVideos = Number(config?.limits?.maxVideosPerSession) || 0;
    const fileCountInSession = files.filter((entry) => entry.state !== 'error').length;
    const imageCountInSession = files.filter((entry) => entry.state !== 'error' && getMediaKind(entry.file.type) === 'image').length;
    const videoCountInSession = files.filter((entry) => entry.state !== 'error' && getMediaKind(entry.file.type) === 'video').length;
    const successCount = files.filter((entry) => entry.state === 'success').length;
    const readyCount = files.filter((entry) => entry.state === 'ready').length;

    const updateFile = useCallback((id, changes) => {
        setFiles((current) => current.map((entry) => (entry.id === id ? { ...entry, ...changes } : entry)));
    }, []);

    const validateFile = useCallback((file) => {
        if (!allowedTypes.includes(file.type)) return `“${file.name}” no tiene un formato permitido.`;
        const isVideo = getMediaKind(file.type) === 'video';
        const limit = isVideo ? config?.limits?.maxVideoSizeBytes : config?.limits?.maxImageSizeBytes;
        if (Number(limit) > 0 && file.size > Number(limit)) {
            return `“${file.name}” supera el límite de ${formatBytes(Number(limit))} para ${isVideo ? 'videos' : 'fotos'}.`;
        }
        return null;
    }, [allowedTypes, config?.limits?.maxImageSizeBytes, config?.limits?.maxVideoSizeBytes]);

    const addFiles = useCallback((selectedFiles) => {
        if (!selectedFiles?.length || isUploading || !availability.canUpload) return;
        setNotice('');

        const nextEntries = [];
        const errors = [];
        let remainingSlots = maxFiles > 0 ? Math.max(maxFiles - fileCountInSession, 0) : Number.POSITIVE_INFINITY;
        let remainingImages = maxImages > 0 ? Math.max(maxImages - imageCountInSession, 0) : Number.POSITIVE_INFINITY;
        let remainingVideos = maxVideos > 0 ? Math.max(maxVideos - videoCountInSession, 0) : Number.POSITIVE_INFINITY;

        [...selectedFiles].forEach((file) => {
            const error = validateFile(file);
            if (error) {
                errors.push(error);
                return;
            }
            if (remainingSlots <= 0) {
                errors.push(`Alcanzaste el límite de ${maxFiles} archivos por invitado/dispositivo.`);
                return;
            }
            const mediaKind = getMediaKind(file.type);
            if (mediaKind === 'image' && remainingImages <= 0) {
                errors.push(`Alcanzaste el límite de ${maxImages} fotos por invitado/dispositivo.`);
                return;
            }
            if (mediaKind === 'video' && remainingVideos <= 0) {
                errors.push(`Alcanzaste el límite de ${maxVideos} videos por invitado/dispositivo.`);
                return;
            }
            nextEntries.push({
                id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
                file,
                state: 'ready',
                progress: 0,
                error: '',
            });
            remainingSlots -= 1;
            if (mediaKind === 'image') remainingImages -= 1;
            if (mediaKind === 'video') remainingVideos -= 1;
        });

        if (nextEntries.length) setFiles((current) => [...current, ...nextEntries]);
        if (errors.length) setNotice(errors[0]);
    }, [availability.canUpload, fileCountInSession, imageCountInSession, isUploading, maxFiles, maxImages, maxVideos, validateFile, videoCountInSession]);

    const handlePickerChange = (event) => {
        addFiles(event.target.files);
        event.target.value = '';
    };

    const removeFile = (id) => {
        if (!isUploading) setFiles((current) => current.filter((entry) => entry.id !== id));
    };

    const uploadEntry = async (entry) => {
        if (!sessionIdRef.current) sessionIdRef.current = getWeddingSessionId(slug);
        updateFile(entry.id, { state: 'uploading', progress: 1, error: '' });

        try {
            const intent = await requestJson(`/public/weddings/${encodeURIComponent(slug)}/upload-intent`, {
                method: 'POST',
                body: JSON.stringify({
                    accessToken,
                    filename: entry.file.name,
                    contentType: entry.file.type,
                    size: entry.file.size,
                    uploaderName: uploaderName.trim() || undefined,
                    sessionId: sessionIdRef.current,
                }),
            });

            if (!intent?.uploadUrl || !intent?.key) throw new Error('No recibimos una autorización de carga válida.');
            // El archivo no pasa por Next ni por woowbe-back: se carga directo a
            // R2 con la URL temporal y únicamente el Content-Type firmado.
            await uploadToSignedUrl({ uploadUrl: intent.uploadUrl, file: entry.file });
            updateFile(entry.id, { progress: 90 });

            await requestJson(`/public/weddings/${encodeURIComponent(slug)}/upload-complete`, {
                method: 'POST',
                body: JSON.stringify({
                    accessToken,
                    key: intent.key,
                    filename: entry.file.name,
                    contentType: entry.file.type,
                    uploaderName: uploaderName.trim() || undefined,
                    sessionId: sessionIdRef.current,
                }),
            });
            updateFile(entry.id, { state: 'success', progress: 100, error: '' });
            return true;
        } catch (error) {
            updateFile(entry.id, { state: 'error', error: getErrorMessage(error, 'Ocurrió un error al subir este archivo.') });
            return false;
        }
    };

    const startUpload = async (entries = files.filter((entry) => entry.state === 'ready')) => {
        if (isUploading || !entries.length || !availability.canUpload) return;
        setIsUploading(true);
        setNotice('');
        let uploaded = 0;
        let nextFileIndex = 0;
        const worker = async () => {
            while (nextFileIndex < entries.length) {
                const entry = entries[nextFileIndex];
                nextFileIndex += 1;
                if (await uploadEntry(entry)) uploaded += 1;
            }
        };
        const workerCount = Math.min(getFileUploadConcurrency(), entries.length);
        await Promise.all(Array.from({ length: workerCount }, () => worker()));
        setIsUploading(false);
        if (uploaded > 0) {
            setNotice(uploaded === entries.length
                ? 'Tus recuerdos fueron enviados. Gracias por compartir este día con nosotros.'
                : 'Algunos recuerdos se enviaron. Puedes reintentar los que marcaron error.');
            if (config?.publicGalleryEnabled) void loadGallery();
        }
    };

    const retryEntry = (entry) => {
        if (!isUploading) void startUpload([{ ...entry, state: 'ready', error: '' }]);
    };

    if (configState === 'loading') return <StatusPanel title="Preparando el álbum" message="Estamos verificando el acceso seguro para compartir tus recuerdos." />;
    if (configState === 'error') return <StatusPanel title="No pudimos abrir este álbum" message={configMessage} action={<button type="button" onClick={() => void getConfig()} className="rounded-full bg-[#416869] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#315b5c]">Intentar de nuevo</button>} />;
    if (!availability.canUpload) return <StatusPanel title={availability.title} message={availability.message} />;

    return (
        <main className="min-h-screen bg-[#f8f6f0] pb-16 text-[#244b4c]">
            <header className="border-b border-[#d7ddd1] bg-white/75 px-5 py-4 backdrop-blur sm:px-8">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                    <p className="font-serif text-xl text-[#244b4c] sm:text-2xl">{config?.brideName || 'La novia'} <span className="text-[#758b7b]">&amp;</span> {config?.groomName || 'el novio'}</p>
                    <span className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6a8080] sm:flex"><ShieldCheck size={16} aria-hidden="true" /> Álbum privado</span>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-5 pt-10 sm:px-8 sm:pt-16">
                <section className="grid gap-8 rounded-[2rem] border border-[#d4ded4] bg-[#edf2ea] p-6 shadow-[0_18px_65px_rgba(36,75,76,0.07)] sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                    <div className="lg:pt-3">
                        <p className="text-[0.7rem] font-bold uppercase tracking-[0.26em] text-[#597779]">Álbum de boda</p>
                        <h1 className="mt-4 font-serif text-4xl leading-[1.03] text-[#244b4c] sm:text-5xl">Comparte<br />tus recuerdos</h1>
                        <p className="mt-5 max-w-sm text-base leading-7 text-[#526e6f]">Ayúdanos a guardar los momentos especiales de este día.</p>
                        <div className="mt-8 border-t border-[#cbd8cc] pt-5 text-sm leading-6 text-[#5d7879]">
                            <p><strong className="font-semibold text-[#385d5e]">Formatos:</strong> {acceptedTypesText}</p>
                            <p className="mt-1"><strong className="font-semibold text-[#385d5e]">Tamaño:</strong> hasta {formatBytes(Number(config?.limits?.maxImageSizeBytes))} por foto y {formatBytes(Number(config?.limits?.maxVideoSizeBytes))} por video.</p>
                            {(maxFiles || maxImages || maxVideos) ? <p className="mt-1"><strong className="font-semibold text-[#385d5e]">Por invitado/dispositivo:</strong>{maxFiles ? ` ${maxFiles} archivos` : ''}{maxImages ? `${maxFiles ? ' ·' : ''} ${maxImages} fotos` : ''}{maxVideos ? `${maxFiles || maxImages ? ' ·' : ''} ${maxVideos} videos` : ''}.</p> : null}
                        </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#d8e0d7] bg-white p-4 shadow-sm sm:p-6">
                        <label htmlFor="uploader-name" className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#5b7778]">Tu nombre <span className="normal-case tracking-normal text-[#879998]">(opcional)</span></label>
                        <input id="uploader-name" value={uploaderName} onChange={(event) => setUploaderName(event.target.value)} disabled={isUploading} placeholder="Escribe tu nombre" className="mt-2 min-h-12 w-full border-b border-[#bdcdbf] bg-transparent px-1 text-base text-[#244b4c] outline-none placeholder:text-[#9ba9a0] focus:border-[#416869] disabled:opacity-60" />

                        <input ref={fileInputRef} type="file" accept={allowedTypes.join(',')} multiple onChange={handlePickerChange} className="sr-only" tabIndex={-1} />
                        <input ref={cameraInputRef} type="file" accept={allowedTypes.join(',')} capture="environment" onChange={handlePickerChange} className="sr-only" tabIndex={-1} />
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading || (maxFiles > 0 && fileCountInSession >= maxFiles)} className="flex min-h-28 items-center justify-center gap-3 rounded-2xl border border-dashed border-[#9eb3a3] bg-[#f9fbf7] px-4 text-sm font-semibold text-[#365e5f] transition hover:border-[#416869] hover:bg-[#f1f6ee] disabled:cursor-not-allowed disabled:opacity-50">
                                <ImagePlus size={22} aria-hidden="true" /> Elegir fotos o videos
                            </button>
                            <button type="button" onClick={() => cameraInputRef.current?.click()} disabled={isUploading || (maxFiles > 0 && fileCountInSession >= maxFiles)} className="flex min-h-28 items-center justify-center gap-3 rounded-2xl bg-[#416869] px-4 text-sm font-semibold text-white transition hover:bg-[#315b5c] disabled:cursor-not-allowed disabled:opacity-50">
                                <Camera size={22} aria-hidden="true" /> Usar cámara
                            </button>
                        </div>
                        <p className="mt-3 text-center text-xs leading-5 text-[#758a7b]">Puedes elegir varios archivos. La carga se realiza de forma segura desde tu dispositivo.</p>

                        {notice ? (
                            <div className={`mt-5 rounded-xl px-4 py-3 text-sm leading-6 ${notice.includes('enviados') ? 'bg-[#e8f2e8] text-[#3e6850]' : 'bg-[#fbede8] text-[#994437]'}`} role="status" aria-live="polite">
                                {notice}
                            </div>
                        ) : null}

                        {files.length ? (
                            <>
                                <ul className="mt-5 space-y-2.5" aria-label="Archivos seleccionados">
                                    {files.map((entry) => <FileRow key={entry.id} entry={entry} onRemove={removeFile} onRetry={retryEntry} disabled={isUploading} />)}
                                </ul>
                                <button type="button" onClick={() => void startUpload()} disabled={isUploading || readyCount === 0} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#244b4c] px-5 text-sm font-bold text-white transition hover:bg-[#183d3e] disabled:cursor-not-allowed disabled:opacity-50">
                                    {isUploading ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : <Upload size={18} aria-hidden="true" />}
                                    {isUploading ? 'Enviando recuerdos…' : `Enviar ${readyCount || ''} ${readyCount === 1 ? 'recuerdo' : 'recuerdos'}`}
                                </button>
                                {successCount ? <p className="mt-3 text-center text-xs text-[#55796a]">{successCount} {successCount === 1 ? 'archivo enviado' : 'archivos enviados'}.</p> : null}
                            </>
                        ) : null}
                    </div>
                </section>

                {config?.publicGalleryEnabled ? (
                    <section className="mt-16 border-t border-[#d4ddd2] pt-12" aria-labelledby="memories-gallery-title">
                        <div className="max-w-xl">
                            <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#5c797a]">Momentos compartidos</p>
                            <h2 id="memories-gallery-title" className="mt-3 font-serif text-4xl text-[#244b4c]">Recuerdos del día</h2>
                            <p className="mt-3 text-base leading-7 text-[#5a7475]">Una selección de fotos y videos aprobados por los novios.</p>
                        </div>
                        <div className="mt-8">
                            {galleryState === 'loading' ? <p className="text-sm text-[#667f7f]">Cargando la galería…</p> : null}
                            {galleryState === 'error' ? <p className="text-sm text-[#667f7f]">La galería no está disponible ahora; puedes seguir compartiendo tus recuerdos.</p> : null}
                            {galleryState === 'ready' ? <Gallery items={gallery} onOpen={setActiveMedia} /> : null}
                        </div>
                    </section>
                ) : null}
            </div>

            {activeMedia ? <MediaLightbox item={activeMedia} onClose={() => setActiveMedia(null)} /> : null}
        </main>
    );
}
