import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ConvexClientProvider } from "@/components/providers/convex-provider"
import { Navbar } from "@/app/(main)/_components/navbar"
import { Footer } from "@/app/(main)/_components/footer"
import { Toaster } from "sonner"
import {ThemeProvider} from "@/components/providers/theme-provider";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MORENT',
  description: 'Car Rent Service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${plusJakartaSans.className} dark:bg-[#1F1F1F]`}>
            <ConvexClientProvider>
                <div className='mx-auto'>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange
                        storageKey='morent-theme'
                    >
                        <Toaster position='bottom-center' />
                        <Navbar />
                        {children}
                        <Footer />
                    </ThemeProvider>
                </div>
            </ConvexClientProvider>
        </body>
      </html>
  )
}
