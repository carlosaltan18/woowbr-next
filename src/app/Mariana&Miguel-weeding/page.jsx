import { Suspense } from "react";
import InvitacionMarianaMiguel from "./components/invitacion-mariana-miguel";

export const metadata = {
  title: "Mariana & Miguel · 28 de noviembre de 2026",
  description: "Te invitamos a celebrar la boda de Mariana y Miguel.",
  openGraph: {
    type: "website",
    locale: "es_GT",
    title: "Mariana & Miguel",
    description: "28 de noviembre de 2026",
    images: [
      {
        url: "https://www.woowbegt.com/mariana-miguel/img/portada.webp",
        width: 1200,
        height: 630,
        alt: "Mariana y Miguel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.woowbegt.com/mariana-miguel/img/portada.webp"],
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <InvitacionMarianaMiguel />
    </Suspense>
  );
}
