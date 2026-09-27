import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'स्वर्णिम दस्तावेज़ (Swarnim Dastavej) | डिजिटल न्यूज़, नागरिक पत्रकारिता एवं ई-पेपर',
  description: 'स्वर्णिम दस्तावेज़ - उत्तर प्रदेश का अग्रणी दैनिक समाचार पत्र (RNI No. UPHIN/26/A7984)। लखनऊ, सीतापुर और अवध की प्रामाणिक जमीनी खबरें, नागरिक पत्रकारिता मंच एवं डिजिटल ई-पेपर।',
  keywords: [
    'स्वर्णिम दस्तावेज़',
    'Swarnim Dastavej',
    'UP News',
    'Sitapur News',
    'Lucknow Daily',
    'Citizen Journalism',
    'Hindi Daily Samachar Patra',
    'E-Paper'
  ],
  authors: [{ name: 'Swarnim Dastavej Editorial Board' }],
  metadataBase: new URL('https://swarnimdastavej.com'),
  openGraph: {
    title: 'स्वर्णिम दस्तावेज़ | सत्य, साहस और स्वर्णिम सरोकार',
    description: 'लखनऊ एवं सीतापुर का अग्रणी हिंदी दैनिक समाचार पत्र एवं नागरिक पत्रकारिता नेटवर्क।',
    locale: 'hi_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&family=Rozha+One&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased selection:bg-red-600 selection:text-white`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
