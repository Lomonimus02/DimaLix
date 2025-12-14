import type { Metadata } from "next";
import { Manrope, Oswald } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "800"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "IRON RENT Спецтехника",
    template: "%s | IRON RENT Спецтехника",
  },
  description:
    "Аренда строительной спецтехники премиум-класса в Санкт-Петербурге. Экскаваторы, краны, самосвалы с экипажем. Работаем 24/7.",
  keywords: [
    "аренда спецтехники",
    "аренда экскаватора",
    "аренда крана",
    "спецтехника СПб",
    "строительная техника",
  ],
  authors: [{ name: "IRON RENT" }],
  creator: "IRON RENT",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "IRON RENT Спецтехника",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${manrope.variable} ${oswald.variable} font-sans antialiased`}
      >
        {/* Texture noise background */}
        <div className="bg-noise" aria-hidden="true"></div>

        {children}
      </body>
    </html>
  );
}
