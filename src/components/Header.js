'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Ekran boyutunu kontrol et ve mobil olup olmadığını belirle
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // İlk yükleme ve resize olaylarında kontrol et
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Menüyü aç/kapat
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-amber-500 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 mr-3 relative">
              <Image
                src="/baliz.jpg"
                alt="BALİZ PARMAK KULÜBÜ Logo"
                width={40}
                height={40}
                className="object-contain"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23FFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 2v7.31'/%3E%3Cpath d='M14 9.3V2'/%3E%3Cpath d='M8.17 9.37a6 6 0 0 0-5.77 8.16A6 6 0 0 0 14 19.71'/%3E%3Cpath d='M21.6 17.53a6 6 0 0 0-5.77-8.16 5.88 5.88 0 0 0-1.77.27'/%3E%3Cpath d='M12.63 16.24c.98-.07 1.97.39 2.54 1.19.57.8.68 1.84.28 2.74'/%3E%3Cpath d='M15.5 14a2.12 2.12 0 0 1 .15 2.94 2.13 2.13 0 0 1-2.39.46'/%3E%3Cpath d='M10 2C5.58 2 2 5.58 2 10'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white`}>BALİZ PARMAK KULÜBÜ</h1>
          </Link>
          
          {/* Mobil menü düğmesi */}
          {isMobile && (
            <button 
              className="p-2 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Menüyü aç/kapat"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
          
          {/* Masaüstü menü */}
          {!isMobile && (
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link 
                    href="/" 
                    className="text-white hover:text-amber-200 font-medium transition-colors"
                  >
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/kitap-oku-dinle" 
                    className="text-white hover:text-amber-200 font-medium transition-colors"
                  >
                    Kitap Oku ve Dinle
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/duyurular" 
                    className="text-white hover:text-amber-200 font-medium transition-colors"
                  >
                    Duyurular
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/hakkimizda" 
                    className="text-white hover:text-amber-200 font-medium transition-colors"
                  >
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin" 
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1 px-3 rounded-lg transition-colors"
                  >
                    Yönetici
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
        
        {/* Mobil açılır menü */}
        {isMobile && isMenuOpen && (
          <nav className="mt-3 bg-amber-600 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out">
            <ul className="py-2">
              <li>
                <Link 
                  href="/" 
                  className="block px-4 py-2 text-white hover:bg-amber-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link 
                  href="/kitap-oku-dinle" 
                  className="block px-4 py-2 text-white hover:bg-amber-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kitap Oku ve Dinle
                </Link>
              </li>
              <li>
                <Link 
                  href="/duyurular" 
                  className="block px-4 py-2 text-white hover:bg-amber-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Duyurular
                </Link>
              </li>
              <li>
                <Link 
                  href="/hakkimizda" 
                  className="block px-4 py-2 text-white hover:bg-amber-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  className="block px-4 py-2 text-white hover:bg-amber-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Yönetici
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
} 