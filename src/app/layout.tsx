import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Inter, Poppins, Plus_Jakarta_Sans } from 'next/font/google';
import { AppSettingsProvider } from '@/lib/app-settings';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins' 
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'SOLID',
  description: 'Sistem Olah Laporan Informasi & Data Desa',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${jakarta.variable} font-body antialiased`}>
        <FirebaseClientProvider>
          <AppSettingsProvider>
            {children}
          </AppSettingsProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
