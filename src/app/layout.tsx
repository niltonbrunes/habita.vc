import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563EB' },
    { media: '(prefers-color-scheme: dark)', color: '#2563EB' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HabitaVC CRM',
  },
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL("https://habita.vc"),
  title: {
    default: "Habita.vc | Imóveis em Goiânia com Curadoria de Especialistas",
    template: "%s | Habita.vc",
  },
  description:
    "Encontre casas, apartamentos e lançamentos em Goiânia. Curadoria de imóveis de alto padrão com inteligência imobiliária e corretores verificados.",
  keywords: [
    "imóveis Goiânia",
    "apartamentos Goiânia",
    "casas Goiânia",
    "lançamentos imobiliários",
    "Setor Marista",
    "Setor Bueno",
    "Alphaville Goiânia",
    "portal imobiliário",
    "Habita.vc",
  ],
  authors: [{ name: "Habita.vc", url: "https://habita.vc" }],
  creator: "Habita.vc",
  publisher: "Habita.vc",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://habita.vc",
    siteName: "Habita.vc",
    title: "Habita.vc | Imóveis em Goiânia com Curadoria de Especialistas",
    description:
      "Encontre casas, apartamentos e lançamentos em Goiânia. Curadoria de imóveis de alto padrão com corretores verificados.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Habita.vc — Portal Imobiliário de Goiânia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@habitavc",
    creator: "@habitavc",
    title: "Habita.vc | Imóveis em Goiânia",
    description:
      "Encontre casas, apartamentos e lançamentos em Goiânia com curadoria especializada.",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: "https://habita.vc",
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('[SW] Registered:', reg.scope); })
                    .catch(function(err) { console.log('[SW] Failed:', err); });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
