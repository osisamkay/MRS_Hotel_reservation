import { Inter, Averia_Serif_Libre } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const averiaSerifLibre = Averia_Serif_Libre({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-averia'
});

export const metadata = {
  title: 'MRS Hotel Reservation',
  description: 'Book your stay at Moose Rock and Suites - Luxury accommodations in BC',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${averiaSerifLibre.variable}`}>{children}</body>
    </html>
  );
} 