import '@radix-ui/themes/styles.css';
import './globals.css';

import { Container, Theme } from '@radix-ui/themes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strutio - Filtering System',
  description: 'Strutio Filtering System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme accentColor="violet">
          <main className="p-5">
            <Container>{children}</Container>
          </main>
        </Theme>
      </body>
    </html>
  );
}
