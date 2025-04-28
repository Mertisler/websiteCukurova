"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 relative">
              <Image
                src="/student-community-logo.svg"
                alt="Genç Vizyon Logo"
                width={32}
                height={32}
                className="object-contain"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 4L3 9l9 5 9-5-9-5z'/%3E%3Cpath d='M3 9l0 7 9 5 9-5 0-7'/%3E%3Cpath d='M12 9L12 19'/%3E%3Cpath d='M7.5 12L16.5 16'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <h1 className="text-xl font-bold">Genç Vizyon Yönetim</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link 
                  href="/admin" 
                  className="hover:text-blue-200 transition-colors font-medium"
                >
                  Ana Panel
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/videos" 
                  className="hover:text-blue-200 transition-colors font-medium"
                >
                  Video Yönetimi
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="hover:text-blue-200 transition-colors font-medium"
                >
                  Siteye Dön
                </Link>
              </li>
              <li>
                <button
                  className="bg-blue-600 hover:bg-blue-800 text-white font-medium py-1 px-3 rounded-lg transition-colors"
                >
                  Çıkış Yap
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-blue-50">
        {children}
      </main>

      <footer className="bg-blue-700 text-white p-4 text-center">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Genç Vizyon Öğrenci Topluluğu</p>
        </div>
      </footer>
    </div>
  );
} 