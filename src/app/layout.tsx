import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AQUALENS — Autonomous Space-to-Clinic River Sentinel',
  description:
    'Autonomous earth-observation biosecurity platform linking Copernicus Sentinel-2 MSI data directly to clinical HL7 FHIR emergency informatics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="bg-white text-black min-h-screen antialiased flex flex-col font-sans selection:bg-[#FFE500] selection:text-black">
        {children}
      </body>
    </html>
  );
}
