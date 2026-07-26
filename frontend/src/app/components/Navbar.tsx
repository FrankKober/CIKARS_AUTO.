'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/');
  };

  const handleSellClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push('/sell');
    } else {
      router.push('/auth');
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="text-xl font-black tracking-wider text-white flex items-center gap-1 group">
            CIKARS<span className="text-neutral-500 group-hover:text-white transition">_AUTO</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <Link href="/cars" className="hover:text-white transition">Browse</Link>
            
            <button 
              onClick={handleSellClick} 
              className="hover:text-white transition cursor-pointer bg-transparent border-none p-0 text-sm font-medium text-neutral-400"
            >
              Sell
            </button>
            
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/careers" className="hover:text-white transition">Careers</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/blog" className="hover:text-white transition">Blog</Link>
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-5">
            {isAuthenticated ? (
              <div className="flex items-center gap-5">
                <Link 
                  href="/" 
                  className="text-sm font-medium text-neutral-400 hover:text-white transition"
                >
                  Home
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-neutral-400 hover:text-red-400 transition"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition shadow-sm"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-black/95 border-b border-neutral-900 px-6 py-6 flex flex-col gap-5 backdrop-blur-2xl">
            <Link href="/cars" className="text-base font-medium text-neutral-300 hover:text-white transition">Browse</Link>
            <button 
              onClick={handleSellClick} 
              className="text-left text-base font-medium text-neutral-300 hover:text-white transition cursor-pointer bg-transparent border-none p-0"
            >
              Sell
            </button>
            <Link href="/about" className="text-base font-medium text-neutral-300 hover:text-white transition">About</Link>
            <Link href="/careers" className="text-base font-medium text-neutral-300 hover:text-white transition">Careers</Link>
            <Link href="/contact" className="text-base font-medium text-neutral-300 hover:text-white transition">Contact</Link>
                        <Link href="/blog" className="hover:text-white transition">Blog</Link>

            <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/" 
                    className="w-full text-center py-3 rounded-full bg-neutral-900 text-white text-sm font-bold border border-neutral-800 transition"
                  >
                    Home
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-center py-3 rounded-full bg-neutral-900 text-red-400 text-sm font-bold border border-neutral-800 transition"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth" 
                  className="w-full text-center py-3 rounded-full bg-white text-black text-sm font-bold transition"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to push page content down so it doesn't hide behind the fixed navbar */}
      <div className="h-20" />
    </>
  );
}