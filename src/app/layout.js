import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth.js";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"], // los pesos que usas
  variable: "--font-josefin",
});

export const metadata = {
  title: "WoowbeGT",
  description: "Page about send of merge invitations",
  icons: {
    icon: "https://res.cloudinary.com/dclzsvu62/image/upload/v1753670788/bodas-woowbe/z9rajz3y6q53pkbdkfsa.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${josefin.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}