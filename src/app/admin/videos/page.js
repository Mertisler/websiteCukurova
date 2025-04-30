"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image';

export default function VideoAdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ 
    title: "", 
    description: "",
    video_url: "",
    thumbnail_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ message: "", isError: false });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde oturum durumunu kontrol et
    try {
      const adminAuth = localStorage.getItem("adminAuth");
      if (adminAuth) {
        setIsLoggedIn(true);
        fetchVideos();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('localStorage erişim hatası:', error);
      setLoading(false);
    }
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      // API'den videoları çek
      const response = await fetch('/api/videos');
      if (!response.ok) {
        throw new Error('Videolar alınamadı');
      }
      
      const data = await response.json();
      if (data && data.videos) {
        setVideos(data.videos);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({ 
        message: "Videolar alınırken bir hata oluştu.", 
        isError: true 
      });
      
      setVideos([]);
      
      // 5 saniye sonra hata mesajını temizle
      setTimeout(() => {
        setStatusMessage({ message: "", isError: false });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setNewVideo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const uploadThumbnail = async () => {
    if (!thumbnailFile) return null;
    
    setImageUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', thumbnailFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Küçük resim yükleme başarısız oldu');
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.imageUrl;
      } else {
        console.error('Küçük resim yükleme hatası:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Küçük resim yükleme sırasında hata:', error);
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    
    if (!newVideo.title || !newVideo.video_url) {
      setStatusMessage({ message: "Başlık ve video URL alanları zorunludur!", isError: true });
      return;
    }
    
    // Eğer küçük resim seçildiyse yükle
    let thumbnailUrl = null;
    if (thumbnailFile) {
      thumbnailUrl = await uploadThumbnail();
      if (!thumbnailUrl) {
        setStatusMessage({ message: "Küçük resim yüklenemedi. Video küçük resim olmadan kaydedilecek.", isError: true });
      }
    }
    
    const video = {
      id: Date.now().toString(),
      title: newVideo.title,
      description: newVideo.description,
      videoUrl: newVideo.video_url, // API'ye uyumlu şekilde videoUrl olarak gönder
      thumbnail_url: thumbnailUrl || newVideo.thumbnail_url,
      date: new Date().toLocaleDateString('tr-TR')
    };
    
    try {
      // API'ye video ekleme isteği gönder
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(video),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error("JSON İşleme Hatası:", err);
        
        // JSON işleme hatası oluşursa, başarılı kabul et ve yerel kaydı yap
        setVideos([video, ...videos]);
        localStorage.setItem("videos", JSON.stringify([video, ...videos]));
        setNewVideo({ title: "", description: "", video_url: "", thumbnail_url: "" });
        setThumbnailFile(null);
        setStatusMessage({ message: "Video yerel olarak kaydedildi. Uzak sunucuyla iletişim kurulamadı.", isError: false });
        return;
      }
      
      if (!response.ok && !data.success) {
        throw new Error(data.error || 'Video eklenirken bir hata oluştu');
      }
      
      // Başarılı bir şekilde eklendiğinde, mevcut video listesini güncelle
      const eklenenVideo = data.video || video;
      
      // Video_url alanını ekrana gösterilecek veriler için ekle
      if (eklenenVideo.videoUrl && !eklenenVideo.video_url) {
        eklenenVideo.video_url = eklenenVideo.videoUrl;
      }
      
      const updatedVideos = [eklenenVideo, ...videos];
      setVideos(updatedVideos);
      
      // Yerel depolamayı da güncelle
      localStorage.setItem("videos", JSON.stringify(updatedVideos));
      
      setNewVideo({ title: "", description: "", video_url: "", thumbnail_url: "" });
      setThumbnailFile(null);
      setStatusMessage({ message: data.message || "Video başarıyla eklendi.", isError: false });
    } catch (error) {
      console.error(error);
      
      // Hata durumunda da yerel kayıt yap
      const updatedVideos = [video, ...videos];
      localStorage.setItem("videos", JSON.stringify(updatedVideos));
      setVideos(updatedVideos);
      setNewVideo({ title: "", description: "", video_url: "", thumbnail_url: "" });
      setThumbnailFile(null);
      
      setStatusMessage({ 
        message: "Video veritabanına eklenemedi fakat yerel olarak kaydedildi.", 
        isError: true 
      });
    }
    
    // 3 saniye sonra durum mesajını temizle
    setTimeout(() => {
      setStatusMessage({ message: "", isError: false });
    }, 3000);
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm("Bu videoyu silmek istediğinize emin misiniz?")) {
      try {
        // API'den video silme isteği gönder
        const response = await fetch(`/api/videos?id=${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok && !data.success) {
          throw new Error(data.error || 'Video silinirken bir hata oluştu');
        }
        
        // Videoyu listeden kaldır ve UI'ı güncelle
        const updatedVideos = videos.filter(v => String(v.id) !== String(id));
        setVideos(updatedVideos);
        setStatusMessage({ message: data.message || "Video başarıyla silindi.", isError: false });
        
        // 3 saniye sonra mesajı temizle
        setTimeout(() => {
          setStatusMessage({ message: "", isError: false });
        }, 3000);
      } catch (error) {
        console.error('Video silme hatası:', error);
        setStatusMessage({ 
          message: "Video silinirken bir hata oluştu: " + error.message, 
          isError: true 
        });
        
        // 5 saniye sonra hata mesajını temizle
        setTimeout(() => {
          setStatusMessage({ message: "", isError: false });
        }, 5000);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amber-50 to-amber-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden text-center p-6">
          <h2 className="text-2xl font-bold mb-4 text-amber-800">Yönetici Girişi Gerekli</h2>
          <p className="mb-6 text-amber-600">Bu sayfayı görüntülemek için yönetici olarak giriş yapmanız gerekmektedir.</p>
          <Link href="/admin" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg">
            Giriş Sayfasına Git
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Video Yönetimi</h1>
            <div className="flex space-x-4">
              <Link href="/admin" className="text-white hover:text-amber-200 transition-colors">
                Admin Paneline Dön
              </Link>
              <Link href="/" className="text-white hover:text-amber-200 transition-colors">
                Siteye Dön
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {statusMessage.message && (
          <div className={`${
            statusMessage.isError 
              ? 'bg-red-100 border-l-4 border-red-500 text-red-700' 
              : 'bg-green-100 border-l-4 border-green-500 text-green-700'
            } p-4 mb-6 rounded`} role="alert">
            <p>{statusMessage.message}</p>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-amber-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Yeni Video Ekle</h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleAddVideo}>
                <div className="mb-4">
                  <label className="block text-amber-800 text-sm font-bold mb-2" htmlFor="title">
                    Başlık
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newVideo.title}
                    onChange={handleVideoChange}
                    className="w-full px-3 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Video başlığını giriniz"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-amber-800 text-sm font-bold mb-2" htmlFor="description">
                    Açıklama
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newVideo.description}
                    onChange={handleVideoChange}
                    className="w-full px-3 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Video açıklamasını giriniz"
                    rows="4"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-amber-800 text-sm font-bold mb-2" htmlFor="video_url">
                    Video URL (YouTube)
                  </label>
                  <input
                    type="url"
                    id="video_url"
                    name="video_url"
                    value={newVideo.video_url}
                    onChange={handleVideoChange}
                    className="w-full px-3 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="YouTube video URL'sini giriniz"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Örnek: https://www.youtube.com/watch?v=XXXXXXXXXXX
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-amber-800 text-sm font-bold mb-2" htmlFor="thumbnail">
                    Küçük Resim (İsteğe bağlı)
                  </label>
                  <input
                    type="file"
                    id="thumbnail"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {thumbnailFile && (
                    <div className="mt-2 text-sm text-amber-600">
                      Seçilen görsel: {thumbnailFile.name}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Eğer görsel yüklemezseniz, YouTube küçük resmi otomatik olarak kullanılacaktır.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={imageUploading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
                >
                  {imageUploading ? "Görsel Yükleniyor..." : "Video Ekle"}
                </button>
              </form>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-amber-500 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Video Listesi</h2>
              <span className="bg-white text-amber-500 text-sm font-bold py-1 px-3 rounded-full">
                {videos.length} Video
              </span>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-500"></div>
                </div>
              ) : (
                <div>
                  {videos.length === 0 ? (
                    <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-lg p-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-amber-800 text-lg font-medium">Henüz video bulunmamaktadır</p>
                      <p className="text-amber-600 mt-2">Yeni video eklemek için formu kullanabilirsiniz</p>
                    </div>
                  ) : (
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                      {videos.map((video) => (
                        <div 
                          key={video.id} 
                          className="border border-amber-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
                        >
                          <div className="relative pb-[56.25%] bg-gray-100">
                            {video.thumbnail_url ? (
                              <Image 
                                src={video.thumbnail_url} 
                                alt={video.title}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder-video.png";
                                  e.target.classList.add("opacity-50");
                                }}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={() => handleDeleteVideo(video.id)}
                                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg"
                                title="Sil"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-white">
                            <h3 className="font-bold text-lg text-amber-800 mb-2">{video.title}</h3>
                            
                            {video.description && (
                              <p className="text-amber-700 text-sm mb-3 line-clamp-2">{video.description}</p>
                            )}
                            
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-amber-600">{video.date}</span>
                              <div className="flex space-x-2">
                                <Link 
                                  href={`/qr-kod?video=${video.id}`}
                                  target="_blank"
                                  className="bg-green-100 hover:bg-green-200 text-green-800 text-xs font-semibold py-1 px-3 rounded-full flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                  </svg>
                                  QR Kod
                                </Link>
                                <a 
                                  href={video.videoUrl || video.video_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold py-1 px-3 rounded-full"
                                >
                                  İzle
                                </a>
                              </div>
                            </div>
                          </div>
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
            <p>&copy; {new Date().getFullYear()} Bal Küpü Video Yönetim Sistemi</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 