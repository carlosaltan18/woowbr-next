'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    AlertCircle,
    ArrowLeft,
    Check,
    ChevronDown,
    Download,
    FolderArchive,
    Images,
    LoaderCircle,
    LockKeyhole,
    Play,
    ShieldCheck,
    Video,
    X,
} from 'lucide-react';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
const PAGE_SIZE = 24;

const FILTERS = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'approved', label: 'Aprobados' },
    { value: 'rejected', label: 'No publicados' },
];

const formatBytes = (bytes) => {
    if (!Number.isFinite(Number(bytes))) return '—';
    if (Number(bytes) <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(Number(bytes)) / Math.log(1024)), units.length - 1);
    return `${(Number(bytes) / (1024 ** index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (value) => {
    if (!value) return 'Sin fecha';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

const firstNumber = (...values) => {
    const value = values.find((candidate) => Number.isFinite(Number(candidate)));
    return value === undefined ? 0 : Number(value);
};

const getMediaKind = (media = {}) => (
    media.mediaType === 'video' || String(media.contentType || '').startsWith('video/') ? 'video' : 'image'
);

const getMediaId = (media = {}) => media.id || media._id;

const statusDetails = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'approved') return { label: 'Aprobado', className: 'bg-[#e6f1e6] text-[#3e6d52]' };
    if (normalized === 'rejected') return { label: 'No publicado', className: 'bg-[#f4e9e4] text-[#a34a3d]' };
    return { label: 'Pendiente', className: 'bg-[#f5eedc] text-[#836b27]' };
};

const getMessage = (error, fallback) => {
    if (typeof error?.message === 'string' && error.message.trim()) return error.message;
    return fallback;
};

async function requestJson(path, manageToken, options = {}) {
    if (!API_BASE_URL) {
        throw new Error('El servicio del álbum no está configurado.');
    }
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        cache: 'no-store',
        headers: {
            Accept: 'application/json',
            'X-Wedding-Manage-Token': manageToken,
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

function AccessState({ title, message, retry }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f8f6f0] px-5 py-10 text-[#244b4c]">
            <section className="w-full max-w-xl rounded-[2rem] border border-[#d7ddd1] bg-white p-7 text-center shadow-[0_18px_65px_rgba(36,75,76,0.08)] sm:p-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e7eee6] text-[#416869]">
                    <LockKeyhole size={22} aria-hidden="true" />
                </div>
                <p className="mt-6 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#6a8080]">Álbum privado</p>
                <h1 className="mt-3 font-serif text-4xl leading-tight text-[#244b4c]">{title}</h1>
                <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#557071]">{message}</p>
                {retry ? <button type="button" onClick={retry} className="mt-7 min-h-11 rounded-full bg-[#416869] px-6 text-sm font-bold text-white transition hover:bg-[#315b5c]">Intentar de nuevo</button> : null}
            </section>
        </main>
    );
}

function StatCard({ icon: Icon, value, label, tone = 'cream' }) {
    const tones = {
        cream: 'border-[#d8dfd5] bg-[#fcfcf9] text-[#305a5b]',
        sage: 'border-[#d1ddd2] bg-[#e9f0e8] text-[#416b55]',
        gold: 'border-[#e6d9b7] bg-[#fbf5e5] text-[#806a2d]',
        blue: 'border-[#d2dfe2] bg-[#edf4f4] text-[#3c6870]',
    };
    return (
        <article className={`rounded-2xl border p-4 sm:p-5 ${tones[tone]}`}>
            <Icon size={19} aria-hidden="true" />
            <p className="mt-5 font-serif text-3xl leading-none">{value}</p>
            <p className="mt-2 text-[0.67rem] font-bold uppercase tracking-[0.16em]">{label}</p>
        </article>
    );
}

function StorageCard({ usedBytes, limitBytes }) {
    const hasLimit = limitBytes > 0;
    const percentage = hasLimit
        ? Math.min(100, Math.round((usedBytes / limitBytes) * 100))
        : 0;

    return (
        <article className="rounded-2xl border border-[#d8dfd5] bg-[#fcfcf9] p-4 text-[#305a5b] sm:p-5">
            <FolderArchive size={19} aria-hidden="true" />
            <p className="mt-5 text-xl font-semibold leading-none sm:text-2xl">
                {formatBytes(usedBytes)} <span className="text-sm font-normal text-[#6c8383]">/ {hasLimit ? formatBytes(limitBytes) : 'sin límite'}</span>
            </p>
            {hasLimit ? <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#dde7dd]" role="progressbar" aria-label="Espacio usado del álbum" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
                <div className="h-full rounded-full bg-[#557f70] transition-[width]" style={{ width: `${percentage}%` }} />
            </div> : null}
            <p className="mt-2 text-[0.67rem] font-bold uppercase tracking-[0.16em]">Espacio usado</p>
        </article>
    );
}

function MediaLightbox({ media, onClose }) {
    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [onClose]);

    const isVideo = getMediaKind(media) === 'video';
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a2b]/90 p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={media.filename || 'Recuerdo de boda'}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25" aria-label="Cerrar visor">
                <X size={22} aria-hidden="true" />
            </button>
            <div className="max-h-full max-w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
                {isVideo
                    ? <video src={media.url} controls preload="metadata" playsInline className="max-h-[82vh] max-w-[92vw]" />
                    : <img src={media.url} alt={media.filename || 'Recuerdo de boda'} className="max-h-[82vh] max-w-[92vw] object-contain" decoding="async" />}
            </div>
        </div>
    );
}

function ExportPanel({ exportState, onStart, onDownload, disabled }) {
    const status = exportState?.status;
    const isWorking = ['pending', 'processing'].includes(String(status).toLowerCase());
    const isReady = String(status).toLowerCase() === 'ready' && exportState?.url;
    const isExpired = String(status).toLowerCase() === 'expired';

    return (
        <section className="rounded-[1.5rem] border border-[#cbd9cd] bg-[#edf3eb] p-5 sm:p-6" aria-labelledby="export-title">
            <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#416869] shadow-sm"><FolderArchive size={21} aria-hidden="true" /></div>
                <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#597779]">Archivo de recuerdos</p>
                    <h2 id="export-title" className="mt-1 font-serif text-2xl text-[#244b4c]">Descarga completa</h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#5b7475]">Prepararemos un ZIP con todos los archivos disponibles. Puede tardar unos minutos según el tamaño del álbum.</p>
                </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
                {!isReady ? (
                    <button type="button" onClick={onStart} disabled={disabled || isWorking} className="flex min-h-11 items-center gap-2 rounded-full bg-[#244b4c] px-5 text-sm font-bold text-white transition hover:bg-[#183d3e] disabled:cursor-not-allowed disabled:opacity-60">
                        {isWorking ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : <FolderArchive size={17} aria-hidden="true" />}
                        {isWorking ? 'Preparando tu archivo…' : 'Preparar descarga completa'}
                    </button>
                ) : (
                    <button type="button" onClick={onDownload} className="flex min-h-11 items-center gap-2 rounded-full bg-[#416869] px-5 text-sm font-bold text-white transition hover:bg-[#315b5c]"><Download size={17} aria-hidden="true" /> Descargar álbum</button>
                )}
                {isWorking ? <span className="text-sm text-[#567473]" role="status" aria-live="polite">Se actualizará automáticamente al estar listo.</span> : null}
                {isExpired ? <span className="text-sm text-[#8a6038]" role="status">El enlace de descarga venció. Puedes preparar uno nuevo.</span> : null}
                {exportState?.error ? <span className="text-sm text-[#a34335]" role="alert">{exportState.error}</span> : null}
            </div>
        </section>
    );
}

export default function WeddingAlbumManager() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = typeof params?.slug === 'string' ? params.slug : '';
    const manageFromUrl = searchParams.get('manage');
    const [manageToken, setManageToken] = useState(null);
    const [accessState, setAccessState] = useState('initializing');
    const [accessMessage, setAccessMessage] = useState('');
    const [config, setConfig] = useState(null);
    const [media, setMedia] = useState([]);
    const [mediaState, setMediaState] = useState('idle');
    const [mediaError, setMediaError] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [activeMedia, setActiveMedia] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const [reviewingId, setReviewingId] = useState(null);
    const [exportState, setExportState] = useState(null);

    const storageKey = useMemo(() => (slug ? `woowbe:wedding-manage:${slug}` : null), [slug]);

    useEffect(() => {
        if (!slug || !storageKey) return;
        const token = manageFromUrl || window.sessionStorage.getItem(storageKey);
        if (!token) {
            setAccessState('invalid');
            setAccessMessage('Este portal se abre con el enlace privado original. Copiar la dirección después de abrirlo no conserva el acceso por seguridad; solicita que te compartan el enlace completo nuevamente.');
            return;
        }

        window.sessionStorage.setItem(storageKey, token);
        setManageToken(token);
        setAccessState('loading');

        if (manageFromUrl) {
            const url = new URL(window.location.href);
            url.searchParams.delete('manage');
            window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
        }
    }, [manageFromUrl, slug, storageKey]);

    const loadConfig = useCallback(async () => {
        if (!slug || !manageToken) return;
        try {
            const data = await requestJson(`/public/weddings/${encodeURIComponent(slug)}/manage/config`, manageToken);
            setConfig(data);
            setAccessState('ready');
        } catch (error) {
            if ([401, 403, 404].includes(error.status)) {
                window.sessionStorage.removeItem(storageKey);
                setAccessState('invalid');
                setAccessMessage('Este enlace privado no es válido, fue reemplazado o ya venció. Solicita uno nuevo a Woowbe.');
            } else {
                setAccessState('error');
                setAccessMessage(getMessage(error, 'No pudimos conectar con el álbum en este momento.'));
            }
        }
    }, [manageToken, slug, storageKey]);

    const loadMedia = useCallback(async ({ targetPage = 1, append = false } = {}) => {
        if (!slug || !manageToken) return;
        setMediaState(append ? 'loading-more' : 'loading');
        setMediaError('');
        try {
            const query = new URLSearchParams({ page: String(targetPage), limit: String(PAGE_SIZE) });
            if (filter !== 'all') query.set('status', filter);
            const data = await requestJson(`/public/weddings/${encodeURIComponent(slug)}/manage/media?${query.toString()}`, manageToken);
            const items = Array.isArray(data?.items) ? data.items : [];
            setMedia((current) => (append ? [...current, ...items] : items));
            setPage(targetPage);
            const total = Number(data?.total);
            setHasMore(Number.isFinite(total) ? targetPage * PAGE_SIZE < total : items.length === PAGE_SIZE);
            setMediaState('ready');
        } catch (error) {
            if ([401, 403, 404].includes(error.status)) {
                window.sessionStorage.removeItem(storageKey);
                setAccessState('invalid');
                setAccessMessage('Este enlace privado no es válido, fue reemplazado o ya venció. Solicita uno nuevo a Woowbe.');
            } else {
                setMediaState('error');
                setMediaError(getMessage(error, 'No pudimos cargar los recuerdos. Intenta de nuevo.'));
            }
        }
    }, [filter, manageToken, slug, storageKey]);

    useEffect(() => {
        if (manageToken) void loadConfig();
    }, [loadConfig, manageToken]);

    useEffect(() => {
        if (manageToken && accessState === 'ready') void loadMedia();
    }, [accessState, filter, loadMedia, manageToken]);

    const requestExport = async () => {
        if (!slug || !manageToken) return;
        setExportState({ status: 'pending', error: '' });
        try {
            const data = await requestJson(`/public/weddings/${encodeURIComponent(slug)}/manage/exports`, manageToken, { method: 'POST' });
            setExportState({
                status: data?.status || 'pending',
                id: data?.exportId || data?.id || data?._id,
                url: data?.url || data?.downloadUrl,
                error: '',
            });
        } catch (error) {
            setExportState({ status: 'failed', error: getMessage(error, 'No pudimos preparar la descarga completa.') });
        }
    };

    useEffect(() => {
        const exportId = exportState?.id;
        const status = String(exportState?.status || '').toLowerCase();
        if (!manageToken || !slug || !exportId || !['pending', 'processing'].includes(status)) return undefined;

        let cancelled = false;
        let timeoutId;
        const poll = async () => {
            try {
                const data = await requestJson(`/public/weddings/${encodeURIComponent(slug)}/manage/exports/${encodeURIComponent(exportId)}`, manageToken);
                if (cancelled) return;
                const nextStatus = data?.status || 'processing';
                setExportState({
                    status: nextStatus,
                    id: exportId,
                    url: data?.url || data?.downloadUrl,
                    error: '',
                });
                if (['pending', 'processing'].includes(String(nextStatus).toLowerCase())) timeoutId = window.setTimeout(poll, 5000);
            } catch (error) {
                if (!cancelled) setExportState({ status: 'failed', id: exportId, error: getMessage(error, 'No pudimos verificar la descarga completa.') });
            }
        };
        timeoutId = window.setTimeout(poll, 2500);
        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, [exportState?.id, exportState?.status, manageToken, slug]);

    const downloadMedia = async (item) => {
        const mediaId = getMediaId(item);
        if (!mediaId || !slug || !manageToken) return;
        setDownloadingId(mediaId);
        try {
            const data = await requestJson(`/public/weddings/${encodeURIComponent(slug)}/manage/media/${encodeURIComponent(mediaId)}/download`, manageToken);
            const url = data?.url || data?.downloadUrl;
            if (!url) throw new Error('No recibimos un enlace de descarga válido.');
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            setMediaError(getMessage(error, 'No pudimos preparar la descarga. Intenta de nuevo.'));
        } finally {
            setDownloadingId(null);
        }
    };

    const reviewMedia = async (item, decision) => {
        const mediaId = getMediaId(item);
        if (!mediaId || !slug || !manageToken) return;

        const action = decision === 'approve' ? 'approve' : 'reject';
        const nextStatus = action === 'approve' ? 'approved' : 'rejected';
        setReviewingId(`${mediaId}:${action}`);
        setMediaError('');
        try {
            await requestJson(
                `/public/weddings/${encodeURIComponent(slug)}/manage/media/${encodeURIComponent(mediaId)}/${action}`,
                manageToken,
                { method: 'PATCH' },
            );
            // Actualización inmediata para que el estado se sienta ágil, seguida
            // por una consulta nueva para sincronizar contadores y filtros.
            setMedia((current) => current.map((entry) => (
                getMediaId(entry) === mediaId ? { ...entry, status: nextStatus } : entry
            )));
            void loadConfig();
            void loadMedia({ targetPage: 1 });
        } catch (error) {
            setMediaError(getMessage(error, action === 'approve'
                ? 'No pudimos aprobar este recuerdo. Intenta de nuevo.'
                : 'No pudimos ocultar este recuerdo. Intenta de nuevo.'));
        } finally {
            setReviewingId(null);
        }
    };

    const downloadExport = () => {
        const url = exportState?.url || exportState?.downloadUrl;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };

    const stats = useMemo(() => {
        const values = config?.stats || config?.statistics || config?.summary || {};
        return {
            images: firstNumber(values.photos, values.images, values.totalImages, config?.photos, config?.images, config?.totalImages),
            videos: firstNumber(values.videos, values.totalVideos, config?.videos, config?.totalVideos),
            pending: firstNumber(values.pending, values.pendingCount, config?.pending, config?.pendingCount),
            approved: firstNumber(values.approved, values.approvedCount, config?.approved, config?.approvedCount),
            totalSize: firstNumber(values.usedBytes, values.totalSizeBytes, values.totalBytes, values.sizeBytes, config?.usedBytes, config?.totalSizeBytes),
            storageLimit: firstNumber(config?.limits?.maxTotalStorageBytes, config?.maxTotalStorageBytes),
        };
    }, [config]);

    if (accessState === 'initializing' || accessState === 'loading') return <AccessState title="Preparando tu álbum" message="Estamos verificando tu acceso privado." />;
    if (accessState === 'invalid') return <AccessState title="No pudimos abrir este álbum" message={accessMessage} />;
    if (accessState === 'error') return <AccessState title="El álbum no está disponible" message={accessMessage} retry={() => void loadConfig()} />;

    return (
        <main className="min-h-screen bg-[#f8f6f0] pb-14 text-[#244b4c]">
            <header className="border-b border-[#d7ddd1] bg-white/80 px-5 py-4 backdrop-blur sm:px-8">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div>
                        <p className="font-serif text-xl sm:text-2xl">{config?.brideName || 'La novia'} <span className="text-[#7f967f]">&amp;</span> {config?.groomName || 'el novio'}</p>
                        <p className="mt-0.5 text-xs uppercase tracking-[0.15em] text-[#6c8383]">Tus recuerdos de boda</p>
                    </div>
                    <button type="button" onClick={() => window.location.assign(`/${encodeURIComponent(slug)}`)} className="flex min-h-10 items-center gap-2 rounded-full border border-[#cbd8cd] bg-white px-3.5 text-xs font-bold uppercase tracking-[0.11em] text-[#416869] transition hover:bg-[#eef3eb]" aria-label="Volver a la invitación">
                        <ArrowLeft size={16} aria-hidden="true" /><span className="hidden sm:inline">Invitación</span>
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-5 pt-9 sm:px-8 sm:pt-12">
                <section className="rounded-[2rem] border border-[#d0ddd1] bg-[#edf3eb] p-6 shadow-[0_18px_65px_rgba(36,75,76,0.07)] sm:p-9">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#5c797a]">Álbum privado</p>
                            <h1 className="mt-3 font-serif text-4xl leading-tight text-[#244b4c] sm:text-5xl">Los recuerdos de<br className="hidden sm:block" /> su gran día</h1>
                            <p className="mt-4 text-base leading-7 text-[#557172]">Aquí encontrarás cada foto y video compartido por sus invitados. Los elementos pendientes aún están en revisión.</p>
                        </div>
                        {config?.eventDate ? <p className="border-t border-[#cbd8cd] pt-4 text-sm text-[#587576] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"><strong className="font-semibold text-[#315b5c]">Celebración:</strong><br />{formatDate(config.eventDate)}</p> : null}
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
                        <StatCard icon={Images} value={stats.images} label="Fotos" tone="cream" />
                        <StatCard icon={Video} value={stats.videos} label="Videos" tone="blue" />
                        <StatCard icon={AlertCircle} value={stats.pending} label="Pendientes" tone="gold" />
                        <StatCard icon={Check} value={stats.approved} label="Aprobados" tone="sage" />
                        <StorageCard usedBytes={stats.totalSize} limitBytes={stats.storageLimit} />
                    </div>
                </section>

                <div className="mt-8">
                    <ExportPanel exportState={exportState} onStart={() => void requestExport()} onDownload={downloadExport} disabled={!media.length} />
                </div>

                <section className="mt-12" aria-labelledby="album-gallery-title">
                    <div className="flex flex-col gap-5 border-b border-[#d3ddd4] pb-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#5d7a7b]">Galería</p>
                            <h2 id="album-gallery-title" className="mt-2 font-serif text-4xl text-[#244b4c]">Tus momentos compartidos</h2>
                        </div>
                        <div className="flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="Filtros de galería">
                            {FILTERS.map((item) => (
                                <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`min-h-10 shrink-0 rounded-full px-4 text-xs font-bold uppercase tracking-[0.11em] transition ${filter === item.value ? 'bg-[#244b4c] text-white' : 'border border-[#ccd8cd] bg-white text-[#557374] hover:bg-[#edf3eb]'}`}>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {mediaError ? <p className="mt-5 rounded-xl bg-[#fbede8] px-4 py-3 text-sm leading-6 text-[#9d4638]" role="alert">{mediaError}</p> : null}
                    {mediaState === 'loading' ? <p className="mt-8 text-sm text-[#637d7e]" role="status">Cargando recuerdos…</p> : null}
                    {mediaState === 'error' ? <button type="button" onClick={() => void loadMedia()} className="mt-6 rounded-full border border-[#9db6a1] px-5 py-2.5 text-sm font-semibold text-[#3e6667]">Intentar de nuevo</button> : null}
                    {mediaState === 'ready' && !media.length ? <p className="mt-8 rounded-2xl border border-dashed border-[#cfd8cf] px-5 py-10 text-center text-sm leading-6 text-[#667f7f]">Aún no hay recuerdos en esta sección.</p> : null}

                    {media.length ? (
                        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {media.map((item) => {
                                const mediaId = getMediaId(item);
                                const isVideo = getMediaKind(item) === 'video';
                                const status = statusDetails(item.status);
                                const source = item.thumbnailUrl || item.url;
                                return (
                                    <article key={mediaId || item.url} className="overflow-hidden rounded-2xl border border-[#d7dfd6] bg-white shadow-sm">
                                        <button type="button" onClick={() => setActiveMedia(item)} className="group relative block aspect-[4/3] w-full overflow-hidden bg-[#dde6dc] text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#416869]" aria-label={`Abrir ${isVideo ? 'video' : 'foto'}: ${item.filename || 'recuerdo de boda'}`}>
                                            {isVideo
                                                ? item.thumbnailUrl
                                                    ? <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                                                    : <span className="flex h-full w-full items-center justify-center bg-[#315b5c] text-white/85"><Video size={34} aria-hidden="true" /></span>
                                                : <img src={source} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" />}
                                            {isVideo ? <span className="absolute inset-0 flex items-center justify-center bg-[#173f40]/25 text-white"><span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/20 backdrop-blur-sm"><Play size={18} fill="currentColor" aria-hidden="true" /></span></span> : null}
                                        </button>
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-[#294e4f]">{item.filename || 'Recuerdo de boda'}</p>
                                                    <p className="mt-1 text-xs text-[#718787]">{isVideo ? 'Video' : 'Foto'} · {formatBytes(item.size)}</p>
                                                </div>
                                                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.09em] ${status.className}`}>{status.label}</span>
                                            </div>
                                            <p className="mt-3 text-xs text-[#718787]">{formatDate(item.uploadedAt || item.createdAt)}{item.uploaderName ? ` · ${item.uploaderName}` : ''}</p>
                                            {String(item.status || 'pending').toLowerCase() === 'pending' ? (
                                                <div className="mt-4 grid grid-cols-2 gap-2" aria-label={`Revisar ${item.filename || 'recuerdo'}`}>
                                                    <button type="button" onClick={() => void reviewMedia(item, 'approve')} disabled={!mediaId || Boolean(reviewingId)} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#416b55] px-2 text-xs font-bold uppercase tracking-[0.09em] text-white transition hover:bg-[#315d46] disabled:cursor-not-allowed disabled:opacity-60">
                                                        {reviewingId === `${mediaId}:approve` ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Check size={15} aria-hidden="true" />}
                                                        Aprobar
                                                    </button>
                                                    <button type="button" onClick={() => void reviewMedia(item, 'reject')} disabled={!mediaId || Boolean(reviewingId)} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[#dfc8bd] px-2 text-xs font-bold uppercase tracking-[0.09em] text-[#9a4a3c] transition hover:bg-[#fbefeb] disabled:cursor-not-allowed disabled:opacity-60">
                                                        {reviewingId === `${mediaId}:reject` ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <X size={15} aria-hidden="true" />}
                                                        No publicar
                                                    </button>
                                                </div>
                                            ) : null}
                                            <button type="button" onClick={() => void downloadMedia(item)} disabled={!mediaId || downloadingId === mediaId} className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#c9d8cc] text-xs font-bold uppercase tracking-[0.11em] text-[#416869] transition hover:bg-[#eef4ec] disabled:cursor-not-allowed disabled:opacity-60">
                                                {downloadingId === mediaId ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
                                                Descargar
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : null}

                    {hasMore ? <div className="mt-8 text-center"><button type="button" onClick={() => void loadMedia({ targetPage: page + 1, append: true })} disabled={mediaState === 'loading-more'} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#9db5a0] px-5 text-sm font-semibold text-[#3c6465] transition hover:bg-[#edf3eb] disabled:opacity-60">{mediaState === 'loading-more' ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : <ChevronDown size={17} aria-hidden="true" />} Cargar más</button></div> : null}
                </section>

                <p className="mt-12 flex items-center justify-center gap-2 text-center text-xs leading-5 text-[#718787]"><ShieldCheck size={15} aria-hidden="true" /> Este enlace es privado. No lo compartas fuera de las personas autorizadas.</p>
            </div>

            {activeMedia ? <MediaLightbox media={activeMedia} onClose={() => setActiveMedia(null)} /> : null}
        </main>
    );
}
