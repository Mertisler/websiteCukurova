"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// Admin bilgileri (gerçek uygulamada bu bilgiler güvenli bir şekilde saklanmalıdır)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ 
    title: "", 
    content: "",
    image_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ message: "", isError: false });
  const [dbStatus, setDbStatus] = useState("unknown"); // veritabanı durumu: unknown, connected, disconnected, error
  const [syncLoading, setSyncLoading] = useState(false); // senkronizasyon yükleniyor durumu
  const [setupLoading, setSetupLoading] = useState(false); // kurulum yükleniyor durumu
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const setupDatabase = useCallback(async () => {
    try {
      setSetupLoading(true);
      const response = await fetch('/api/db-setup');
      if (!response.ok) throw new Error('Veritabanı kurulumu başarısız oldu');
      const data = await response.json();
      if (data.success) {
        setDbStatus('connected');
        setStatusMessage({ message: 'Veritabanı başarıyla kuruldu', isError: false });
      }
    } catch {
      setDbStatus('error');
      setStatusMessage({ message: 'Veritabanı kurulumu başarısız oldu', isError: true });
    } finally {
      setSetupLoading(false);
    }
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/announcements');
      if (!response.ok) throw new Error('Duyurular alınamadı');
      const data = await response.json();
      setAnnouncements(data.announcements);
    } catch (error) {
      console.error('Duyuru yükleme hatası:', error);
      setStatusMessage({ 
        message: "Duyurular alınırken bir hata oluştu.", 
        isError: true 
      });
      
      setAnnouncements([]);
      
      // 5 saniye sonra hata mesajını temizle
      setTimeout(() => {
        setStatusMessage({ message: "", isError: false });
      }, 5000);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      setIsLoggedIn(true);
      setError("");
      fetchAnnouncements();
    } else {
      setError("Kullanıcı adı veya şifre hatalı!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const handleAnnouncementChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    setImageUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Görsel yükleme başarısız oldu');
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.imageUrl;
      } else {
        console.error('Görsel yükleme hatası:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Görsel yükleme sırasında hata:', error);
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    
    if (!newAnnouncement.title || !newAnnouncement.content) {
      setStatusMessage({ message: "Başlık ve içerik alanları zorunludur!", isError: true });
      return;
    }
    
    // Eğer görsel seçildiyse yükle
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) {
        setStatusMessage({ message: "Görsel yüklenemedi. Duyuru görsel olmadan kaydedilecek.", isError: true });
      }
    }
    
    const currentDate = new Date();
    const announcement = {
      id: Date.now(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      date: currentDate.toLocaleDateString('tr-TR'),
      image_url: imageUrl
    };
    
    try {
      // API'ye duyuru ekleme isteği gönder
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcement),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error("JSON İşleme Hatası:", err);
        
        // JSON işleme hatası oluşursa, başarılı kabul et ve yerel kaydı yap
        setAnnouncements([announcement, ...announcements]);
        localStorage.setItem("announcements", JSON.stringify([announcement, ...announcements]));
        setNewAnnouncement({ title: "", content: "", image_url: "" });
        setImageFile(null);
        setStatusMessage({ message: "Duyuru yerel olarak kaydedildi. Uzak sunucuyla iletişim kurulamadı.", isError: false });
        
        // Daha sonra senkronizasyon için işaretleme
        try {
          syncLocalAnnouncementsWithServer();
        } catch (syncError) {
          console.error("Senkronizasyon hatası:", syncError);
        }
        
        return;
      }
      
      if (!response.ok && !data.success) {
        throw new Error(data.error || 'Duyuru eklenirken bir hata oluştu');
      }
      
      // Başarılı bir şekilde eklendiğinde, mevcut duyuru listesini güncelle
      const duyuru = data.announcement || announcement;
      const updatedAnnouncements = [duyuru, ...announcements];
      setAnnouncements(updatedAnnouncements);
      
      // Yerel depolamayı da güncelle
      localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));
      
      setNewAnnouncement({ title: "", content: "", image_url: "" });
      setImageFile(null);
      setStatusMessage({ message: data.message || "Duyuru başarıyla eklendi.", isError: false });
    } catch (error) {
      console.error(error);
      
      // Hata durumunda da yerel kayıt yap
      const updatedAnnouncements = [announcement, ...announcements];
      localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));
      setAnnouncements(updatedAnnouncements);
      setNewAnnouncement({ title: "", content: "", image_url: "" });
      setImageFile(null);
      
      setStatusMessage({ 
        message: "Duyuru veritabanına eklenemedi fakat yerel olarak kaydedildi.", 
        isError: true 
      });
      
      // Daha sonra senkronizasyon için işaretleme
      try {
        syncLocalAnnouncementsWithServer();
      } catch (syncError) {
        console.error("Senkronizasyon hatası:", syncError);
      }
    }
    
    // 3 saniye sonra durum mesajını temizle
    setTimeout(() => {
      setStatusMessage({ message: "", isError: false });
    }, 3000);
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) {
      try {
        // API'den duyuru silme isteği gönder
        const response = await fetch(`/api/announcements?id=${id}`, {
          method: 'DELETE',
        });
        
        let data;
        try {
          data = await response.json();
        } catch (err) {
          console.error("JSON İşleme Hatası:", err);
          
          // JSON işleme hatası oluşursa, yerel silme işlemi yap
          const updatedAnnouncements = announcements.filter(a => a.id !== id);
          localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));
          setAnnouncements(updatedAnnouncements);
          setStatusMessage({ message: "Duyuru yerel olarak silindi. Uzak sunucuyla iletişim kurulamadı.", isError: false });
          return;
        }
        
        if (!response.ok && !data.success) {
          throw new Error(data.error || 'Duyuru silinirken bir hata oluştu');
        }
        
        // Duyuruyu listeden kaldır
        const updatedAnnouncements = announcements.filter(a => a.id !== id);
        localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));
        setAnnouncements(updatedAnnouncements);
        setStatusMessage({ message: data.message || "Duyuru başarıyla silindi.", isError: false });
      } catch (error) {
        console.error(error);
        
        // Hata durumunda da yerel silme işlemi yap
        const updatedAnnouncements = announcements.filter(a => a.id !== id);
        localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));
        setAnnouncements(updatedAnnouncements);
        
        setStatusMessage({ 
          message: "Duyuru veritabanından silinemedi fakat yerel olarak kaldırıldı.", 
          isError: true 
        });
      }
      
      // 3 saniye sonra durum mesajını temizle
      setTimeout(() => {
        setStatusMessage({ message: "", isError: false });
      }, 3000);
    }
  };

  // Yerel duyuruları uzak sunucuyla senkronize et
  const syncLocalAnnouncementsWithServer = useCallback(async () => {
    try {
      // Veritabanı bağlantısını kontrol et
      const dbCheckResponse = await fetch('/api/db-sync');
      const dbCheckData = await dbCheckResponse.json();
      
      // Veritabanı durumunu güncelle
      setDbStatus(dbCheckData.dbStatus || "error");
      
      // Bağlantı başarısız ise veritabanı kurulumunu dene
      if (dbCheckData.dbStatus !== "connected") {
        console.log('Veritabanı bağlantısı olmadığı için kurulum başlatılıyor...');
        
        setStatusMessage({
          message: "Veritabanı bağlantısı kurulamadı. Otomatik kurulum başlatılıyor...",
          isError: false
        });
        
        await setupDatabase();
        
        // Tekrar bağlantı kontrolü yap
        const newCheckResponse = await fetch('/api/db-sync');
        const newCheckData = await newCheckResponse.json();
        setDbStatus(newCheckData.dbStatus || "error");
        
        if (newCheckData.dbStatus !== "connected") {
          setStatusMessage({
            message: "Veritabanı kurulumu başarılı oldu, ancak veritabanı bağlantısı hala kurulamadı.",
            isError: true
          });
          return;
        }
      }
      
      // Yerel depolamadaki duyuruları al
      const localAnnouncements = JSON.parse(localStorage.getItem("announcements") || "[]");
      
      if (localAnnouncements.length === 0) {
        console.log('Senkronize edilecek yerel duyuru yok.');
        return; // Yerel duyuru yoksa işlem yapma
      }
      
      console.log(`${localAnnouncements.length} yerel duyuru senkronize ediliyor...`);
      
      // Senkronizasyon API'sini çağır
      const response = await fetch('/api/db-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          announcements: localAnnouncements
        }),
      });
      
      if (!response.ok) {
        throw new Error('Senkronizasyon isteği başarısız oldu: ' + response.statusText);
      }
      
      const data = await response.json();
      
      if (data.success && data.syncedCount > 0) {
        setStatusMessage({ 
          message: `${data.syncedCount} duyuru başarıyla uzak sunucudaki "u557715389_cukurova" veritabanına senkronize edildi.`, 
          isError: false 
        });
        
        // Senkronizasyon sonrası güncel verileri tekrar çek
        fetchAnnouncements();
        
        // 5 saniye sonra durum mesajını temizle
        setTimeout(() => {
          setStatusMessage({ message: "", isError: false });
        }, 5000);
      } else if (data.success && data.syncedCount === 0) {
        setStatusMessage({
          message: "Tüm duyurular zaten uzak veritabanında mevcut. Yeni senkronize edilen duyuru yok.",
          isError: false
        });
        
        // 3 saniye sonra durum mesajını temizle
        setTimeout(() => {
          setStatusMessage({ message: "", isError: false });
        }, 3000);
      }
    } catch (error) {
      console.error('Duyuru senkronizasyon hatası:', error);
      setStatusMessage({
        message: "Senkronizasyon sırasında bir hata oluştu: " + error.message,
        isError: true
      });
      
      // 5 saniye sonra durum mesajını temizle
      setTimeout(() => {
        setStatusMessage({ message: "", isError: false });
      }, 5000);
    }
  }, [setupDatabase, fetchAnnouncements]);
  
  // Manuel senkronizasyon fonksiyonu
  const manualSync = async () => {
    try {
      setSyncLoading(true);
      
      // Önce veritabanı durumunu kontrol et
      const response = await fetch('/api/db-sync');
      const data = await response.json();
      
      setDbStatus(data.dbStatus || "error");
      
      if (data.dbStatus !== "connected") {
        setStatusMessage({
          message: "Veritabanı bağlantısı kurulamadı. Senkronizasyon yapılamıyor.",
          isError: true
        });
        return;
      }
      
      // Yerel duyuruları al
      const localAnnouncements = JSON.parse(localStorage.getItem("announcements") || "[]");
      
      if (localAnnouncements.length === 0) {
        setStatusMessage({
          message: "Senkronize edilecek yerel duyuru bulunmuyor.",
          isError: false
        });
        return;
      }
      
      // Senkronizasyon API'sini çağır
      const syncResponse = await fetch('/api/db-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          announcements: localAnnouncements
        }),
      });
      
      if (!syncResponse.ok) {
        throw new Error('Senkronizasyon isteği başarısız oldu');
      }
      
      const syncData = await syncResponse.json();
      
      setStatusMessage({
        message: syncData.message || `${syncData.syncedCount} duyuru senkronize edildi.`,
        isError: !syncData.success
      });
      
      // Senkronizasyon başarılıysa duyuruları güncelleyin
      if (syncData.success) {
        fetchAnnouncements();
      }
      
    } catch (error) {
      console.error("Manuel senkronizasyon sırasında hata:", error);
      setStatusMessage({
        message: "Senkronizasyon sırasında bir hata oluştu: " + error.message,
        isError: true
      });
    } finally {
      setSyncLoading(false);
      
      // 5 saniye sonra durum mesajını temizle
      setTimeout(() => {
        setStatusMessage({ message: "", isError: false });
      }, 5000);
    }
  };
  
  // Veritabanı durumunu kontrol eden fonksiyon
  const checkDatabaseStatus = async () => {
    try {
      setSyncLoading(true);
      const response = await fetch('/api/db-sync');
      const data = await response.json();
      
      setDbStatus(data.dbStatus || "error");
      setStatusMessage({
        message: data.message || "Veritabanı durumu kontrol edildi.",
        isError: !data.success
      });
      
      // 3 saniye sonra durum mesajını temizle
      setTimeout(() => {
        setStatusMessage({ message: "", isError: false });
      }, 3000);
      
      return data.success;
    } catch (error) {
      console.error("Veritabanı durumu kontrol edilirken hata:", error);
      setDbStatus("error");
      setStatusMessage({
        message: "Veritabanı durumu kontrol edilirken bir hata oluştu: " + error.message,
        isError: true
      });
      
      // 3 saniye sonra durum mesajını temizle
      setTimeout(() => {
        setStatusMessage({ message: "", isError: false });
      }, 3000);
      
      return false;
    } finally {
      setSyncLoading(false);
    }
  };
  
  useEffect(() => {
    // İlk yüklendiğinde veritabanı durumunu kontrol et
    if (isLoggedIn) {
      checkDatabaseStatus();
    }
  }, [isLoggedIn]); // isLoggedIn değiştiğinde kontrol et

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Admin paneli için butonlar
  const adminButtons = [
    { 
      title: "Tablolar - Bize Ulaşın", 
      description: "Bize ulaşın sayfasından gelen mesajları yönetin.", 
      href: "/admin/tablo-guncelle",
      icon: (
        <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      title: "Video Yönetimi", 
      description: "Kitap Oku ve Dinle sayfasındaki videoları yönetin.", 
      href: "/admin/videos",
      icon: (
        <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      requiresAuth: true // Video yönetimi için oturum açma gerekiyor
    }
  ];

  // Oturum açıksa admin panelini göster
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
        <header className="bg-amber-600 py-6 shadow-md">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">BALİZ Admin Paneli</h1>
              <div className="flex space-x-4">
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Çıkış Yap
                  </div>
                </button>
                <Link href="/" className="text-white hover:text-amber-200 transition-colors">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Siteye Dön
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminButtons.map((button, index) => (
              <Link 
                key={index} 
                href={button.href}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="bg-amber-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    {button.icon}
                  </div>
                  <h3 className="text-xl font-bold text-amber-800 mb-2">{button.title}</h3>
                  <p className="text-amber-600">{button.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
        
        <footer className="bg-amber-600 text-white py-4 mt-auto">
          <div className="container mx-auto px-6">
            <p className="text-center">&copy; {new Date().getFullYear()} BALİZ Admin - Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amber-50 to-amber-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-amber-500 p-4 flex items-center justify-center">
          <div className="w-12 h-12 mr-3">
            <Image
              src="/honey-pot.svg"
              alt="Bal Küpü Logo"
              width={48}
              height={48}
              className="object-contain"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23FFC107' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 2v7.31'/%3E%3Cpath d='M14 9.3V2'/%3E%3Cpath d='M8.17 9.37a6 6 0 0 0-5.77 8.16A6 6 0 0 0 14 19.71'/%3E%3Cpath d='M21.6 17.53a6 6 0 0 0-5.77-8.16 5.88 5.88 0 0 0-1.77.27'/%3E%3Cpath d='M12.63 16.24c.98-.07 1.97.39 2.54 1.19.57.8.68 1.84.28 2.74'/%3E%3Cpath d='M15.5 14a2.12 2.12 0 0 1 .15 2.94 2.13 2.13 0 0 1-2.39.46'/%3E%3Cpath d='M10 2C5.58 2 2 5.58 2 10'/%3E%3C/svg%3E";
              }}
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Bal Küpü Admin</h1>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-amber-800 text-center">Yönetici Girişi</h2>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-amber-800 text-sm font-bold mb-2" htmlFor="username">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Kullanıcı adını giriniz"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-amber-800 text-sm font-bold mb-2" htmlFor="password">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Şifrenizi giriniz"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors"
            >
              Giriş Yap
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