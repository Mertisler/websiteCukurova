'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LogoutButton.module.css';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      console.log('Çıkış işlemi başlatılıyor...');
      
      // Çıkış API'sını çağır
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      const data = await response.json();
      
      console.log('Çıkış yanıtı:', data);

      if (data.success) {
        // Tarayıcı önbelleğini temizle
        if (typeof window !== 'undefined') {
          // Tarayıcı önbelleğini temizle
          console.log('Tarayıcı önbelleği temizleniyor...');
          window.localStorage.removeItem('adminData');
          window.localStorage.removeItem('adminAuth'); // Eski admin verilerini temizle
          window.sessionStorage.removeItem('adminData');
          
          // Ana sayfaya yönlendir
          window.location.href = data.redirectUrl || '/';
        } else {
          // Next.js router'ı kullan
          router.push(data.redirectUrl || '/');
          router.refresh();
        }
      } else {
        console.error('Çıkış işlemi başarısız:', data.message);
        alert('Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Çıkış hatası:', error);
      alert('Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={styles.logoutButton} 
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}
    </button>
  );
} 