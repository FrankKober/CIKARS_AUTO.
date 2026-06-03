'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [pathname]); // Re-run when route changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-neutral-900 transition-all duration-300">
      <Link href="/" className="text-2xl font-bold tracking-tighter text-white hover:text-neutral-300 transition">
        CIKARS_AUTO<span className="text-neutral-400">.</span>
      </Link>

      <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-neutral-400">
        <Link href="/cars" className="hover:text-white transition">
          Browse Cars
        </Link>
        <Link href="/sell" className="hover:text-white transition">
          Sell Car
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <button 
              onClick={handleLogout}
              className="text-neutral-500 hover:text-red-400 transition"
            >
              Log Out
            </button>
          </div>
        ) : (
          <Link 
            href="/auth" 
            className="text-black bg-white px-5 py-2.5 rounded-full hover:bg-neutral-200 transition shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu Button (Placeholder for future expansion) */}
      <button className="md:hidden text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        </svg>
      </button>
    </nav>
  );
}