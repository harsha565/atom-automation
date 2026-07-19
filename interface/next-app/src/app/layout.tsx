import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atomautomation.in"),
  title: {
    default: "Atom Automation • WhatsApp Automation That Works While You Don't",
    template: "%s | Atom Automation",
  },
  description:
    "Automate reminders, confirmations, follow-ups, and customer communication through WhatsApp while your business stays focused on serving customers.",
  keywords: [
    "WhatsApp Automation",
    "WhatsApp Reminders",
    "Customer Communication",
    "Automated Follow-ups",
    "Business Automation",
    "Atom Automation",
  ],
  authors: [{ name: "Atom Automation", url: "https://atomautomation.in" }],
  creator: "Atom Automation",
  publisher: "Atom Automation",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Atom Automation • WhatsApp Automation That Works While You Don't",
    description:
      "Automate reminders, confirmations, follow-ups, and customer communication through WhatsApp while your business stays focused on serving customers.",
    url: "https://atomautomation.in",
    siteName: "Atom Automation",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Atom Automation Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atom Automation • WhatsApp Automation That Works While You Don't",
    description:
      "Automate reminders, confirmations, follow-ups, and customer communication through WhatsApp while your business stays focused on serving customers.",
    images: ["/logo.png"],
    creator: "@atomautomation",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8F8FF] text-[#010203]">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
