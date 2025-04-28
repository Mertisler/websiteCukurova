'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function KitapOkuDinlePage() {
  const searchParams = useSearchParams();
  const videoParam = searchParams.get('video');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videolar, setVideolar] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [loading, setLoading] = useState(true);

  const kitaplar = [
    {
      id: 1,
      baslik: "İşaret Dili ve Beden Dili",
      yazar: "Aylin Sönmez",
      aciklama: "İşaret dili ve beden dili hakkında temel bilgiler içeren interaktif bir kitap.",
      gorsel: "/placeholder-image.png"
    },
    {
      id: 2,
      baslik: "Engelsiz Yaşam",
      yazar: "Mehmet Yılmaz",
      aciklama: "Engelsiz bir dünya için bilinçlendirme ve farkındalık kitabı.",
      gorsel: "/placeholder-image.png"
    },
    {
      id: 3,
      baslik: "Bal ve Arı: İletişimin Gücü",
      yazar: "Zeynep Kaya",
      aciklama: "Etkili iletişim kurma sanatını arıların işbirliğinden öğreniyoruz.",
      gorsel: "/placeholder-image.png"
    }
  ];

  // YouTube URL'inden video ID'sini çıkaran fonksiyon
  const getYoutubeIdFromUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Videoları yerel depolamadan yükle
  useEffect(() => {
    setLoading(true);

    // Video verilerini dönüştürme fonksiyonu
    const processVideoData = (video) => {
      // Eğer youtubeId yoksa ama videoUrl varsa, ID'yi URL'den çıkar
      if (!video.youtubeId && video.videoUrl) {
        video.youtubeId = getYoutubeIdFromUrl(video.videoUrl);
      }
      // video_url varsa ve youtubeId yoksa, video_url'den ID çıkar
      else if (!video.youtubeId && video.video_url) {
        video.youtubeId = getYoutubeIdFromUrl(video.video_url);
      }
      
      // Başlığı kontrol et
      if (!video.title && video.baslik) {
        video.title = video.baslik;
      }
      
      // Açıklamayı kontrol et
      if (!video.description && video.content) {
        video.description = video.content;
      }
      
      return video;
    };

    // Önce API'den videoları almayı dene
    fetch('/api/videos')
      .then(response => {
        if (!response.ok) {
          throw new Error('API\'den videolar alınamadı');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.videos && data.videos.length > 0) {
          // API'den gelen videoları işle
          const processedVideos = data.videos.map(processVideoData);
          setVideolar(processedVideos);
          
          // URL'de belirtilen video var mı kontrol et
          if (videoParam) {
            const videoIndex = processedVideos.findIndex(video => 
              video.id.toString() === videoParam);
            if (videoIndex !== -1) {
              setSelectedVideo(videoIndex);
            }
          }
          
          // localStorage'a kaydet
          localStorage.setItem("videos", JSON.stringify(processedVideos));
        } else {
          // API'den veri gelmezse localStorage'a bak
          const storedVideos = localStorage.getItem("videos");
          
          if (storedVideos) {
            try {
              const parsedVideos = JSON.parse(storedVideos).map(processVideoData);
              setVideolar(parsedVideos);
              
              if (videoParam) {
                const videoIndex = parsedVideos.findIndex(video => 
                  video.id.toString() === videoParam);
                if (videoIndex !== -1) {
                  setSelectedVideo(videoIndex);
                }
              }
            } catch (error) {
              console.error("Yerel depolama okuma hatası:", error);
              showDefaultVideos();
            }
          } else {
            // Lokalde video yoksa varsayılan videoları göster
            showDefaultVideos();
          }
        }
      })
      .catch(error => {
        console.error("API hatası:", error);
        
        // API hatası durumunda localStorage'a bak
        try {
          const storedVideos = localStorage.getItem("videos");
          
          if (storedVideos) {
            const parsedVideos = JSON.parse(storedVideos).map(processVideoData);
            setVideolar(parsedVideos);
            
            if (videoParam) {
              const videoIndex = parsedVideos.findIndex(video => 
                video.id.toString() === videoParam);
              if (videoIndex !== -1) {
                setSelectedVideo(videoIndex);
              }
            }
          } else {
            showDefaultVideos();
          }
        } catch (err) {
          console.error("Veri işleme hatası:", err);
          showDefaultVideos();
        }
      })
      .finally(() => {
        setLoading(false);
      });
      
    // Varsayılan videoları gösteren yardımcı fonksiyon  
    function showDefaultVideos() {
      const defaultVideos = [
        {
          id: 1,
          title: "İşaret Dili Eğitimi - Temel İletişim",
          description: "Bu eğitim videosunda, işaret dilinde temel iletişim kurma becerilerini öğreneceksiniz. Günlük hayatta kullanılan temel işaretler, selamlaşma, teşekkür etme ve basit sohbetler için gereken işaretleri içerir.",
          youtubeId: "8645Yjp1tGA",
          date: new Date().toLocaleDateString('tr-TR')
        },
        {
          id: 2,
          title: "İşaret Dili - Pratik Gösterim",
          description: "Bu kısa videoda işaret dilinde pratik bir uygulama gösterilmektedir. Videoyu takip ederek işaret dilinde temel hareketleri uygulama fırsatı bulabilirsiniz.",
          youtubeId: "xtt9rMk-Ov0",
          date: new Date().toLocaleDateString('tr-TR')
        }
      ];
      
      setVideolar(defaultVideos);
      localStorage.setItem("videos", JSON.stringify(defaultVideos));
      
      if (videoParam && videoParam === "2") {
        setSelectedVideo(1);
      }
    }
  }, [videoParam]);

  // Video değiştiğinde yükleme durumunu sıfırla
  useEffect(() => {
    setVideoLoaded(false);
  }, [selectedVideo]);

  // Videoların olup olmadığını kontrol et
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
      </div>
    );
  }

  // Video yoksa kullanıcıya bilgi göster
  if (videolar.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10">
            <h1 className="text-3xl font-bold text-amber-800 mb-6">Kitap Oku ve Dinle</h1>
            <div className="bg-amber-50 p-8 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-bold text-amber-800 mb-2">Henüz Video Eklenmemiş</h2>
              <p className="text-amber-700">Yakında yeni videolar eklenecektir. Lütfen daha sonra tekrar kontrol edin.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentVideo = videolar[selectedVideo];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 -mt-10 -mr-10 bg-amber-300 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 -mb-8 -ml-8 bg-amber-300 rounded-full opacity-20"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-amber-800 mb-6 inline-block relative">
              <span className="relative z-10">Kitap Oku ve Dinle</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-300 opacity-50 z-0"></span>
            </h1>
            
            <p className="text-amber-700 mb-8">
              BalİZ Parmak Kulübü olarak okuma ve dinleme etkinliklerimiz ile bilgi ve ilham kaynağı olmayı hedefliyoruz.
              Aşağıda kulüp üyelerimiz için hazırladığımız eğitim videoları ve kitap önerilerini bulabilirsiniz.
            </p>
            
            {/* Video Seçici */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-700 mb-4">Eğitim Videoları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videolar.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(index)}
                    className={`p-3 text-left rounded-lg transition-all ${
                      selectedVideo === index
                        ? "bg-amber-500 text-white shadow-md transform -translate-y-1"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    <h3 className="font-bold">{video.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm truncate max-w-full">{video.description.substring(0, 50)}...</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Video Bölümü */}
            <div className="mb-12">
              <div className="bg-amber-50 p-4 rounded-lg mb-4">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  {!videoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-amber-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-500"></div>
                    </div>
                  )}
                  
                  {/* Video ID alınıyor */}
                  {(() => {
                    // Video ID'sini al 
                    const videoId = currentVideo.youtubeId || 
                                    getYoutubeIdFromUrl(currentVideo.videoUrl || currentVideo.video_url || "");
                    
                    // YouTube iframe'i göster
                    return (
                      <iframe 
                        className="absolute inset-0 w-full h-full rounded-lg shadow-lg" 
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                        title={currentVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        onLoad={() => setVideoLoaded(true)}
                      ></iframe>
                    );
                  })()}
                </div>
                
                <div className="mt-2 text-amber-700 text-center font-medium">
                  Video: {currentVideo.title}
                </div>
                
                {/* Doğrudan video bağlantısı */}
                <div className="mt-3 text-center">
                  <a 
                    href={currentVideo.videoUrl || currentVideo.video_url || `https://www.youtube.com/watch?v=${currentVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-amber-600 hover:text-amber-800 text-sm font-medium underline"
                  >
                    Videonun kaynağında açmak için tıklayın
                  </a>
                </div>
              </div>
              <div className="bg-amber-100 p-4 rounded-lg">
                <h3 className="font-bold text-amber-800 mb-2">Video Açıklaması</h3>
                <p className="text-amber-700">
                  {currentVideo.description}
                </p>
              </div>
            </div>
            
            {/* Kitap Önerileri */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-6">Kitap Önerileri</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {kitaplar.map((kitap) => (
                  <div key={kitap.id} className="bg-amber-50 rounded-lg overflow-hidden shadow-md border border-amber-200 transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="h-48 bg-amber-200 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-amber-800">{kitap.baslik}</h3>
                      <p className="text-amber-600 mb-2">Yazar: {kitap.yazar}</p>
                      <p className="text-amber-700">{kitap.aciklama}</p>
                      <a 
                        href="#" 
                        className="mt-4 inline-block bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded transition-colors"
                      >
                        Detaylar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-amber-100 p-6 rounded-lg border-2 border-dashed border-amber-300 text-center">
                <h3 className="text-xl font-bold text-amber-800 mb-3">Kitap Kulübüne Katılın</h3>
                <p className="text-amber-700 mb-4">
                  Her ay düzenlediğimiz kitap kulübü toplantılarında, engelsiz yaşam ve iletişim odaklı 
                  kitaplar hakkında tartışıyor, fikirlerimizi paylaşıyoruz.
                </p>
                <Link 
                  href="/iletisim" 
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Kitap Kulübüne Katıl
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 