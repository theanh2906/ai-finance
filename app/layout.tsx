import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Financial Tools',
  description: 'Analyze financial documents and transcribe audio with Google Gemini AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
