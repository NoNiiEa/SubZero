import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'subZero - Subscription Tracker',
  description: 'Track and manage all your subscriptions with subZero',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}