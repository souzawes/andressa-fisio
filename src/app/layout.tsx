import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";



import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/Theme';

import { ApolloWrapper } from '@/lib/apollo-wrapper';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <body className={inter.className}>
            <ApolloWrapper>
              {children}
            </ApolloWrapper>
          </body>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
