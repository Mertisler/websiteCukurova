'use client';

import { useState, useEffect , Suspense} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
          }
        });
        
        const data = await response.json();
        
        if (data.authenticated) {
          // Eğer oturum açıksa ve direkt login sayfasına geldiyse admin sayfasına yönlendir
          router.push(redirect);
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
        router.push(redirect);
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
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <p className={styles.loading}>Kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Yönetici Girişi</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
              autoComplete="off"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              autoComplete="new-password" // Tarayıcının otomatik doldurmasını engeller
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
} 

export default function AdminLogin(){
  return (
    <Suspense fallback={<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>}>
      <AdminLoginContent />
    </Suspense>
  );
} 