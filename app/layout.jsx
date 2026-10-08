import './globals.css';

export const metadata = {
  metadataBase: new URL('https://felisha-birthday.vercel.app'),
  title: 'Happy Birthday, Felisha Oktarina 🌹 — A Special Gift from Raden',
  description: 'A romantic birthday tribute, heartfelt memories, and love letter from Raden for Felisha Oktarina Kustantri.',
  openGraph: {
    title: 'Happy Birthday, Felisha Oktarina 🌹',
    description: 'Buka kado spesial, kenangan manis, dan surat cinta dari hati Raden untukmu di hari ulang tahun ini.',
    url: 'https://felisha-birthday.vercel.app',
    siteName: "Felisha's Birthday Tribute",
    images: [
      {
        url: '/fel.jpeg',
        width: 1200,
        height: 1200,
        alt: 'Felisha Oktarina Kustantri',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy Birthday, Felisha Oktarina 🌹',
    description: 'A romantic birthday tribute from Raden for Felisha Oktarina Kustantri.',
    images: ['/fel.jpeg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#fbf9f4',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#fbf9f4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Pinyon+Script&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
