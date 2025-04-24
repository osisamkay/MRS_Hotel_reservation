import './globals.css';
import { Inter, Averia_Serif_Libre } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from "../src/lib/auth";
import AuthProvider from '@/src/providers/AuthProvider';
import { BookingProvider } from '@/src/contexts/BookingContext';
import { LocalizationProvider } from '@/src/contexts/LocalizationContext';
import { AuthProvider as CustomAuthProvider } from '@/src/contexts/AuthContext';
import { NotificationProvider } from '@/src/contexts/NotificationContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const averiaSerifLibre = Averia_Serif_Libre({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-averia-serif'
});

export const metadata = {
  title: 'MRS Hotel Reservation',
  description: 'Book your stay at Moose Rock and Suites',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.variable} ${averiaSerifLibre.variable} font-sans`}>
        <AuthProvider session={session}>
          <CustomAuthProvider>
            <LocalizationProvider>
              <BookingProvider>
                <NotificationProvider>
                  {children}
                </NotificationProvider>
              </BookingProvider>
            </LocalizationProvider>
          </CustomAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}