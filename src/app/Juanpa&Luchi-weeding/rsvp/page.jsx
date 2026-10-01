import { Suspense } from 'react';
import { RsvpJuanpaLuchi } from '../components/invitacion-juanpa-luchi';

export default function Page() {
    return <Suspense fallback={null}><RsvpJuanpaLuchi /></Suspense>;
}
