import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientWrapper from "@components/ClientWrapper";
import { Header } from "@pages/Header";
import { Footer } from "@pages/Footer";
import { SnackbarProvider } from "@components/snackbar/snackbarContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NCMX App",
  description:
    "Non-Conformity Management Exchange (Обмен информацией об управлении несоответствиями)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <SnackbarProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </SnackbarProvider>
        <Footer />
      </body>
    </html>
  );
}
