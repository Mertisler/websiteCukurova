'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './login.module.css';

const AdminLoginContent = () =>  {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  // Sayfa yüklendiğinde oturum kontrolü yap
  useEffect(() => {
    // Oturum kontrolü
    const checkSession = async () => {
      try {
        // Oturum durumunu kontrol et
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
        
        if (data.authenticated) {
          // Eğer oturum açıksa ve direkt login sayfasına geldiyse admin sayfasına yönlendir
          console.log('Geçerli oturum bulundu, yönetici sayfasına yönlendiriliyor');
          router.push(redirect);
        } else {
          console.log('Geçerli oturum bulunamadı, giriş sayfası gösteriliyor');
        }
      } catch (err) {
        console.error('Oturum kontrolü hatası:', err);
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkSession();
  }, [router, redirect]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Başarılı giriş, yönlendir
        setTimeout(() => {
          router.push(redirect);
        }, 300); // 300ms gecikme
      } else {
        setError(data.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      console.error('Giriş hatası:', err);
    } finally {
      setLoading(false);
    }
  }

  // Oturum kontrolü yapılırken yükleniyor göster
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amber-100 to-amber-300 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-center text-amber-800">Kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amber-100 to-amber-300 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-amber-500 p-6 flex items-center justify-center">
          <div className="w-16 h-16 mr-3">
            <Image
              src="/honey-pot.svg"
              alt="Bal Küpü Logo"
              width={64}
              height={64}
              className="object-contain"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23FFC107' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 2v7.31'/%3E%3Cpath d='M14 9.3V2'/%3E%3Cpath d='M8.17 9.37a6 6 0 0 0-5.77 8.16A6 6 0 0 0 14 19.71'/%3E%3Cpath d='M21.6 17.53a6 6 0 0 0-5.77-8.16 5.88 5.88 0 0 0-1.77.27'/%3E%3Cpath d='M12.63 16.24c.98-.07 1.97.39 2.54 1.19.57.8.68 1.84.28 2.74'/%3E%3Cpath d='M15.5 14a2.12 2.12 0 0 1 .15 2.94 2.13 2.13 0 0 1-2.39.46'/%3E%3Cpath d='M10 2C5.58 2 2 5.58 2 10'/%3E%3C/svg%3E";
              }}
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Bal Küpü Admin</h1>
        </div>
        
        <div className="p-8">
          <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 mb-6 rounded" role="alert">
            <p className="font-bold">Dikkat!</p>
            <p>Bu sayfa sadece yöneticilere yöneliktir. Yetkisiz girişler engellenmektedir.</p>
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-amber-800 text-center">Yönetici Girişi</h2>
          
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
            <p>{error}</p>
          </div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-amber-800 text-sm font-bold mb-2" htmlFor="username">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoComplete="off"
                placeholder="Kullanıcı adını giriniz"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-amber-800 text-sm font-bold mb-2" htmlFor="password">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoComplete="new-password"
                placeholder="Şifrenizi giriniz"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-amber-600 hover:text-amber-800 font-medium">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 

export default function AdminLogin(){
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amber-100 to-amber-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
} 