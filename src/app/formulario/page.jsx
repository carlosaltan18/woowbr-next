import React from 'react'
import { ServiceRequestForm } from '@/app/formulario/components/registrar-cliente'
import { Suspense } from "react";

export default function Page() {
  return (
     <Suspense>
      <ServiceRequestForm/>
    </Suspense>
  )
}
