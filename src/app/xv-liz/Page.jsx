import React from 'react'
import { InvitacionXVLiz } from './components/invitacion-xv-liz'
import { Suspense } from "react";

export default function Page() {
  return (
     <Suspense>
      <InvitacionXVLiz />
    </Suspense>
  )
}
