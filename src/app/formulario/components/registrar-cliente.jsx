"use client"

import { useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock, Info } from "lucide-react"

const SPREADSHEET_ID = "1dOxZkNJk2rRelPXvI6hZ0ERYkG8quS6iSzIQZSGhY94"
const SPREADSHEET_RANGE = "Hoja 1!A:Q"

const productosInteres = [
    "Espejo",
    "Medio punto",
    "Cuadrada",
    "Tela",
    "Pared",
    "Malla",
    "Cubos",
    "Rotulo PVC (indicar medida)",
    "Numeros papel",
    "Numeros PVC",
    "Rotulo bar (indicar medida y cantidad)",
    "Invitaciones",
    "Mampara shots",
    "Invitacion Digital",
    "Termos",
    "Batas",
    "Envio",
]

const asesores = ["Alejandro", "Yami", "Tephy", "Jacky"]
const mediosContacto = ["Whatsapp", "Instagram", "Tik Tok"]
const formasPago = ["Tarjeta", "Efectivo", "Transferencia"]
const tipoPago = ["Cotizacion", "Anticipo", "Pago total", "Reserva de Fecha"]
const tipoEvento = ["Presencial", "Virtual"]
const confirmaciones = ["Pendiente", "Confirmado"]

export function ServiceRequestForm() {
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [telefono, setTelefono] = useState("")
    const [email, setEmail] = useState("")
    const [lugar, setLugar] = useState("")
    const [fecha, setFecha] = useState(null)
    const [tipoEventoSeleccionado, setTipoEventoSeleccionado] = useState(tipoEvento[0])
    const [confirmacion, setConfirmacion] = useState(confirmaciones[0])
    const [productosSeleccionados, setProductosSeleccionados] = useState([])
    const [otros, setOtros] = useState("")
    const [asesorSeleccionado, setAsesorSeleccionado] = useState(asesores[0])
    const [mediosSeleccionados, setMediosSeleccionados] = useState([])
    const [formaPagoSeleccionada, setFormaPagoSeleccionada] = useState("")
    const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = useState("")
    const [autorizacion, setAutorizacion] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState("")

    const toggleProducto = (producto) => {
        setProductosSeleccionados((prev) =>
            prev.includes(producto) ? prev.filter((p) => p !== producto) : [...prev, producto]
        )
    }

    const toggleMedio = (medio) => {
        setMediosSeleccionados((prev) =>
            prev.includes(medio) ? prev.filter((m) => m !== medio) : [...prev, medio]
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")

        if (!nombre || !apellido || !telefono || !email || !lugar || !fecha) {
            setMessage("Por favor completa los campos obligatorios.")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch("/api/registrarClientePeticion/registrarCliente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    spreadsheetId: SPREADSHEET_ID,
                    range: SPREADSHEET_RANGE,
                    values: [
                        nombre,
                        apellido,
                        confirmacion,
                        new Date().toISOString(),
                        telefono,
                        email,
                        lugar,
                        asesorSeleccionado,
                        mediosSeleccionados.join(", "),
                        productosSeleccionados.join(", "),
                        otros,
                        formaPagoSeleccionada,
                        tipoPagoSeleccionado,
                        autorizacion,
                        fecha ? format(fecha, "yyyy-MM-dd") : ""
                    ],
                    nombre,
                    apellido,
                    confirmacion,
                    fechaRegistro: new Date().toISOString(),
                    telefono,
                    email,
                    lugar,
                    asesor: asesorSeleccionado,
                    medioContacto: mediosSeleccionados.join(", "),
                    productos: productosSeleccionados.join(", "),
                    otros,
                    formaPago: formaPagoSeleccionada,
                    tipoPago: tipoPagoSeleccionado,
                    autorizacion,
                    fechaEvento: fecha ? format(fecha, "yyyy-MM-dd") : "",
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || "Error en la solicitud")
            }

            setMessage("Registro enviado correctamente.")
            setNombre("")
            setApellido("")
            setTelefono("")
            setEmail("")
            setLugar("")
            setFecha(null)
            setTipoEventoSeleccionado(tipoEvento[0])
            setConfirmacion(confirmaciones[0])
            setProductosSeleccionados([])
            setOtros("")
            setAsesorSeleccionado(asesores[0])
            setMediosSeleccionados([])
            setFormaPagoSeleccionada("")
            setTipoPagoSeleccionado("")
            setAutorizacion("")
        } catch (error) {
            console.error(error)
            setMessage("No se pudo enviar la solicitud. Intenta nuevamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                {/* Header Section */}
                <header className="mb-10 text-center">
                    {/* Logo placeholder */}
                    <div className="mb-6 flex justify-center">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-neutral-300 bg-white">
                            <Image
                                src="/wowbe.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="font-serif text-3xl font-light tracking-wide text-neutral-900 sm:text-4xl">
                        Registro ExpoBoda 2026
                    </h1>
                    <div className="mx-auto mt-4 h-px w-24 bg-neutral-300" />
                    <p className="mt-4 font-sans text-sm text-neutral-600">
                        Reserva tu fecha con nosotros
                    </p>
                </header>

                {/* Main Card */}
                <div className="border border-neutral-200 bg-white shadow-sm">
                    {/* Info Banner */}
                    <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-5 sm:px-8">
                        <p className="text-sm leading-relaxed text-neutral-700">
                            Gracias por tu interes en nuestros servicios. Para asegurarte de que la fecha que
                            deseas este disponible, completa este formulario con tus datos. Nos pondremos en
                            contacto contigo lo antes posible para confirmar tu reserva.
                        </p>
                        <div className="mt-4 flex flex-col gap-2 text-sm text-neutral-600">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-neutral-400" />
                                <span>
                                    <span className="font-medium text-neutral-800">Horario de atencion:</span> Lunes a Domingo | 8:30 - 17:30 hrs
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-neutral-400" />
                                <span>
                                    <span className="font-medium text-neutral-800">Importante:</span> La reserva estara sujeta a disponibilidad
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8">
                        <p className="mb-8 text-xs text-neutral-500">
                            Los campos marcados con <span className="text-neutral-900">*</span> son obligatorios
                        </p>

                        {message ? (
                            <p className="mb-6 rounded border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                                {message}
                            </p>
                        ) : null}

                        <div className="space-y-8">
                            {/* Personal Information Section */}
                            <section>
                                <h2 className="mb-6 border-b border-neutral-200 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Informacion Personal
                                </h2>
                                <div className="space-y-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="nombre" className="text-sm font-medium text-neutral-800">
                                                Nombre <span className="text-neutral-400">*</span>
                                            </Label>
                                            <Input
                                                id="nombre"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                required
                                                className="mt-2 rounded-none border-neutral-300 bg-white focus:border-neutral-900 focus:ring-neutral-900"
                                                placeholder="Carlos"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="apellido" className="text-sm font-medium text-neutral-800">
                                                Apellido <span className="text-neutral-400">*</span>
                                            </Label>
                                            <Input
                                                id="apellido"
                                                value={apellido}
                                                onChange={(e) => setApellido(e.target.value)}
                                                required
                                                className="mt-2 rounded-none border-neutral-300 bg-white focus:border-neutral-900 focus:ring-neutral-900"
                                                placeholder="López"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="telefono" className="text-sm font-medium text-neutral-800">
                                                Telefono <span className="text-neutral-400">*</span>
                                            </Label>
                                            <Input
                                                id="telefono"
                                                type="tel"
                                                value={telefono}
                                                onChange={(e) => setTelefono(e.target.value)}
                                                required
                                                className="mt-2 rounded-none border-neutral-300 bg-white focus:border-neutral-900 focus:ring-neutral-900"
                                                placeholder="+502 0000 0000"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="text-sm font-medium text-neutral-800">
                                                Correo electronico <span className="text-neutral-400">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="mt-2 rounded-none border-neutral-300 bg-white focus:border-neutral-900 focus:ring-neutral-900"
                                                placeholder="correo@ejemplo.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Event Details Section */}
                            <section>
                                <h2 className="mb-6 border-b border-neutral-200 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Detalles del Evento
                                </h2>
                                <div className="space-y-5">
                                    <div>
                                        <Label htmlFor="lugar" className="text-sm font-medium text-neutral-800">
                                            Lugar del Evento <span className="text-neutral-400">*</span>
                                        </Label>
                                        <Input
                                            id="lugar"
                                            value={lugar}
                                            onChange={(e) => setLugar(e.target.value)}
                                            required
                                            className="mt-2 rounded-none border-neutral-300 bg-white focus:border-neutral-900 focus:ring-neutral-900"
                                            placeholder="Nombre del salon o direccion"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-neutral-800">
                                            Fecha del Evento <span className="text-neutral-400">*</span>
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "mt-2 w-full justify-start rounded-none border-neutral-300 bg-white text-left font-normal hover:bg-neutral-50",
                                                        !fecha && "text-neutral-500"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
                                                    {fecha ? format(fecha, "d 'de' MMMM, yyyy", { locale: es }) : "Selecciona una fecha"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto rounded-none border-neutral-200 p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={fecha}
                                                    onSelect={setFecha}
                                                    initialFocus
                                                    locale={es}
                                                    className="rounded-none"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    

                                    <div>
                                        <Label className="text-sm font-medium text-neutral-800">Confirmacion</Label>
                                        <RadioGroup
                                            value={confirmacion}
                                            onValueChange={setConfirmacion}
                                            className="mt-3 flex flex-wrap gap-3"
                                        >
                                            {confirmaciones.map((opcion) => (
                                                <label
                                                    key={opcion}
                                                    className="flex cursor-pointer items-center justify-center border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-400 has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-900 has-[:checked]:text-white"
                                                >
                                                    <RadioGroupItem value={opcion} id={`confirmacion-${opcion}`} className="sr-only" />
                                                    {opcion}
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                </div>
                            </section>

                            {/* Products Section */}
                            <section>
                                <h2 className="mb-6 border-b border-neutral-200 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Productos de Interes <span className="text-neutral-400">*</span>
                                </h2>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {productosInteres.map((producto) => (
                                        <label
                                            key={producto}
                                            className={cn(
                                                "flex cursor-pointer items-center gap-3 border px-4 py-3 transition-colors",
                                                productosSeleccionados.includes(producto)
                                                    ? "border-neutral-900 bg-neutral-900 text-white"
                                                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                                            )}
                                        >
                                            <Checkbox
                                                id={producto}
                                                checked={productosSeleccionados.includes(producto)}
                                                onCheckedChange={() => toggleProducto(producto)}
                                                className={cn(
                                                    "rounded-none",
                                                    productosSeleccionados.includes(producto) && "border-white data-[state=checked]:bg-white data-[state=checked]:text-neutral-900"
                                                )}
                                            />
                                            <span className="text-sm">{producto}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="otros" className="text-sm font-medium text-neutral-800">
                                        Otros productos (especificar)
                                    </Label>
                                    <Textarea
                                        id="otros"
                                        value={otros}
                                        onChange={(e) => setOtros(e.target.value)}
                                        className="mt-2 min-h-[80px] rounded-none border-neutral-300 bg-white focus:border-neutral-900 focus:ring-neutral-900"
                                        placeholder="Describe otros productos que te interesen..."
                                    />
                                </div>
                            </section>

                            {/* Advisor Section */}
                            <section>
                                <h2 className="mb-6 border-b border-neutral-200 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Asesor <span className="text-neutral-400">*</span>
                                </h2>
                                <RadioGroup
                                    required
                                    value={asesorSeleccionado}
                                    onValueChange={setAsesorSeleccionado}
                                    className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                                >
                                    {asesores.map((asesor) => (
                                        <label
                                            key={asesor}
                                            className="flex cursor-pointer items-center justify-center gap-2 border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 transition-colors hover:border-neutral-400 has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-900 has-[:checked]:text-white"
                                        >
                                            <RadioGroupItem value={asesor} id={`asesor-${asesor}`} className="sr-only" />
                                            {asesor}
                                        </label>
                                    ))}
                                </RadioGroup>
                            </section>

                            {/* How did you hear about us */}
                            <section>
                                <h2 className="mb-6 border-b border-neutral-200 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Como nos conociste
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {mediosContacto.map((medio) => (
                                        <label
                                            key={medio}
                                            className={cn(
                                                "flex cursor-pointer items-center gap-2 border px-4 py-2 text-sm transition-colors",
                                                mediosSeleccionados.includes(medio)
                                                    ? "border-neutral-900 bg-neutral-900 text-white"
                                                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                                            )}
                                        >
                                            <Checkbox
                                                id={`medio-${medio}`}
                                                checked={mediosSeleccionados.includes(medio)}
                                                onCheckedChange={() => toggleMedio(medio)}
                                                className="sr-only"
                                            />
                                            {medio}
                                        </label>
                                    ))}
                                </div>
                            </section>

                            {/* Payment Section */}
                            <section>
                                <h2 className="mb-6 border-b border-neutral-200 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Informacion de Pago
                                </h2>
                                <div className="space-y-5">
                                    <div>
                                        <Label className="text-sm font-medium text-neutral-800">Forma de Pago</Label>
                                        <RadioGroup
                                            value={formaPagoSeleccionada}
                                            onValueChange={setFormaPagoSeleccionada}
                                            className="mt-3 flex flex-wrap gap-3"
                                        >
                                            {formasPago.map((forma) => (
                                                <label
                                                    key={forma}
                                                    className={cn(
                                                        "flex cursor-pointer items-center justify-center border px-5 py-2 text-sm transition-colors",
                                                        formaPagoSeleccionada === forma
                                                            ? "border-neutral-900 bg-neutral-900 text-white"
                                                            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                                                    )}
                                                >
                                                    <RadioGroupItem value={forma} id={`pago-${forma}`} className="sr-only" />
                                                    {forma}
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-neutral-800">Tipo de Pago</Label>
                                        <div className="mt-3 flex flex-wrap gap-3">
                                            {tipoPago.map((tipo) => (
                                                <label
                                                    key={tipo}
                                                    className={cn(
                                                        "flex cursor-pointer items-center justify-center border px-4 py-2 text-sm transition-colors",
                                                        tipoPagoSeleccionado === tipo
                                                            ? "border-neutral-900 bg-neutral-900 text-white"
                                                            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                                                    )}
                                                >
                                                    <Checkbox
                                                        id={`tipo-${tipo}`}
                                                        checked={tipoPagoSeleccionado === tipo}
                                                        onCheckedChange={(checked) => setTipoPagoSeleccionado(checked ? tipo : "")}
                                                        className="sr-only"
                                                    />
                                                    {tipo}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="autorizacion" className="text-sm font-medium text-neutral-800">
                                            Numero de Autorizacion
                                        </Label>
                                        <Input
                                            id="autorizacion"
                                            value={autorizacion}
                                            onChange={(e) => setAutorizacion(e.target.value)}
                                            className="mt-2 rounded-none border-neutral-300 bg-white focus:border-neutral-900 focus:ring-neutral-900"
                                            placeholder="Ingresa el numero si aplica"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Submit */}
                        <div className="mt-10 border-t border-neutral-200 pt-8">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-none bg-neutral-900 py-6 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                            </Button>
                            <p className="mt-4 text-center text-xs text-neutral-500">
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <footer className="mt-8 text-center">
                    <p className="text-xs text-neutral-400">
                        Si tienes alguna duda, no dudes en escribirnos woowbegt@gmail.com
                    </p>
                </footer>
            </div>
        </div>
    )
}
