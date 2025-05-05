"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css'; // Yeni stiller için

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Giriş sayfası kontrolü
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }

    // Her sayfa yüklendiğinde oturum kontrolü yap
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check-session', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          credentials: 'include' // Cookie'leri de gönder
        });
        
        const data = await response.json();
        
        // Eğer oturum yoksa login sayfasına yönlendir
        if (!data.authenticated) {
          console.log('Admin layout: Oturum yok, giriş sayfasına yönlendiriliyor');
          router.push('/admin/login?redirect=' + pathname);
        } else {
          console.log('Admin layout: Oturum doğrulandı, sayfaya erişim izni verildi');
        }
      } catch (error) {
        console.error('Oturum kontrolü hatası:', error);
        router.push('/admin/login?redirect=' + pathname);
      } finally {
        setChecking(false);
      }
    };
    
    checkSession();
  }, [pathname, router]);

  // Oturum kontrol edilirken yükleniyor göster
  if (checking && pathname !== '/admin/login') {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-100">
        <div className="text-center">
          <div className={styles.spinner}></div>
          <p className="mt-2 text-amber-800 font-medium">Oturum kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 