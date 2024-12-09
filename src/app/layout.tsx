import '@radix-ui/themes/styles.css';
import './globals.css';

import { Container, Theme } from '@radix-ui/themes';
import { AppFooter, AppHeader } from '@strutio/app/components';
import type { Metadata } from 'next';

import styles from './layout.module.scss';
import QueryClientProvider from './QueryClientProvider.component';

export const metadata: Metadata = {
  title: 'Strutio | Filtering System',
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
          <QueryClientProvider>
            <div className={styles.container}>
              <div className={styles.content}>
                <AppHeader />
                <main className={'grow'}>
                  <Container>{children}</Container>
                </main>
                <AppFooter />
              </div>
            </div>
          </QueryClientProvider>
        </Theme>
      </body>
    </html>
  );
}
