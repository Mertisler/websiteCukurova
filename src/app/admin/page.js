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

  if (!isLoggedIn) {
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

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">BalİZ Parmak Kulübü Yönetim Paneli</h1>
            <Link href="/" className="text-white hover:text-amber-200 transition-colors">
              Siteye Dön
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-amber-800">Ana Panel</h2>
          <div className="flex space-x-4">
            <Link href="/admin/videos" className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg">
              Video Yönetimi
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
        
        {statusMessage.message && (
          <div className={`${
            statusMessage.isError 
              ? 'bg-red-100 border-l-4 border-red-500 text-red-700' 
              : 'bg-green-100 border-l-4 border-green-500 text-green-700'
            } p-4 mb-6 rounded`} role="alert">
            <p>{statusMessage.message}</p>
          </div>
        )}
        
        {/* Veritabanı Durumu ve Senkronizasyon Butonu */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="mr-2">Veritabanı Durumu:</span>
              {dbStatus === "connected" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                  Bağlı
                </span>
              )}
              {dbStatus === "disconnected" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                  Bağlantı Yok
                </span>
              )}
              {dbStatus === "error" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                  Hata
                </span>
              )}
              {dbStatus === "unknown" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-1.5"></span>
                  Bilinmiyor
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Link
                href="/admin/tablo-guncelle" 
                className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded shadow text-sm"
              >
                Tablo Güncelle
              </Link>
              
              <button
                onClick={setupDatabase}
                disabled={setupLoading}
                className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded shadow text-sm disabled:opacity-50"
              >
                {setupLoading ? "Kuruluyor..." : "Veritabanı Kur"}
              </button>
              
              <button
                onClick={checkDatabaseStatus}
                disabled={syncLoading || setupLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow text-sm disabled:opacity-50"
              >
                {syncLoading ? "Kontrol Ediliyor..." : "Durumu Kontrol Et"}
              </button>
              
              <button
                onClick={manualSync}
                disabled={syncLoading || setupLoading || dbStatus !== "connected"}
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded shadow text-sm disabled:opacity-50"
              >
                {syncLoading ? "Senkronize Ediliyor..." : "Manuel Senkronizasyon"}
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-amber-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Yeni Duyuru Ekle</h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleAddAnnouncement}>
                <div className="mb-4">
                  <label className="block text-amber-800 text-sm font-bold mb-2" htmlFor="title">
                    Başlık
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newAnnouncement.title}
                    onChange={handleAnnouncementChange}
                    className="w-full px-3 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Duyuru başlığını giriniz"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-amber-800 text-sm font-bold mb-2" htmlFor="content">
                    İçerik
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={newAnnouncement.content}
                    onChange={handleAnnouncementChange}
                    className="w-full px-3 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Duyuru içeriğini giriniz"
                    rows="8"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label className="block text-amber-800 text-sm font-bold mb-2" htmlFor="image">
                    Görsel Ekle (İsteğe bağlı)
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {imageFile && (
                    <div className="mt-2 text-sm text-amber-600">
                      Seçilen görsel: {imageFile.name}
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={imageUploading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
                >
                  {imageUploading ? "Görsel Yükleniyor..." : "Duyuru Ekle"}
                </button>
              </form>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-amber-500 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Duyuru Listesi</h2>
              <span className="bg-white text-amber-500 text-sm font-bold py-1 px-3 rounded-full">
                {announcements.length} Duyuru
              </span>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-500"></div>
                </div>
              ) : (
                <div>
                  {announcements.length === 0 ? (
                    <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-lg p-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-amber-800 text-lg font-medium">Henüz duyuru bulunmamaktadır</p>
                      <p className="text-amber-600 mt-2">Yeni duyuru eklemek için formu kullanabilirsiniz</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {announcements.map((announcement) => (
                        <div 
                          key={announcement.id} 
                          className="border border-amber-200 rounded-lg p-4 bg-amber-50 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-amber-800">{announcement.title}</h3>
                              <p className="text-xs text-amber-600 mb-2">{announcement.date}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-600 font-medium text-sm py-1 px-3 rounded-full transition-colors"
                            >
                              Sil
                            </button>
                          </div>
                          {announcement.image_url && (
                            <div className="mt-2 mb-3">
                              <Image 
                                src={announcement.image_url} 
                                alt={announcement.title}
                                width={500}
                                height={300}
                                className="rounded-lg max-h-48 object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder-image.png";
                                  e.target.classList.add("opacity-50");
                                }}
                              />
                            </div>
                          )}
                          <p className="mt-2 text-amber-700 whitespace-pre-line">{announcement.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-amber-600 text-white mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Bal Küpü Duyuru Sistemi</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 