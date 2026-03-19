import React from 'react'
import { InvitacionBoda } from '@/app/karla&carlos-weeding/components/invitacion-karla-carlos'
import { Suspense } from "react";

export default function Page() {
  return (
     <Suspense>
      <InvitacionBoda />
    </Suspense>
  )
}
