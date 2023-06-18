import './globals.css';
import { Open_Sans } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const sans = Open_Sans({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Ryong의 블로그',
    // NOTE: 하위 페이지 title 동적 할당
    template: 'Ryong의 블로그 | %s',
  },
  description: '풀스택 개발자 Ryong의 블로그',
  icons: {
    // https://convertio.co/kr/ (png to ico)
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={sans.className}>
      <body className='flex flex-col w-full max-w-screen-2xl mx-auto'>
        <Header />
        <main className='grow'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
