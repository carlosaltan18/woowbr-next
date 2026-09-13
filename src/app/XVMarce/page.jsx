import { Suspense } from 'react';
import { InvitacionXVLiz } from './components/invitacion-xv-liz';

export default function Page() {
  return (
    <Suspense>
      <InvitacionXVLiz />
    </Suspense>
  );
}
