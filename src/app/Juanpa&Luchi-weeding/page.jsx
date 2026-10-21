import { Suspense } from 'react';
import InvitacionJuanpaLuchi from './components/invitacion-juanpa-luchi';

export default function Page() {
    return <Suspense fallback={null}><InvitacionJuanpaLuchi /></Suspense>;
}
