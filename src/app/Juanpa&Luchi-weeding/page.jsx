import { Suspense } from 'react';
import InvitacionJuanpaLuchi from './components/invitacion-juanpa-luchi';

const SHARE_IMAGE = 'https://res.cloudinary.com/dclzsvu62/image/upload/c_fill,g_auto,w_1200,h_630,f_auto,q_auto/v1790873382/WhatsApp_Image_2026-09-24_at_10.40.07_PM_dd8odu.jpg';

export const metadata = {
    title: 'Luchi & Juanpa · 27 de febrero de 2027',
    description: 'Con mucha ilusión queremos compartir contigo el comienzo de esta nueva etapa de nuestra historia.',
    openGraph: {
        type: 'website',
        locale: 'es_GT',
        url: 'https://www.woowbegt.com/Juanpa&Luchi-weeding',
        title: 'Luchi & Juanpa',
        description: '27 de febrero de 2027',
        images: [{
            url: SHARE_IMAGE,
            width: 1200,
            height: 630,
            alt: 'Luchi y Juanpa',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Luchi & Juanpa',
        description: '27 de febrero de 2027',
        images: [SHARE_IMAGE],
    },
};

export default function Page() {
    return <Suspense fallback={null}><InvitacionJuanpaLuchi /></Suspense>;
}
