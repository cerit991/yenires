'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <head>
        <title>You Chill Lounge </title>
        <link rel="icon" href="/images/logo/logo.jpg" />
        <meta name="description" content="You Chill Lounge - Modern Türk Mutfağı" />
      </head>
      <body className={inter.className}>
        {!isAdminPage && (
          <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-zinc-950/80 backdrop-blur-md' : 'bg-transparent'
          }`}>
            <nav className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/images/logo/logo.jpg"
                    alt="You Chill Lounge"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  
                </Link>
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => scrollToSection('menu')}
                    className="text-zinc-300 hover:text-white transition-colors"
                  >
                    Menü
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="text-zinc-300 hover:text-white transition-colors"
                  >
                    Rezervasyon
                  </button>
                </div>
              </div>
            </nav>
          </header>
        )}
        {/* Main Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
