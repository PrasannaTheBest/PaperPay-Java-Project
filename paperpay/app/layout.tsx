import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PaperPay - Your Money, Sketched Simple',
  description: 'The fintech app that feels like a notebook. Digital payment and expense tracking with a handcrafted sketch aesthetic.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        {children}
      </body>
    </html>
  );
}
